import React, {useState, useContext} from "react";
import {Link} from "react-router-dom";
import Tilt from 'react-parallax-tilt';
import { ListContext } from "../../resources/context_store/ListContext";
import {ethers, Contract} from "ethers"
import MarketAbi from "../../resources/MarketAbi.json"
import axios from "axios";
import Swal from 'sweetalert2';

//unleash contract 주소.


const FirstNFT = (props) => {
  const context = useContext(ListContext);
  const arr = Array.from(Array(11));
  const glare2 = "rgb(255, 119, 115) 10%, rgba(255,237,95,1) 20%, rgba(168,255,95,1) 30%, rgba(131,255,247,1) 40%, rgba(120,148,255,1) 50%, rgb(216, 117, 255) 60%, rgb(255, 119, 115) 70%, rgb(255, 119, 115) 80%, rgba(255,237,95,1) 90%, rgba(168,255,95,1) 100%"
  const [active, setActive1] = useState(false);

  const marketContractAddress = "0x8209ca01C432487c1d494A7E7104F447E45F01A2";
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new Contract(marketContractAddress, MarketAbi, signer);

  const {bg, locate, bs, locate2, bs2, price, departure, arrival, left, city, token_Id, seller, offer_id, amount} = props;
  const {listAll, p2pMarketList, accountNFT, loginStatus, userData, setActive , setSelectedNft} = context;
  
  const handleActive = (e) => {
    setActive1(() => !active);
  }
  const handleDefaultBuyClick = () => {
    if (!loginStatus) return Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: ' 지갑을 연결하세요! ',
      showConfirmButton: false,
      timer: 1500
    })
    const filtered = [...listAll].filter((item) => item.token_id === token_Id);
    const filtered2 = [...p2pMarketList].filter(item =>
      item.seller === seller && item.offer_id === offer_id);
    const local1 = JSON.stringify([...filtered]);
    const local2 = JSON.stringify([...filtered2]);
    localStorage.setItem("airlineNFT", local1);
    localStorage.setItem("p2pNFT", local2);
  }
  
  const handleSellClick = () => {
    if (!loginStatus) return Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: ' 지갑을 연결하세요! ',
      showConfirmButton: false,
      timer: 1500
    })
    const filtered3 = [...accountNFT].filter(item => item.token_id === token_Id);
    const local3 = JSON.stringify([...filtered3]);
    localStorage.setItem("sellNFT", local3);
  }
  // 고래 추가해야됨.
  const handleRetrieve = async () => {
    // 여기서 retireve. contract에서 cancel 함수 호출.
    setActive(true)
    try {
      const txHash = await contract.cancel(
        parseInt(offer_id)
      )
      const txResult = await txHash.wait();
      const eventLogs = txResult.events;
      if (txResult) {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: ' 리스팅이 취소되었습니다. ',
          showConfirmButton: false,
          timer: 1500
        })
        setActive(false);
        axios.put("http://43.200.166.146:5001/marketplace/cancel", {
          event_id:parseInt(eventLogs[1].args.event_count,16),
          offer_id : offer_id,
          amount : amount,
          user_id : userData.id,
          token_id : token_Id
        }, {
          withCredentials: true
        }).then(res => {
          console.log(res);
        }).catch(e => {
          console.log(e);
          return e;
        })
      }
    } catch(e) {
      setActive(false);
      console.log(e);
      return e;
    }
  }

  const handleChange = () => {
    const selectedNftData = [...accountNFT].filter(item => item.token_id === token_Id);
    setSelectedNft(selectedNftData);
  }

    return (
        <>
          <Tilt className={ active ? "Tilt" : ""} glareEnable={true} glareMaxOpacity={0.3} glarePosition="all"  transitionSpeed={400}  tiltMaxAngleX={30} tiltMaxAngleY={30} glareColor={glare2}
          scale={1.3}  style={{  zIndex : ( active ? 11 : 9 ) }}>
            <div className={active ? "default_nft_container_first_active" : "default_nft_container_first"} onClick={handleActive}>
              <div className="default_nft_img" style={{backgroundImage: `url(${bg})`}}>
                <div className="default_nft_whiteimg">
                  {arr.map((item, idx) => <span key={idx} style={{backgroundImage: `url(${bg})`}}></span>)}
                  <div className={active ? "default_nft_contents_contentwrapper_active" : "default_nft_contents_contentwrapper"}>
                    <h2>{city}</h2>
                    <p>Travel with Unleash</p>
                    {token_Id && <p>token_id : {token_Id}</p>}
                    {left && <p>left : {left}</p>}
                    {amount && <p>amount: {amount}</p>}
                    {price && <p>{price}ETH</p>}
                    <p>{departure}</p>
                    <p>{arrival}</p>
                  </div>
                  <div className="first_nft_poka" />
                </div>
              </div>
              <div className={active ? "default_nft_img_back_active" : "default_nft_img_back"} style={{backgroundImage: `url(${bg})`}}/>
            </div>
            <div className={active ? "nft_buy_button_active" : 'nft_buy_button'}>
              {bs === "buy"
              &&  <Link to={loginStatus ? locate : "" }>
                    <button onClick={handleDefaultBuyClick}>
                      {bs}
                    </button>
                  </Link>
                }
              {bs === "sell"
              &&  <Link to={loginStatus ? locate : "" }>
                    <button onClick={handleSellClick}>
                      {bs}
                    </button>
                  </Link>
                }
              {bs2 === "retrieve"
              &&  <Link to="">
                    <button onClick={handleRetrieve}>
                      {bs2}
                    </button>
                  </Link>
                }
              {bs2 === "change"
              &&  <Link to={locate2}>
                    <button  onClick={handleChange} >{bs2}</button>
                  </Link>
                }
            </div>
          </Tilt>

          {active && (
          <div className="dim" ></div>
        )}

        </>
        );
};

export default FirstNFT;
