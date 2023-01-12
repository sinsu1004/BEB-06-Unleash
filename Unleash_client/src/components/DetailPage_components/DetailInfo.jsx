import React, { useState, useEffect, useCallback } from 'react';
import {
  romaDummy,
  newYorkDummy,
  sydneyDummy,
  osakaDummy,
  parisDummy,
} from '../MarketPlace_components/MarketplaceDummy';
import { ethers, Contract } from 'ethers';
import axios from 'axios';
import { useContext } from 'react';
import { ListContext } from '../../resources/context_store/ListContext';
import Abi from '../../resources/exAbi.json';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const DetailInfo = props => {
  const context = useContext(ListContext);
  const { listAll, userData, setActive } = context;
  // 상태로 만들어버려서 로컬스토리지 고친 후 새로고침 하지 못하게.
  const navigate = useNavigate();
  const [number, setNumber] = useState('');
  const nft = JSON.parse(localStorage.getItem('airlineNFT'));

  const contractAddress = '0x951A005bbF1fBB90aeF00B29F5606805E647bDcA';
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new Contract(contractAddress, Abi, signer);

  const [destination, setDestination] = useState({});
  const [totalprice, setTotalPrice] = useState(nft[0].nftvoucher.price);
  const filtered = listAll.filter(item => {
    return (
      item.token_id === nft[0].token_id &&
      item.class === nft[0].class &&
      item.to === nft[0].to &&
      item.nftvoucher.price === nft[0].nftvoucher.price
    );
  });
  const filterNft = useCallback(() => {
    if (nft[0].to === 'ITM') return setDestination(osakaDummy); // 뒷정리함수.
    if (nft[0].to === 'JFK') return setDestination(newYorkDummy);
    if (nft[0].to === 'CDG') return setDestination(parisDummy);
    if (nft[0].to === 'SYD') return setDestination(sydneyDummy);
    if (nft[0].to === 'FCO') return setDestination(romaDummy);
  }, [nft])

  useEffect(() => {
    filterNft()
  }, [nft, filterNft]);

  const handleChange = e => {
    setNumber(e.target.value);
    setTotalPrice(() => Number(e.target.value) * nft[0].nftvoucher.price);
  };

  const handleSubmit = async e => {
    if(filtered.length === 0 || number === 0) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: '올바르지 않은 거래입니다.',
        showConfirmButton: false,
        timer: 1500
      })
      return navigate("/marketplace");
    }
    setActive(true);
    e.preventDefault();
    try {
      const call = await axios.get(
        `http://43.200.166.146:5001/marketplace/signature?token_id=${Number(
          nft[0].token_id
        )}`,
        {
          withCredentials: true,
        }
      );
      const signature = call.data.signature_data;
      const voucher = call.data.nftvoucher;
      const { token_id, price, totalsupply } = voucher[0];

      const txHash = await contract
        .connect(signer)
        .mint(
          userData.wallet_address,
          number,
          [token_id, price, totalsupply],
          signature,
          {
            value: totalprice * 10000,
          }
        );
      // price * number 해서 이더 보내기.
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
        setActive(false);
        const a = await axios.post(
          'http://43.200.166.146:5001/marketplace/mint',
          {
            event_id:parseInt(eventLogs[2].args.event_count,16),
            user_id: userData.id,
            token_id: nft[0].token_id,
            amount: number,
            price: nft[0].nftvoucher.price,
            buyer: userData.wallet_address,
          },
          { withCredentials: true }
        ).then(res => console.log(res))
        .catch((e) => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: '구매에 실패했습니다.',
            showConfirmButton: false,
            timer: 1500
          })
  
          setActive(false);
          console.log(e);
          return e;
        });
        console.log(a);
      }
    } catch (e) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: '구매에 실패했습니다.',
        showConfirmButton: false,
        timer: 1500
      })
      setActive(false);
      console.log(e);
      return e;
    }
  };

  return (
    <>
      <div className="detailpage_container_info">
        <div className="detailpage_personal_info">
          <span>
            {destination.city} TokenID: {nft[0].token_id}
          </span>
          <span>owned by airlines</span>
          <form onSubmit={handleSubmit}>
            <input type="text" value={number} onChange={handleChange} />
            <button type="submit">Buy</button>
          </form>
        </div>
        <div className="detailpage_price">
          <div className="detail_top">
            <span>Price</span>
          </div>
          <div className="detailpage_price_eth">
            <span>{totalprice} ETH</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailInfo;
