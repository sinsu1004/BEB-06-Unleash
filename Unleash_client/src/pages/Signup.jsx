import { Fragment, useEffect , useState } from "react";
import Nationality_selectBox from '../components/Ticketing_selectBox/Nationality_selectBox';
import CountryCode_selectBox from '../components/Ticketing_selectBox/CountryCode_selectBox'; 
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';



function Signup() {
  const navigate = useNavigate();
  const [month, setMonth] = useState([ "Month" , "1" , "2" , "3" , "4" , "5" , "6" , "7" , "8" , "9" , "10" , "11" , "12"  ]);
  const [day , setDay] = useState([]);
  const [year , setYear] = useState([]);
  const [gender , setGender] = useState(["Select gender" , "Female" , "Male"]);

  const [r_month, setR_Month] = useState();
  const [r_day , setR_Day] = useState();
  const [r_year , setR_Year] = useState();

  const [account , setCurrentAccount ] = useState("");
  const [email , setEmail ] = useState("");
  const [sure_name , setSure_name ] = useState("");
  const [given_name , setGiven_name ] = useState("");
  const [nick_name , setNick_name ] = useState("");
  const [national , setNational ] = useState("");
  const [country_code , Setcountry_code ] = useState("");
  const [phone_number , SetPhone_number ] = useState("");

  const onChangeNation = (e) => {
    let value = e.target.value;
    setNational(value);
  }

  const onChangeCountryCode = (e) => {
    let value = e.target.value;
    Setcountry_code(value);
  }

  useEffect(() => {
    let result = ["Day"];
    for ( let i = 1; i < 32; i++) {
      result.push(i);
    }
    setDay(result);

    let result2 = ["Year"];
    for ( let i = 1900; i < 2022; i++) {
      result2.push(i);
    }
    setYear(result2);
  },[]);


  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: ' Get MetaMask! ',
          showConfirmButton: false,
          timer: 1500
        })
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const onSignUp = () => {
    let data = {};
    if ( r_month == "Month") {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Please enter the Month ',
        showConfirmButton: false,
        timer: 1500
      })
      return;
    }

    if ( r_day == "Day") {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Please enter the Day ',
        showConfirmButton: false,
        timer: 1500
      })
      return;
    }

    if ( r_year == "Year") {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Please enter the Year ',
        showConfirmButton: false,
        timer: 1500
      })
      return;
    }
    let birth = r_year + "-" + r_month.padStart(2 ,'0') + "-" + r_day.padStart(2 ,'0');

    data["email"] = email;
    data["sure_name"] = sure_name;
    data["given_name"] = given_name;
    data["nick_name"] = given_name;
    data["national"] = national;
    data["country_code"] = country_code;
    data["phone_number"] = phone_number;
    data["wallet_address"] = account;
    data["birth"] = birth;

    axios.post('http://43.200.166.146:5001/user/joinMembership', data )
    .then(function(res){
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: '회원가입에 성공했습니다',
        showConfirmButton: false,
        timer: 1500
      })
      navigate("/mainpage");
    }).catch(function (error) {
      console.log(error);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: error.response.data,
        showConfirmButton: false,
        timer: 1500
      })

    });
  }

  

  return (
    <div className="ticketing" >
      <div className="ticketing_center_box" >
        <div className="ticketing_title" >Create your account</div>
        <div className="tiketing_box" >

        <div className="tiketing_oneLine">
            <div className="tiketing_Line full" >
              <div className="tiketing_Line_text" >Nick name</div> 
              <input className="tiketing_Line_input" onChange={(e) => setNick_name(e.target.value)} value={nick_name} placeholder="Nick_name"  />
            </div>
          </div>

          <div className="tiketing_oneLine">
            <div className="tiketing_Line half" >
              <div className="tiketing_Line_text" >First name</div> 
              <input className="tiketing_Line_input" onChange={(e) => setSure_name(e.target.value)} value={sure_name} placeholder="First and middle name"  />
            </div>

            <div className="tiketing_Line half" >
              <div className="tiketing_Line_text" >Last name</div> 
              <input className="tiketing_Line_input" onChange={(e) => setGiven_name(e.target.value)} value={given_name} placeholder="Last name"  />
            </div>
          </div>

          <div className="tiketing_oneLine">
            <div className="tiketing_Line third" >
              <div className="tiketing_Line_text" >Date of birth</div> 
              <select className="tiketing_Line_selectBox" onChange={ (e) => setR_Month(e.target.value) }   >
                {month.map((value,key) => (
                  <option  key={key} value={value} >{value}</option>
                ))}
              </select>
            </div>

            <div className="tiketing_Line third" >
              <select className="tiketing_Line_selectBox" onChange={ (e) => setR_Day(e.target.value) }  >
                {day.map((value,key) => (
                  <option  key={key} value={value} >{value}</option>
                ))}
              </select>
            </div>

            <div className="tiketing_Line third" >
              <select className="tiketing_Line_selectBox" onChange={ (e) => setR_Year(e.target.value) }  >
                {year.map((value,key) => (
                  <option  key={key} value={value} >{value}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="tiketing_oneLine">
            <div className="tiketing_Line half" >
              <div className="tiketing_Line_text" >Gender</div> 
                <select className="tiketing_Line_selectBox" >
                {gender.map((value,key) => (
                  <option key={key} value={value} >{value}</option>
                ))}
               </select>
            </div>

            <div className="tiketing_Line half" >
              <div className="tiketing_Line_text" >Nationality</div> 
              <Nationality_selectBox onChangeNation={onChangeNation} />
            </div>
          </div>
          
          <div className="tiketing_oneLine">
            <div className="tiketing_Line third" >
              {/* <div className="tiketing_Line_text_bold">Contact information</div> */}
              <div className="tiketing_Line_text" >Country code</div> 
              <CountryCode_selectBox onChangeCountryCode={onChangeCountryCode} />
            </div>

            <div className="tiketing_Line sixty" >
              <div className="tiketing_Line_text" >Phone number</div> 
              <input className="tiketing_Line_input" onChange={(e) => SetPhone_number(e.target.value)} value={phone_number} placeholder="Enter phone number"  />
            </div>
          </div>

          <div className="tiketing_oneLine">
            <div className="tiketing_Line full" >
              <div className="tiketing_Line_text" >Email</div> 
              <input className="tiketing_Line_input"  onChange={(e) => setEmail(e.target.value)} value={email}  placeholder="Enter a valid email address"  />
            </div>
          </div>

          <div className="tiketing_oneLine">
            <div className="tiketing_Line sixty" >
              <div className="tiketing_Line_text" >Wallet</div> 
              <input className="tiketing_Line_input" value={account} onChange={ e => setCurrentAccount(e.target)}  placeholder="Wallet"  />
            </div>

            <div className={"connect_wallet_button" + ( account ? " on" : "") }  onClick={connectWallet} >Connect Wallet</div>
          </div>

          <div className="tiketing_finsh_button" onClick={onSignUp} >Finsh</div>

        </div>
      </div>
    </div>
  );
}

export default Signup;
