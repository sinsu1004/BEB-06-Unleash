import React, { useContext, useState } from 'react';
import MyPageContents from '../components/MyPage_components/MyPage_contents';
import Layer from '../components/MyPage_components/Layer';
import { ethers, Contract } from 'ethers';
import Abi from '../resources/exAbi.json';
import MarketAbi from '../resources/MarketAbi.json';
import { ListContext } from '../resources/context_store/ListContext';
import DidLoading from '../components/DidLoading';
import Swal from 'sweetalert2';

const MyPage = () => {
  const context = useContext(ListContext);
  const { active, setActive } = context;
  const [active2, setActive2] = useState(false);

  const contractAddress = "0x951A005bbF1fBB90aeF00B29F5606805E647bDcA";
  const marketContractAddress = "0x8209ca01C432487c1d494A7E7104F447E45F01A2";

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new Contract(contractAddress, Abi, signer);
  const contract2 = new Contract(marketContractAddress, MarketAbi, signer);

  const text1 = "승인 처리중입니다 약 1~2분 정도 소요되며, 이더리움 Goerli 네트워크 상태에 따라 지연될수 있습니다."
  const text2 = "승인 처리중입니다 약 1~2분 정도 소요되며, 이더리움 Goerli 네트워크 상태에 따라 지연될수 있습니다."

  const handleApprove = async () => {
    setActive(true);
    try {
      const txHash = await contract.setApprovalForAll(
        marketContractAddress,
        true
      );
      const txResult = await txHash.wait();
      if (txResult) {
        setActive(false);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: '승인이 완료되었습니다.',
          showConfirmButton: false,
          timer: 1500
        })
      }
    } catch (e) {
      setActive(false);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: ' 승인에 실패했습니다. ',
        showConfirmButton: false,
        timer: 1500
      })
      console.log(e);
      return e;
    }
  };
  const handleTake = async () => {
    setActive2(true);
    try {
      const txHash = await contract2.withdraw();
      const txResult = await txHash.wait();
      if (txResult) {
        setActive2(false);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: '인출이 완료되었습니다.',
          showConfirmButton: false,
          timer: 1500
        })
      }
    } catch (e) {
      setActive2(false);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: ' 인출에 실패했습니다. ',
        showConfirmButton: false,
        timer: 1500
      })

      console.log(e);
      return e;
    }
  };

  return (
    <div className="mypage">
      {active ? <DidLoading text={text1}/> : ''}
      <div className="mypage_section1">
        <div className="mypage_section1_stage">
          <Layer />
        </div>
      </div>
      <div className="mypage_avatar_default" />
      <div className="mypage_approve">
        <button type="button" onClick={handleApprove}>
          Approve
        </button>
      </div>
      <div className="mypage_approve_money">
        <button type="button" onClick={handleTake}>
          Get ETH
        </button>
      </div>
      <MyPageContents />
      {active2 ? <DidLoading text={text2}/> : ''}
    </div>
  );
};

export default MyPage;
