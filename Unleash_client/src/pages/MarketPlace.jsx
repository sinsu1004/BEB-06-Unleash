import React, {useContext, useEffect} from "react";
import MarketPlaceInfo from "../components/MarketPlace_components/MarketPlaceInfo";
import MarketPlaceSection1 from "../components/MarketPlace_components/MarketPlaceSection1";
import MarketPlaceContents from "../components/MarketPlace_components/MarketPlaceContents";
import Test from "../resources/context_store/Test";
import { ListContext } from "../resources/context_store/ListContext";
import axios from "axios";

const MarketPlace = (props) => {
  const context = useContext(ListContext);
  const {setListAll} = context;

  useEffect(() => {
    axios.get("http://43.200.166.146:5001/marketplace/ticket").then(res => {
      const data = res.data;
      setListAll([...data]);
    })
    console.log(1);
  }, [setListAll]);

  return (
    <>
      <div className="marketplace">
        <main className="marketplace_main">
          <div className="marketplace_container">
          <Test>
            <MarketPlaceSection1 />
            <MarketPlaceInfo />
            <MarketPlaceContents />
          </Test>
          </div>
        </main>
      </div>
    </>
  );
};

export default MarketPlace;
