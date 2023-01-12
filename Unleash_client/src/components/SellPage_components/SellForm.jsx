import React, {useState, useContext} from "react";
import { ListContext } from "../../resources/context_store/ListContext";
import {ethers, Contract} from "ethers";
import MarketAbi from "../../resources/MarketAbi.json"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';


const SellForm = (props) => {
  const context = useContext(ListContext);
  const navigate = useNavigate();
  const {userData} = context;
  const {nft, setActive} = props

  
  const [price, setPrice] = useState('');

  const result = (price - price*0.025).toFixed(2);
  const marketContractAddress = "0x8209ca01C432487c1d494A7E7104F447E45F01A2";
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new Contract(marketContractAddress, MarketAbi, signer);

  const handleChange = (e) => {
    setPrice(e.target.value);
  }
  
  const handleSubmit = async (e) => {
    setActive(true);

    e.preventDefault();
    try {
      const txHash = await contract.sell(
        nft[0].token_id,
        price,
        1
      )
      const txResult =  await txHash.wait();
      const eventLogs = txResult.events;
      if (txResult) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: '리스팅에 성공했습니다.',
          showConfirmButton: false,
          timer: 1500
        })
        setActive(false);
        axios.post("http://43.200.166.146:5001/marketplace/sell", {
          event_id:parseInt(eventLogs[1].args.event_count,16),
          offer_id: parseInt(eventLogs[1].args.offerId,16),
          token_id: nft[0].token_id,
          price: price,
          amount: 1,
          seller: userData.wallet_address,
          user_id: userData.id
        }, {
          withCredentials: true
        })
        .then(res => {
          navigate("/marketplacep2p");
        })
        .catch(e => {
          setActive(false);
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: ' 데이터베이스와의 연결에 실패했습니다. ',
            showConfirmButton: false,
            timer: 1500
          })
          console.log(e);
          return e;
        });
      }
    } catch (e) {
      setActive(false);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: ' 리스팅에 실패했습니다. ',
        showConfirmButton: false,
        timer: 1500
      })
      console.log(e);
      return e;
    }
  }

  return (
    <form className="sellpage_listing_form" onSubmit={handleSubmit}>
      <div className="sellpage_type_button">
        <button type="button">Sell</button>
        <button type="button">Refund</button>
      </div>
      <div className="sellpage_listing_input">
        <span>Set a Price</span>
        <input type='text' onChange={handleChange} value={price}/>
      </div>
      <div className="sellpage_listing_summary">
        <span>Summary</span>
        <div className="sellpage_summary_details">
          <span>Listing price</span>
          <span>{price} ETH</span>
        </div>
        <div className="sellpage_summary_details">
          <span>Service fee</span>
          <span>2.5%</span>
        </div>
        <div className="sellpage_summary_details">
          <span>Listing price</span>
          <span>{result} ETH</span>
        </div>
      </div>
      <div className="sellpage_total">
        <span>Total potential earnings</span>
        <span>{result}ETH</span>
      </div>
      <button type="submit">Complete Listing</button>
    </form>
  );
};

export default SellForm;
