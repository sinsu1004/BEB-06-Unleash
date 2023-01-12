import React, {useState, useContext} from "react";
import MarketPlaceCalander from "./MarketPlaceCalander";
import { TestContext } from "../../resources/context_store/Test";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { ListContext } from "../../resources/context_store/ListContext";
import Swal from 'sweetalert2';

const MarketPlaceAside = () => {
  const context = useContext(TestContext);
  const conetext2 = useContext(ListContext);
  const navigate = useNavigate();
  const {isOpen, setIsOpen} = context;
  const {setList} = conetext2;
  const ToBox = { Rome : "FCO" , Osaka : "ITM" , Sydney : "SYD" , NewYork : "JFK" , Paris: "CDG"}

  const [city, setCity] = useState('');
  const [departDate, setDepartDate] = useState(new Date('12/01/2022'));

  const cities = ["Paris", "NewYork", "Osaka", "Sydney", "Rome"]
  const [destination, setDestination] = useState("");
  const [bg, setBg] = useState(false);

  const handleDButtonClick = (e) => {
    setIsOpen(() => !isOpen);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city || !departDate){ return Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: '도시와 출발일자를 선택해주세요.',
      showConfirmButton: false,
      timer: 1500
    })
  }
    let filter = {city: city, departDate: departDate}
    let To = ToBox[filter.city];
    let params = {  "from" : "ICN" };
    params["to"] = To;
    params["departuretime"] = new Date(departDate.getTime() - (departDate.getTimezoneOffset() * 60000)).toISOString().substr(0, 11);
    axios.get('http://43.200.166.146:5001/marketplace/ticket', {params} )
    .then(res => {
      const data = res.data;
      const list = JSON.stringify([...data]);
      localStorage.setItem("marketList", list);
      setList(() => res.data);
      //window.location.reload();
    })
    .catch(e => {
      console.log(e);
      return e;
    })
  }
  const handleClick = (e) => {
    let value = e.currentTarget.attributes.value.value;
    setDestination(value);
    setCity(e.target.textContent)
  }
  // 전체 도시 리스트 완성되면 , 배열 만들어서 46번째 li부분 map처리.
  return (
    
      <div>
        <aside className="marketplace_contents_sidebar">
          <form className="marcketplace_contents_sidebar_container" onSubmit={handleSubmit}>
              <button type="button" className="marketplace_contents_collapse" onClick={handleDButtonClick}>Set Destination</button>
              {isOpen &&
              <ul className="marketplace_contents_destination" >
                <li value={cities[0]} onClick={handleClick} className={"marketplace_contents_li" + (destination == cities[0] ? " on" : "")}><p>{cities[0]}</p></li>
                <li value={cities[1]} onClick={handleClick} className={"marketplace_contents_li" + (destination == cities[1] ? " on" : "")}><p>{cities[1]}</p></li>
                <li value={cities[2]} onClick={handleClick} className={"marketplace_contents_li" + (destination == cities[2] ? " on" : "")}><p>{cities[2]}</p></li>
                <li value={cities[3]} onClick={handleClick} className={"marketplace_contents_li" + (destination == cities[3] ? " on" : "")}><p>{cities[3]}</p></li>
                <li value={cities[4]} onClick={handleClick} className={"marketplace_contents_li" + (destination == cities[4] ? " on" : "")}><p>{cities[4]}</p></li>
              </ul>}
            <MarketPlaceCalander departDate={departDate} setDepartDate={setDepartDate}/>
            <button className="marketplace_search" type="submit">search</button>
          </form>
        </aside>
      </div>
  );
};

export default MarketPlaceAside;
