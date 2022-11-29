import { Fragment, useEffect, useState , useContext } from "react";
import Nationality_selectBox from "../components/Ticketing_selectBox/Nationality_selectBox";
import CountryCode_selectBox from "../components/Ticketing_selectBox/CountryCode_selectBox";
import { ListContext } from "../resources/context_store/ListContext";

import {
  verifyJWT,
  DIDtoAddress,
  IATA_DID_Document,
  verifyVCID,
  verifyValidDelegate,
} from "../helper/DID";
import axios from "axios";

function DidCertification(props) {
  const context = useContext(ListContext);
  const { userData } = context;

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
  const [vc , setvc ] = useState("");


  const [vcJwt, setVcJwt] = useState(undefined);
  const [VCID, setVCID] = useState(undefined);
  const [claimMsg,setClaimMsg] = useState(undefined)

  const [credentialSubject, setCredentialSubject] = useState({
    sure_name: undefined,
    given_name: undefined,
    country_code: undefined,
    phone_number: undefined,
    national: undefined,
    email: undefined,
    DateOfIssue: undefined,
  });


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
    for (let i = 1; i < 32; i++) {
      result.push(i);
    }
    setDay(result);

    let result2 = ["Year"];
    for (let i = 1900; i < 2028; i++) {
      result2.push(i);
    }
    setYear(result2);
  }, []);

  // VC 발급
  const claimVC = async () => {
    try {
      props.setDidLoading(true);
      // VC 발급 및 갱신 요청
      const result = await axios.post(
        process.env.REACT_APP_IATA_BACKEND_URL + "did/claimVC",
        {
          walletAddress: userData.wallet_address,
        }
      );

      setVcJwt(result.data.vc);

      // JWT 검증
      const result_verifyJWT = await verifyJWT(result.data.vc);

      // 검증 실패 시
      if (!result_verifyJWT) {
        alert("유효하지 않은 VC 입니다.");
        props.setDidLoading(false);
        return;
      }

      // 검증 성공시 JWT Payload 데이터 조회
      const userInfo = result_verifyJWT.payload.vc.credentialSubject.user;
      const vcID = result_verifyJWT.issuer;

      setCredentialSubject(userInfo);
      setVCID(vcID);

    } catch (error) {
      if (error.response.status === 400) {
        props.setDidLoading(false);
        alert(
          "IATA에 회원가입된 정보가 없습니다. 회원가입을 먼저 진행해주세요."
        );
        return;
      }
      alert(error);
    } finally {
      props.setDidLoading(false);
    }
  };

  // VC 요청
  const requestVC = async () => {
    try {
      // IATA DB에 내 JWT VC 요청
      const result = await axios.post(
        process.env.REACT_APP_IATA_BACKEND_URL + "did/requestVC",
        {
          walletAddress: userData.wallet_address,
        }
      );

      if (result.status == 204) {
        alert("발급된 VC가 없습니다. 새로 발급 받아주세요.");
        return;
      }
      setVcJwt(result.data.vc);

      // JWT 검증
      const result_verifyJWT = await verifyJWT(result.data.vc);

      // 검증 실패 시
      if (!result_verifyJWT) {
        alert("유효하지 않은 VC 입니다.");
        return;
      }

      // 검증 성공시 JWT Payload 데이터 조회
      const userInfo = result_verifyJWT.payload.vc.credentialSubject.user;
      // const issuerInfo = result_verifyJWT.payload.vc.credentialSubject.issuer;
      const vcID = result_verifyJWT.issuer;
      // console.log(vcID);

      // 인증서 유효기간 검증
      const ID_Address = DIDtoAddress(vcID);
      const result_verifyValidDelegate = await verifyValidDelegate(ID_Address);

      //  유효기간 지나면
      if (!result_verifyValidDelegate) {
        alert("인증서의 유효기간이 지났습니다. VC 유효기간 갱신을 해주세요.");
        return;
      }

      setCredentialSubject(userInfo);
      setVCID(vcID);
      setUserData(userInfo);
      setvc(vcID);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };


  const setUserData = (data) => {

    setCurrentAccount(data.wallet_address);
    setEmail(data.email);
    setSure_name(data.sure_name);
    setGiven_name(data.given_name);
    setNick_name(data.nick_name);
    setNational(data.national);
    Setcountry_code(data.country_code);
    SetPhone_number(data.phone_number);

    let birth = data.DateOfIssue;

    setR_Year(birth.substr(0,4));
    var r_year = document.querySelector('#r_year');
    r_year.value = birth.substr(0,4);

    let month = birth.substr(5,2);
    if (month.substr(5,1) == "0") {
      month = birth.substr(6,1);
    }

    setR_Month(month);
    var r_month = document.querySelector('#r_month');
    r_month.value = month;


    let day = birth.substr(8,2);
    if (birth.substr(8,1) == "0") {
      day = birth.substr(8,1);
    }

    setR_Day(day);
    var r_day = document.querySelector('#r_day');
    r_day.value = day;

  }

  const onClickFinsh = () => {
    props.setticket(true);
  }

  return (
    <Fragment>
     
      <div className="didCertification_box">
        <div className="tiketing_box" style={{ marginTop: "100px" }} >
          <div className="tiketing_top">
            <div
              className="tiketing_finsh_button did"
              style={{ marginRight: "40px" }}
              onClick={requestVC}
            >
              Request VC
            </div>
            <div className="tiketing_finsh_button did" onClick={claimVC}>
              Claim VC
            </div>
            {claimMsg}
          </div>

          <div className="tiketing_oneLine">
            <div className="tiketing_Line full">
              <div className="tiketing_Line_text">Verifiable Credential</div>
              <input
                className="tiketing_Line_input"
                placeholder="Verifiable Credential"
                value={vc}
                onChange={(e) => setvc(e.target.value)}
              />
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
                <select className="tiketing_Line_selectBox" id="r_month" onChange={ (e) => setR_Month(e.target.value) } value={r_month}   >
                  {month.map((value,key) => (
                    <option  key={key} value={value} >{value}</option>
                  ))}
                </select>
              </div>

              <div className="tiketing_Line third" >
                <select className="tiketing_Line_selectBox" id="r_day" onChange={ (e) => setR_Day(e.target.value) } value={r_day}  >
                  {day.map((value,key) => (
                    <option  key={key} value={value} >{value}</option>
                  ))}
                </select>
              </div>

              <div className="tiketing_Line third" >
                <select className="tiketing_Line_selectBox" id="r_year" onChange={ (e) => setR_Year(e.target.value) } value={r_year}   >
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
                <Nationality_selectBox onChangeNation={onChangeNation}  national={national} />
              </div>
            </div>

            <div className="tiketing_oneLine">
              <div className="tiketing_Line third" >
                {/* <div className="tiketing_Line_text_bold">Contact information</div> */}
                <div className="tiketing_Line_text" >Country code</div> 
                <CountryCode_selectBox onChangeCountryCode={onChangeCountryCode} country_code={country_code} />
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

              <div className="connect_wallet_button on"  >Connect Wallet</div>
            </div>

            <div className="tiketing_finsh_button" onClick={onClickFinsh} >Finsh</div>
        </div>
      </div>
    </Fragment>
  );
}

export default DidCertification;
