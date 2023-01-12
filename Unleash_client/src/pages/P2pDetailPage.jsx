import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DefaultNFT from '../components/NFTs/DefaultNft';
import FirstNFT from '../components/NFTs/FirstNFT';
import BusinessNFT from '../components/NFTs/BusinessNFT';
import {
  romaDummy,
  osakaDummy,
  sydneyDummy,
  newYorkDummy,
  parisDummy,
} from '../components/MarketPlace_components/MarketplaceDummy';
import { ethers, Contract } from 'ethers';
import { Data, LineChart, setChartDatas } from './LineChart';
import { ListContext } from '../resources/context_store/ListContext';
import LoadingPage from './LoadingPage';
import MarketAbi from '../resources/MarketAbi.json';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const P2pDetailPage = () => {
  const context = useContext(ListContext);
  const { p2pMarketList, active, setActive, userData } = context;
  const navigate = useNavigate();

  const p2pinfo = JSON.parse(localStorage.getItem('p2pNFT'));
  const [destination, setDestination] = useState({});
  const [chartData, setChartData] = useState(setChartDatas(Data));
  const [totalPrice, setTotalPrice] = useState(p2pinfo[0].price);

  //const contractAddress = '0x951A005bbF1fBB90aeF00B29F5606805E647bDcA';

  const marketContractAddress = "0x8209ca01C432487c1d494A7E7104F447E45F01A2";
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new Contract(marketContractAddress, MarketAbi, signer);

  const filtered = [...p2pMarketList].filter(item => {
    return (
      item.offer_id === p2pinfo[0].offer_id &&
      item.token_id === p2pinfo[0].token_id &&
      item.price === p2pinfo[0].price &&
      item.seller === p2pinfo[0].seller &&
      item.token.to === p2pinfo[0].token.to
    );
  });

  useEffect(() => {
    axios
      .get(
        `http://43.200.166.146:5001/marketplace/history?token_id=${p2pinfo[0].token_id}`
      ).then(res => {
        const data = res.data;
        setChartData(setChartDatas(data));
      }).catch((e) => {
        console.log(e);
        return e;
      });
      
    if (p2pinfo[0].token.to === 'ITM') return setDestination(osakaDummy);
    if (p2pinfo[0].token.to === 'JFK') return setDestination(newYorkDummy);
    if (p2pinfo[0].token.to === 'CDG') return setDestination(parisDummy);
    if (p2pinfo[0].token.to === 'SYD') return setDestination(sydneyDummy);
    if (p2pinfo[0].token.to === 'FCO') return setDestination(romaDummy);
    
  }, []);

  const handleSubmit = async (e) => {
    if(filtered.length === 0) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: ' 올바르지 않은 거래입니다. ',
        showConfirmButton: false,
        timer: 1500
      })
      return navigate("/marketplacep2p");
    }
    try {
      e.preventDefault();
      setActive(true);
      const txHash = await contract
        .buy(
          p2pinfo[0].offer_id,
          1,
        {
          value: totalPrice,
        });
      const txResult = await txHash.wait();
      const eventLogs = txResult.events;
      if (txResult) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: '구매에 성공했습니다.',
          showConfirmButton: false,
          timer: 1500
        })
        const a = await axios.put("http://43.200.166.146:5001/marketplace/buy", {
          event_id:parseInt(eventLogs[1].args.event_count,16),
          amount: 1,
          offer_id: p2pinfo[0].offer_id,
          user_id: userData.id,
          token_id: p2pinfo[0].token_id,
          buyer: userData.wallet_address
        }, {
          withCredentials: true
        }).catch(e => {
          console.log(e);
          return e;
        })
        console.log(a);
      }
      setActive(false);
    } catch (e) {
      console.log(e);
      setActive(false);
      return e;
    }
    // contract 연결
  };
  const handleChange = e => {
    setTotalPrice(p2pinfo[0].price);
  };

  return active ? (
    <LoadingPage />
  ) : (
    <main className="detailp2p_main">
      <div className="detailp2ppage_container">
        <div className="detailp2ppage_container_nft">
          <div className="detailp2ppage_container_nft_container">
            <div className="detailp2ppage_nft_top1">
              <span>NFT</span>
            </div>
            {p2pinfo[0].token.class === '퍼스트' && (
              <FirstNFT
                bg={destination.nftImg}
                city={destination.city}
                price={p2pinfo[0].token.price}
                departure={p2pinfo[0].token.departuretime}
                arrival={p2pinfo[0].token.arrivaltime}
                amount={p2pinfo[0].amount}
              />
            )}
            {p2pinfo[0].token.class === '비지니스' && (
              <BusinessNFT
                bg={destination.nftImg}
                city={destination.city}
                price={p2pinfo[0].token.price}
                departure={p2pinfo[0].token.departuretime}
                arrival={p2pinfo[0].token.arrivaltime}
                amount={p2pinfo[0].amount}
              />
            )}
            {p2pinfo[0].token.class === '이코노미' && (
              <DefaultNFT
                bg={destination.nftImg}
                city={destination.city}
                price={p2pinfo[0].token.price}
                departure={p2pinfo[0].token.departuretime}
                arrival={p2pinfo[0].token.arrivaltime}
                amount={p2pinfo[0].amount}
              />
            )}
          </div>
          <div className="detailp2ppage_nft_desc">
            <div className="detailp2p_top">
              <span>Description</span>
            </div>
            <ul className="detailp2ppage_nft_desc_list">
              <li>
                <span>class : {p2pinfo[0].token.class}</span>
              </li>
              <li>
                <span>from : ICN</span>
              </li>
              <li>
                <span>to : {p2pinfo[0].token.to}</span>
              </li>
              <li>
                <span>
                  departure : <br />
                  {p2pinfo[0].token.departuretime}
                </span>
              </li>
              <li>
                <span>
                  arrival : <br />
                  {p2pinfo[0].token.arrivaltime}
                </span>
              </li>
              <li>
                <span>
                  seller : <br />
                  {p2pinfo[0].seller}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="detailp2ppage_container_info">
          <div className="detailp2ppage_personal_info">
            <span>{destination.city} {p2pinfo[0].token_id}</span>
            <span>owned by {p2pinfo[0].seller}</span>
            <form onSubmit={handleSubmit}>
              <input type="text" value={1} onChange={handleChange} />
              <button type="submit">Buy</button>
            </form>
          </div>
          <div className="detailp2ppage_price">
            <div className="detailp2p_top">
              <span>Price</span>
            </div>
            <div className="detailp2ppage_price_eth">
              <span>{totalPrice} ETH</span>
            </div>
          </div>
          <div className="detailp2ppage_history">
            <div className="detailp2p_top">
              <span>Price History</span>
            </div>
            <div className="detailp2ppage_price_history">
              <LineChart chartData={chartData} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default P2pDetailPage;
