import React, {useState, useEffect} from "react";
import { romaDummy, newYorkDummy, sydneyDummy, osakaDummy, parisDummy } from "../MarketPlace_components/MarketplaceDummy";
import { ethers, Contract } from "ethers";
import axios from "axios";
import { useContext } from "react";
import { ListContext } from "../../resources/context_store/ListContext";
import Abi from "../../resources/exAbi.json"

const DetailInfo = (props) => {
  const context = useContext(ListContext);
  const {listAll, userData} = context;
  // 상태로 만들어버려서 로컬스토리지 고친 후 새로고침 하지 못하게.
  const [realOne, setRealOne] = useState('')
  
  
  const [number, setNumber] = useState('');
  const nft = JSON.parse(localStorage.getItem("airlineNFT"));
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  //const contract = new Contract(contractAddress, Abi, signer);

  const [destination, setDestination] = useState({});

  useEffect(() => {
    const filtered = listAll.filter((item) => {
      return item.token_id === nft[0].token_id
      && item.class === nft[0].class
      && item.to === nft[0].to
      && item.nftvoucher.price === nft[0].nftvoucher.price;
    });
    setRealOne(filtered);
    if (nft[0].to === "ITM") return setDestination(osakaDummy); // 뒷정리함수.
    if (nft[0].to === "JFK") return setDestination(newYorkDummy);
    if (nft[0].to === "CDG") return setDestination(parisDummy);
    if (nft[0].to === "SYD") return setDestination(sydneyDummy);
    if (nft[0].to === "FCO") return setDestination(romaDummy);
  }, [])
  const handleChange = (e) => {
    setNumber(e.target.value);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userData);
    if (!realOne) return alert("올바르지 않은 방식의 거래입니다.");
    try {
      const call = await axios.get("http://localhost:5001/marketplace/signature?token_id=1");
      const signature = call.data.signature_data;
      const tokenId = call.data.nftvoucher[0].token_id;
      console.log(tokenId)
/*       const txHash = await contract.connect(signer).mint(
        userData.wallet_address, [1, number], voucher, signature
      );
      const txResult =  await txHash.wait();
      console.log(txResult); */

    } catch(e) {
      console.log(e);
      return e;
    }
  }

  return (
    <>
      <div className="detailpage_container_info">
        <div className="detailpage_personal_info">
          <span>{destination.city} TokenID: {nft[0].token_id}</span>
          <span>owned by airlines</span>
          <form onSubmit={handleSubmit}>
            <input type="text" value={number} onChange={handleChange} />
            <button type="submit">Buy</button>
          </form>
        </div>
        <div className="detailpage_price">
          <div className="detail_top" >
            <span>Price</span>
          </div>
          <div className="detailpage_price_eth">
            <span>{nft[0].nftvoucher.price} ETH</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailInfo;
