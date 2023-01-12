import React, { useState, useEffect } from 'react';
import DefaultNft from '../NFTs/DefaultNft';
import FirstNFT from '../NFTs/FirstNFT';
import BusinessNFT from '../NFTs/BusinessNFT';
import axios from 'axios';
import {
  romaDummy,
  osakaDummy,
  sydneyDummy,
  newYorkDummy,
  parisDummy,
} from '../../components/MarketPlace_components/MarketplaceDummy';
import { useContext } from 'react';
import { ListContext } from '../../resources/context_store/ListContext';
import DidLoading from '../DidLoading';
import Swal from 'sweetalert2';

const MyPageContents = () => {
  const context = useContext(ListContext);
  const { accountNFT, setAccountNFT, userData, active } = context;

  const [first, setFirst] = useState([]);
  const [business, setBusiness] = useState([]);
  const [economy, setEconomy] = useState([]);

  const [bs, setBs] = useState('');
  const [bs2, setBs2] = useState('');

  useEffect(() => {
    setBs('sell');
    setBs2('change');
    axios
      .get(`http://43.200.166.146:5001/user/owned?user_id=${userData.id}`, {
        withCredentials: true,
      })
      .then(res => {
        const myToken = res.data.myToken;
        //const priceList = res.data.price_list;
        setAccountNFT([...myToken]);
      });
  }, [setAccountNFT, userData.id]);

  useEffect(() => {
    setFirst(() =>
      [...accountNFT].filter(item => item.token.class === '퍼스트')
    );
    setBusiness(() =>
      [...accountNFT].filter(item => item.token.class === '비지니스')
    );
    setEconomy(() =>
      [...accountNFT].filter(item => item.token.class === '이코노미')
    );
  }, [accountNFT]);

  const firstOsaka = [...first].filter(item => item.token.to === 'ITM');
  const businessOsaka = [...business].filter(item => item.token.to === 'ITM');
  const economyOsaka = [...economy].filter(item => item.token.to === 'ITM');

  const firstRoma = [...first].filter(item => item.token.to === 'FCO');
  const businessRoma = [...business].filter(item => item.token.to === 'FCO');
  const economyRoma = [...economy].filter(item => item.token.to === 'FCO');

  const firstSydney = [...first].filter(item => item.token.to === 'SYD');
  const businessSydney = [...business].filter(item => item.token.to === 'SYD');
  const economySydney = [...economy].filter(item => item.token.to === 'SYD');

  const firstNewYork = [...first].filter(item => item.token.to === 'JFK');
  const businessNewYork = [...business].filter(item => item.token.to === 'JFK');
  const economyNewYork = [...economy].filter(item => item.token.to === 'JFK');

  const firstParis = [...first].filter(item => item.token.to === 'CDG');
  const businessParis = [...business].filter(item => item.token.to === 'CDG');
  const economyParis = [...economy].filter(item => item.token.to === 'CDG');

  const status = ['owned', 'onSale', 'used', 'sold'];
  const [border, setBorder] = useState([true, false, false, false]);

  const handleClick = e => {
    const text = e.target.textContent;

    if (text === status[0]) {
      setBorder([true, false, false, false]);
      setBs('sell');
      setBs2('change');
      axios
        .get(`http://43.200.166.146:5001/user/owned?user_id=${userData.id}`, {
          withCredentials: true,
        })
        .then(res => {
          const myToken = res.data.myToken;
          setAccountNFT([...myToken]);
        })
        .catch(res => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'DB에서 데이터를 불러오지 못했습니다.',
            showConfirmButton: false,
            timer: 1500
          })
          console.log(e);
          return e;
        });
    }
    if (text === status[1]) {
      setBorder([false, true, false, false]);
      setBs('');
      setBs2('retrieve');
      axios
        .get(
          `http://43.200.166.146:5001/user/selling?seller=${userData.wallet_address}`,
          {
            withCredentials: true,
          }
        )
        .then(res => {
          const data = res.data;
          setAccountNFT([...data]);
        })
        .catch(e => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'DB에서 데이터를 불러오지 못했습니다.',
            showConfirmButton: false,
            timer: 1500
          })
          console.log(e);
          return e;
        });
    }
    if (text === status[2]) {
      setBs('');
      setBs2('');
      setBorder([false, false, true, false]);
      axios.get(`http://43.200.166.146:5001/user/used?seller=${userData.wallet_address}`, {
        withCredentials: true,
      })
      .then(res => {
        const data = res.data;
        setAccountNFT([...data]);
      }).catch(e => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'DB에서 데이터를 불러오지 못했습니다.',
          showConfirmButton: false,
          timer: 1500
        })
        console.log(e);
        return e;
      })
    }
    if (text === status[3]) {
      setBs('');
      setBs2('');
      setBorder([false, false, false, true]);
      axios
      .get(
        `http://43.200.166.146:5001/user/selled?seller=${userData.wallet_address}`,
        {
          withCredentials: true,
        }
      )
      .then(res => {
        const data = res.data;
        setAccountNFT([...data]);
      }).catch(e => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'DB에서 데이터를 불러오지 못했습니다.',
          showConfirmButton: false,
          timer: 1500
        })
        console.log(e);
        return e;
      });
    };
  };
  // if status 가 selling일 경우에, nft 보여줄때 bs를 retrieve로 바꿔서.

  return (
    <div className="mypage_contents">
      <ul className="mypage_contents_category">
        {status.map((item, idx) =>
          border[idx] ? (
            <li
              key={idx}
              onClick={handleClick}
              style={{
                borderBottom: '5px solid #c1121ec9',
                transition: '0.3s',
                borderRadius: '5px',
                paddingBottom: '3px',
              }}
            >
              <span>{item}</span>
            </li>
          ) : (
            <li key={idx} onClick={handleClick}>
              <span>{item}</span>
            </li>
          )
        )}
      </ul>
      <div className="mypage_contents_nfts">
        {firstOsaka &&
          firstOsaka.map((item, idx) => (
            <FirstNFT
              key={idx}
              locate="/sellpage"
              locate2="/ticketchangepage"
              bs={bs}
              bs2={bs2}
              bg={osakaDummy.nftImg}
              city={osakaDummy.city}
              price={item.token.price}
              departure={item.token.departuretime}
              arrival={item.token.arrivaltime}
              token_Id={item.token_id}
              offer_id={item.offer_id}
              amount={item.amount}
            />
          ))}
        {firstRoma &&
          firstRoma.map((item, idx) => (
            <FirstNFT
              key={idx}
              locate="/sellpage"
              locate2="/ticketchangepage"
              bs={bs}
              bs2={bs2}
              bg={romaDummy.nftImg}
              city={romaDummy.city}
              price={item.price}
              departure={item.token.departuretime}
              arrival={item.token.arrivaltime}
              token_Id={item.token_id}
              offer_id={item.offer_id}
              amount={item.amount}
            />
          ))}
        {firstParis &&
          firstParis.map((item, idx) => (
            <FirstNFT
              key={idx}
              locate="/sellpage"
              locate2="/ticketchangepage"
              bs={bs}
              bs2={bs2}
              bg={parisDummy.nftImg}
              city={parisDummy.city}
              price={item.price}
              departure={item.token.departuretime}
              arrival={item.token.arrivaltime}
              token_Id={item.token_id}
              offer_id={item.offer_id}
              amount={item.amount}
            />
          ))}
        {firstNewYork &&
          firstNewYork.map((item, idx) => (
            <FirstNFT
              key={idx}
              locate="/sellpage"
              locate2="/ticketchangepage"
              bs={bs}
              bs2={bs2}
              bg={newYorkDummy.nftImg}
              city={newYorkDummy.city}
              price={item.price}
              departure={item.token.departuretime}
              arrival={item.token.arrivaltime}
              token_Id={item.token_id}
              offer_id={item.offer_id}
              amount={item.amount}
            />
          ))}
        {firstSydney &&
          firstSydney.map((item, idx) => (
            <FirstNFT
              key={idx}
              locate="/sellpage"
              locate2="/ticketchangepage"
              bs={bs}
              bs2={bs2}
              bg={sydneyDummy.nftImg}
              city={sydneyDummy.city}
              price={item.price}
              departure={item.token.departuretime}
              arrival={item.token.arrivaltime}
              token_Id={item.token_id}
              offer_id={item.offer_id}
              amount={item.amount}
            />
          ))}

        {businessOsaka &&
          businessOsaka.map((item, idx) => (
            <BusinessNFT
              key={idx}
              locate="/sellpage"
              locate2="/ticketchangepage"
              bs={bs}
              bs2={bs2}
              bg={osakaDummy.nftImg}
              city={osakaDummy.city}
              price={item.price}
              departure={item.token.departuretime}
              arrival={item.token.arrivaltime}
              token_Id={item.token_id}
              offer_id={item.offer_id}
              amount={item.amount}
            />
          ))}
        {businessRoma &&
          businessRoma.map((item, idx) => (
            <BusinessNFT
              key={idx}
              locate="/sellpage"
              locate2="/ticketchangepage"
              bs={bs}
              bs2={bs2}
              bg={romaDummy.nftImg}
              city={romaDummy.city}
              price={item.price}
              departure={item.token.departuretime}
              arrival={item.token.arrivaltime}
              token_Id={item.token_id}
              offer_id={item.offer_id}
              amount={item.amount}
            />
          ))}
        {businessParis &&
          businessParis.map((item, idx) => (
            <BusinessNFT
              key={idx}
              locate="/sellpage"
              locate2="/ticketchangepage"
              bs={bs}
              bs2={bs2}
              bg={parisDummy.nftImg}
              city={parisDummy.city}
              price={item.price}
              departure={item.token.departuretime}
              arrival={item.token.arrivaltime}
              token_Id={item.token_id}
              offer_id={item.offer_id}
              amount={item.amount}
            />
          ))}
        {businessNewYork &&
          businessNewYork.map((item, idx) => (
            <BusinessNFT
              key={idx}
              locate="/sellpage"
              locate2="/ticketchangepage"
              bs={bs}
              bs2={bs2}
              bg={newYorkDummy.nftImg}
              city={newYorkDummy.city}
              price={item.price}
              departure={item.token.departuretime}
              arrival={item.token.arrivaltime}
              token_Id={item.token_id}
              offer_id={item.offer_id}
              amount={item.amount}
            />
          ))}
        {businessSydney &&
          businessSydney.map((item, idx) => (
            <BusinessNFT
              key={idx}
              locate="/sellpage"
              locate2="/ticketchangepage"
              bs={bs}
              bs2={bs2}
              bg={sydneyDummy.nftImg}
              city={sydneyDummy.city}
              price={item.price}
              departure={item.token.departuretime}
              arrival={item.token.arrivaltime}
              token_Id={item.token_id}
              offer_id={item.offer_id}
              amount={item.amount}
            />
          ))}

        {economyOsaka &&
          economyOsaka.map((item, idx) => (
            <DefaultNft
              key={idx}
              locate="/sellpage"
              locate2="/ticketchangepage"
              bs={bs}
              bs2={bs2}
              bg={osakaDummy.nftImg}
              city={osakaDummy.city}
              price={item.price}
              departure={item.token.departuretime}
              arrival={item.token.arrivaltime}
              token_Id={item.token_id}
              offer_id={item.offer_id}
              amount={item.amount}
            />
          ))}
        {economyRoma &&
          economyRoma.map((item, idx) => (
            <DefaultNft
              key={idx}
              locate="/sellpage"
              locate2="/ticketchangepage"
              bs={bs}
              bs2={bs2}
              bg={romaDummy.nftImg}
              city={romaDummy.city}
              price={item.price}
              departure={item.token.departuretime}
              arrival={item.token.arrivaltime}
              token_Id={item.token_id}
              offer_id={item.offer_id}
              amount={item.amount}
            />
          ))}
        {economyParis &&
          economyParis.map((item, idx) => (
            <DefaultNft
              key={idx}
              locate="/sellpage"
              locate2="/ticketchangepage"
              bs={bs}
              bs2={bs2}
              bg={parisDummy.nftImg}
              city={parisDummy.city}
              price={item.price}
              departure={item.token.departuretime}
              arrival={item.token.arrivaltime}
              token_Id={item.token_id}
              offer_id={item.offer_id}
              amount={item.amount}
            />
          ))}
        {economyNewYork &&
          economyNewYork.map((item, idx) => (
            <DefaultNft
              key={idx}
              locate="/sellpage"
              locate2="/ticketchangepage"
              bs={bs}
              bs2={bs2}
              bg={newYorkDummy.nftImg}
              city={newYorkDummy.city}
              price={item.price}
              departure={item.token.departuretime}
              arrival={item.token.arrivaltime}
              token_Id={item.token_id}
              offer_id={item.offer_id}
              amount={item.amount}
            />
          ))}
        {economySydney &&
          economySydney.map((item, idx) => (
            <DefaultNft
              key={idx}
              locate="/sellpage"
              locate2="/ticketchangepage"
              bs={bs}
              bs2={bs2}
              bg={sydneyDummy.nftImg}
              city={sydneyDummy.city}
              price={item.price}
              departure={item.token.departuretime}
              arrival={item.token.arrivaltime}
              token_Id={item.token_id}
              offer_id={item.offer_id}
              amount={item.amount}
            />
          ))}
      </div>
      {active ? <DidLoading /> : ""}
    </div>
  );
};

export default MyPageContents;
