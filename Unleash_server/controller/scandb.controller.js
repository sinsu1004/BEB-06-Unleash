require("dotenv").config();
const { db, sequelize } = require("../sequelize/models/index.js");
const { Op } = require("sequelize");
const ethers = require("ethers");
const unleashAbi = require("../initialSignSet/contract/exAbi.json");
const marketAbi = require("../initialSignSet/contract/MarketAbi.json");
const request = require("request");
const cron = require("node-cron");

const options = {
  uri: "https://api-goerli.etherscan.io/api",
  qs: {
    module: "logs",
    action: "getLogs",
    address: "0x951A005bbF1fBB90aeF00B29F5606805E647bDcA",
    apikey: "I6H77CGQG34JZ2K2VCQ5X7V5ZG6KA7Y86F",
    toBlock: "latest",
    fromBlock: 8143568,
  },
};
const options2 = {
  uri: "https://api-goerli.etherscan.io/api",
  qs: {
    module: "logs",
    action: "getLogs",
    address: "0x8209ca01C432487c1d494A7E7104F447E45F01A2",
    apikey: "I6H77CGQG34JZ2K2VCQ5X7V5ZG6KA7Y86F",
    toBlock: "latest",
    fromBlock: 8143570,
  },
};
const topics = {
  Mint: "0x5e9f1b91ac2555aca8bb40a54c7f2dce80d64e6691479bdaa76d263ecdf0422a",
  Sell: "0x52ffae6956c74a8994cf7da63a84f8cb9773701d4f1e3d80c2c0a97a7edbe279",
  Cancel: "0xc17970b9d27ad5565f566b527c1d2597c87a073a5ac78048e33a843c736aab68",
  Buy: "0x8d199a82ccc620c20ba34add31f2ae6172dc08c5ce065c0528a3edda296aaf85",
};
const dataDecryption = (data, status) => {
  if (status === "Mint") {
    return {
      status: "Mint",
      event_count: parseInt(data.substr(2, 64), 16),
      token_id: parseInt(data.substr(66, 64), 16),
      price: parseInt(data.substr(130, 64), 16),
      amount: parseInt(data.substr(194, 64), 16),
      buyer: "0x" + String(data.substr(258, 64)).substr(24, 64),
    };
  }

  if (status === "Sell") {
    return {
      status: "Sell",
      event_count: parseInt(data.substr(2, 64), 16),
      offer_id: parseInt(data.substr(66, 64), 16),
      token_id: parseInt(data.substr(130, 64), 16),
      price: parseInt(data.substr(194, 64), 16),
      amount: parseInt(data.substr(258, 64), 16),
      seller: "0x" + String(data.substr(322, 64)).substr(24, 64),
    };
  }
  if (status === "Cancel") {
    return {
      status: "Cancel",
      event_count: parseInt(data.substr(2, 64), 16),
      offer_id: parseInt(data.substr(66, 64), 16),
      token_id: parseInt(data.substr(130, 64), 16),
      amount: parseInt(data.substr(194, 64), 16),
      seller: "0x" + String(data.substr(258, 64)).substr(24, 64),
    };
  }
  if (status === "Buy") {
    return {
      status: "Buy",
      event_count: parseInt(data.substr(2, 64), 16),
      offer_id: parseInt(data.substr(66, 64), 16),
      token_id: parseInt(data.substr(130, 64), 16),
      price: parseInt(data.substr(194, 64), 16),
      amount: parseInt(data.substr(258, 64), 16),
      seller: "0x" + String(data.substr(322, 64)).substr(24, 64),
      buyer: "0x" + String(data.substr(386, 64)).substr(24, 64),
    };
  }
};

cron.schedule("*/10 * * * *", () => {
  request(options, async (err, res, body) => {
    const unleashData = JSON.parse(body)
      .result.filter((data) => data.topics[0] == topics.Mint)
      .map((el) => {
        return dataDecryption(el.data, "Mint");
      });
    const dbData = await db.transaction.findAll({
      where: {
        status: "Mint",
      },
    });
    if (unleashData.length !== dbData.length) {
      const dbEvent_lst = dbData.map((el) => {
        return el.dataValues.event_id;
      });
      const event_data = unleashData.filter((el) => {
        return !dbEvent_lst.includes(el.event_count);
      });
      console.log(event_data);
      event_data.forEach((el) => {
        if (el.status === "Mint") {
          mintTransction(el);
        }
      });
    }
  }).pipe(
    request(options2, async (err, res, body) => {
      const marketData = JSON.parse(body)
        .result.map((el) => {
          if (el.topics[0] == topics.Sell) {
            return dataDecryption(el.data, "Sell");
          }
          if (el.topics[0] == topics.Cancel) {
            return dataDecryption(el.data, "Cancel");
          }
          if (el.topics[0] == topics.Buy) {
            return dataDecryption(el.data, "Buy");
          }
        })
        .filter((el) => el !== undefined);
      const dbData = await db.transaction.findAll({
        where: {
          status: { [Op.ne]: "Mint" },
        },
      });
      if (marketData.length !== dbData.length) {
        const dbEvent_lst = dbData.map((el) => {
          return el.dataValues.event_id;
        });
        const event_data = marketData.filter((el) => {
          return !dbEvent_lst.includes(el.event_count);
        });
        event_data.forEach((el) => {
          if (el.status === "Sell") {
            sellTransction(el);
          }
          if (el.status === "Buy") {
            buyTransction(el);
          }
          if (el.status === "Cancel") {
            cancelTransction(el);
          }
        });
      }
    })
  );
});
const mintTransction = async (el) => {
  const transaction = await sequelize.transaction();
  try {
    const user_id = await db.user.findOne({
      where: {
        wallet_address: el.buyer,
      },
    });
    const token_holder = await db.token_holder.findAll(
      {
        where: {
          [Op.and]: [
            { user_id: user_id.dataValues.id },
            {
              token_id: el.token_id,
            },
          ],
        },
      },
      { transaction }
    );
    if (token_holder.length === 0) {
      await db.token_holder.create(
        {
          user_id: user_id.dataValues.id,
          token_id: el.token_id,
          amount: el.amount,
        },
        { transaction }
      );
    }
    if (token_holder.length !== 0) {
      await db.token_holder.increment(
        {
          amount: el.amount,
        },
        {
          where: {
            [Op.and]: [
              { user_id: user_id.dataValues.id },
              { token_id: el.token_id },
            ],
          },
        },
        { transaction }
      );
    }
    await db.transactionHistory.create(
      {
        token_id: el.token_id,
        offer_id: 0,
        price: el.price,
        amount: el.amount,
        buyer: el.buyer,
        seller: "Unleash",
        state: "mint",
      },
      { transaction }
    );
    await db.transaction.create(
      {
        status: "Mint",
        event_id: el.event_count,
        token_id: el.token_id,
        price: el.price,
        amount: el.amount,
        buyer: el.buyer,
      },
      { transaction }
    );
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    console.log(err);
  }
};

const sellTransction = async (el) => {
  const transaction = await sequelize.transaction();
  try {
    const user_id = await db.user.findOne({
      where: {
        wallet_address: el.seller,
      },
    });
    await db.marketplace.create(
      {
        offer_id: el.offer_id,
        token_id: el.token_id,
        price: el.price,
        amount: el.amount,
        seller: el.seller,
      },
      { transaction }
    );
    await db.token_holder.decrement(
      {
        amount: el.amount,
      },
      {
        where: {
          [Op.and]: [
            {
              token_id: el.token_id,
            },
            {
              user_id: user_id.dataValues.id,
            },
          ],
        },
      },
      { transaction }
    );
    await db.transactionHistory.create(
      {
        token_id: el.token_id,
        offer_id: el.offer_id,
        price: el.price,
        amount: el.amount,
        buyer: "Unleash",
        seller: el.seller,
        state: "sell",
      },
      { transaction }
    );
    await db.transaction.create(
      {
        status: "Sell",
        event_id: el.event_count,
        token_id: el.token_id,
        offer_id: el.offer_id,
        price: el.price,
        amount: el.amount,
        seller: el.seller,
      },
      { transaction }
    );
    await transaction.commit();
  } catch (err) {
    console.log(err);
    await transaction.rollback();
  }
};

const buyTransction = async (el) => {
  const transaction = await sequelize.transaction();
  try {
    const user_id = await db.user.findOne({
      where: {
        wallet_address: el.buyer,
      },
    });
    await db.marketplace.decrement(
      {
        amount: el.amount,
      },
      {
        where: {
          offer_id: el.offer_id,
        },
      },
      { transaction }
    );

    const token_holder = await db.token_holder.findAll(
      {
        where: {
          [Op.and]: [
            { user_id: user_id.dataValues.id },
            {
              token_id: el.token_id,
            },
          ],
        },
      },
      { transaction }
    );
    const market_data = await db.marketplace.findOne(
      {
        where: {
          offer_id: el.offer_id,
        },
      },
      { transaction }
    );

    if (token_holder.length === 0) {
      await db.token_holder.create(
        {
          user_id: user_id.dataValues.id,
          token_id: el.token_id,
          amount: el.amount,
        },
        { transaction }
      );
    }
    if (token_holder.length !== 0) {
      await db.token_holder.increment(
        {
          amount: el.amount,
        },
        {
          where: {
            [Op.and]: [
              { user_id: user_id.dataValues.id },
              { token_id: el.token_id },
            ],
          },
        },
        { transaction }
      );
    }
    await db.transactionHistory.create(
      {
        seller: el.seller,
        token_id: el.token_id,
        offer_id: el.offer_id,
        buyer: el.buyer,
        price: el.price,
        amount: el.amount,
        state: "buy",
      },
      { transaction }
    );

    await db.transaction.create(
      {
        status: "Buy",
        event_id: el.event_count,
        offer_id: el.offer_id,
        token_id: el.token_id,
        price: el.price,
        amount: el.amount,
        buyer: el.buyer,
        seller: el.seller,
      },
      { transaction }
    );
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
  }
};

const cancelTransction = async (el) => {
  const transaction = await sequelize.transaction();
  try {
    const user_id = await db.user.findOne({
      where: {
        wallet_address: el.seller,
      },
    });
    await db.marketplace.update(
      {
        amount: 0,
      },
      {
        where: {
          offer_id: el.offer_id,
        },
      },
      { transaction }
    );
    await db.token_holder.increment(
      {
        amount: el.amount,
      },
      {
        where: {
          [Op.and]: [
            { user_id: user_id.dataValues.id },
            { token_id: el.token_id },
          ],
        },
      },
      { transaction }
    );
    await db.transactionHistory.create(
      {
        token_id: el.token_id,
        offer_id: el.offer_id,
        amount: el.amount,
        seller: "Unleash",
        state: "cancel",
      },
      { transaction }
    );
    await db.transaction.create(
      {
        status: "Cancel",
        event_id: el.event_count,
        offer_id: el.offer_id,
        token_id: el.token_id,
        amount: el.amount,
        seller: el.seller,
      },
      { transaction }
    );
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    console.log(err);
  }
};
