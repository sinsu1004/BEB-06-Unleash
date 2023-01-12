import React, {useContext, useEffect, useState} from "react";
import DefaultNft from "../components/NFTs/DefaultNft";
import FirstNFT from "../components/NFTs/FirstNFT"
import BusinessNFT from "../components/NFTs/BusinessNFT"
import { romaDummy, osakaDummy, sydneyDummy, newYorkDummy, parisDummy } from "../components/MarketPlace_components/MarketplaceDummy";
import { ListContext } from "../resources/context_store/ListContext";
import axios from "axios";

const P2PMarket = () => {
  const context = useContext(ListContext);
  const {p2pMarketList, setP2pMarketList,} = context;

  const [first, setFirst] = useState([]);
  const [business, setBusiness] = useState([]);
  const [economy, setEconomy] = useState([]);

  useEffect(() => {
    axios.get("http://43.200.166.146:5001/marketplace/market").then(res => {
      const data2 = res.data;
      setP2pMarketList(() => [...data2]);
    }).catch((e) => {
      console.log(e);
      return e;
    })
  }, []);

  useEffect(() => {
    setFirst(() => [...p2pMarketList].filter(item => item.token.class === "퍼스트"));
    setBusiness(() => [...p2pMarketList].filter(item => item.token.class === "비지니스"));
    setEconomy(() => [...p2pMarketList].filter(item => item.token.class === "이코노미"));
  }, [p2pMarketList]);

  const firstOsaka = [...first].filter(item => item.token.to === "ITM");
  const businessOsaka = [...business].filter(item => item.token.to === "ITM");
  const economyOsaka = [...economy].filter(item => item.token.to === "ITM");

  const firstRoma = [...first].filter(item => item.token.to === "FCO");
  const businessRoma = [...business].filter(item => item.token.to === "FCO");
  const economyRoma = [...economy].filter(item => item.token.to === "FCO");

  const firstSydney = [...first].filter(item => item.token.to === "SYD");
  const businessSydney = [...business].filter(item => item.token.to === "SYD");
  const economySydney = [...economy].filter(item => item.token.to === "SYD");

  const firstNewYork = [...first].filter(item => item.token.to === "JFK");
  const businessNewYork = [...business].filter(item => item.token.to === "JFK");
  const economyNewYork = [...economy].filter(item => item.token.to === "JFK");

  const firstParis = [...first].filter(item => item.token.to === "CDG");
  const businessParis = [...business].filter(item => item.token.to === "CDG");
  const economyParis = [...economy].filter(item => item.token.to === "CDG");

  return (
    <div className="marketplacep2p">
      <main className="marketplacep2p_main">
        <div className="marketplacep2p_container">
          <div className="marketplacep2p_section1">
            <div className="marketplacep2p_section1_img">
              <span>Unleash Market</span>
            </div>
          </div>
          <div className="marketplacep2p_info">
            <span>We believe,</span> 
            <span>there's a chance to<br/> unleash our identity with DID.</span>
            <span>This market is the result what we believe.</span>
            <span>Enjoy.</span>
          </div>
          {/* advanced */}
{/*           <div className="marketplacep2p_theme">
            <div><button></button></div>
            <div><button>Asia</button></div>
            <div><button></button></div>
            <div><button></button></div>
            <div><button></button></div>
          </div> */}
          <div className="marketplacep2p_nfts">
          {/* osaka roma newyork, sydney, paris 를 모두 분리해줘야함 first, second... */}
            {firstOsaka && firstOsaka.map((item, idx) => <FirstNFT key={idx} locate="/p2pdetailpage" bs="buy" bg={osakaDummy.nftImg} city={osakaDummy.city} price={item.price} departure={item.token.departuretime} arrival={item.token.arrivaltime} seller={item.seller} token_Id={item.token_id} offer_id={item.offer_id}/>)}
            {firstRoma && firstRoma.map((item, idx) => <FirstNFT key={idx} locate="/p2pdetailpage" bs="buy" bg={romaDummy.nftImg} city={romaDummy.city} price={item.price} departure={item.token.departuretime} arrival={item.token.arrivaltime} seller={item.seller} token_Id={item.token_id} offer_id={item.offer_id}/>)}
            {firstParis && firstParis.map((item, idx) => <FirstNFT key={idx} locate="/p2pdetailpage" bs="buy" bg={parisDummy.nftImg} city={parisDummy.city} price={item.price} departure={item.token.departuretime} arrival={item.token.arrivaltime} seller={item.seller} token_Id={item.token_id} offer_id={item.offer_id}/>)}
            {firstNewYork && firstNewYork.map((item, idx) => <FirstNFT key={idx} locate="/p2pdetailpage" bs="buy" bg={newYorkDummy.nftImg} city={newYorkDummy.city} price={item.price} departure={item.token.departuretime} arrival={item.token.arrivaltime} seller={item.seller} token_Id={item.token_id} offer_id={item.offer_id}/>)}
            {firstSydney && firstSydney.map((item, idx) => <FirstNFT key={idx} locate="/p2pdetailpage" bs="buy" bg={sydneyDummy.nftImg} city={sydneyDummy.city} price={item.price} departure={item.token.departuretime} arrival={item.token.arrivaltime} seller={item.seller} token_Id={item.token_id} offer_id={item.offer_id}/>)}

            {businessOsaka && businessOsaka.map((item, idx) => <BusinessNFT key={idx} locate="/p2pdetailpage" bs="buy" bg={osakaDummy.nftImg} city={osakaDummy.city} price={item.price} departure={item.token.departuretime} arrival={item.token.arrivaltime} seller={item.seller} token_Id={item.token_id} offer_id={item.offer_id}/>)}
            {businessRoma && businessRoma.map((item, idx) => <BusinessNFT key={idx} locate="/p2pdetailpage" bs="buy" bg={romaDummy.nftImg} city={romaDummy.city} price={item.price} departure={item.token.departuretime} arrival={item.token.arrivaltime} seller={item.seller} token_Id={item.token_id} offer_id={item.offer_id}/>)}
            {businessParis && businessParis.map((item, idx) => <BusinessNFT key={idx} locate="/p2pdetailpage" bs="buy" bg={parisDummy.nftImg} city={parisDummy.city} price={item.price} departure={item.token.departuretime} arrival={item.token.arrivaltime} seller={item.seller} token_Id={item.token_id} offer_id={item.offer_id}/>)}
            {businessNewYork && businessNewYork.map((item, idx) => <BusinessNFT key={idx} locate="/p2pdetailpage" bs="buy" bg={newYorkDummy.nftImg} city={newYorkDummy.city} price={item.price} departure={item.token.departuretime} arrival={item.token.arrivaltime} seller={item.seller} token_Id={item.token_id} offer_id={item.offer_id}/>)}
            {businessSydney && businessSydney.map((item, idx) => <BusinessNFT key={idx} locate="/p2pdetailpage" bs="buy" bg={sydneyDummy.nftImg} city={sydneyDummy.city} price={item.price} departure={item.token.departuretime} arrival={item.token.arrivaltime} seller={item.seller} token_Id={item.token_id} offer_id={item.offer_id}/>)}

            {economyOsaka && economyOsaka.map((item, idx) => <DefaultNft key={idx} locate="/p2pdetailpage" bs="buy" bg={osakaDummy.nftImg} city={osakaDummy.city} price={item.price} departure={item.token.departuretime} arrival={item.token.arrivaltime} seller={item.seller} token_Id={item.token_id} offer_id={item.offer_id}/>)}
            {economyRoma && economyRoma.map((item, idx) => <DefaultNft key={idx} locate="/p2pdetailpage" bs="buy" bg={romaDummy.nftImg} city={romaDummy.city} price={item.price} departure={item.token.departuretime} arrival={item.token.arrivaltime} seller={item.seller} token_Id={item.token_id} offer_id={item.offer_id}/> )}
            {economyParis && economyParis.map((item, idx) => <DefaultNft key={idx} locate="/p2pdetailpage" bs="buy" bg={parisDummy.nftImg} city={parisDummy.city} price={item.price} departure={item.token.departuretime} arrival={item.token.arrivaltime} seller={item.seller} token_Id={item.token_id} offer_id={item.offer_id}/>)}
            {economyNewYork && economyNewYork.map((item, idx) => <DefaultNft key={idx} locate="/p2pdetailpage" bs="buy" bg={newYorkDummy.nftImg} city={newYorkDummy.city} price={item.price} departure={item.token.departuretime} arrival={item.token.arrivaltime} seller={item.seller} token_Id={item.token_id} offer_id={item.offer_id}/>)}
            {economySydney && economySydney.map((item, idx) => <DefaultNft key={idx} locate="/p2pdetailpage" bs="buy" bg={sydneyDummy.nftImg} city={sydneyDummy.city} price={item.price} departure={item.token.departuretime} arrival={item.token.arrivaltime} seller={item.seller} token_Id={item.token_id} offer_id={item.offer_id}/>)}
          </div>
        </div>
      </main>
    </div>

  );
};

export default P2PMarket;
