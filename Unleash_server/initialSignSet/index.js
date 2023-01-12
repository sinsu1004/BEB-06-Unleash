const Abi = require("./contract/Abi.js");
const exAbi = require("./contract/exAbi.json");
const ethers = require("ethers");
const dotenv = require("dotenv");

dotenv.config();

const Sign = async (props) => {
  // props로 구매원하는 티켓의 voucher을 보낸다.

  const { token_id, price, totalsupply } = props;
  const contractAddress = "0x951A005bbF1fBB90aeF00B29F5606805E647bDcA";
  const privateKey = process.env.PRIVATE_KEY;

  let wallet = new ethers.Wallet(privateKey);
  let provider = ethers.providers.getDefaultProvider({
    name: "goerli",
    chainId: 5,
  });
  let walletWithProvider = new ethers.Wallet(privateKey, provider);

  const msg = [token_id, price, totalsupply];
  const contract = new ethers.Contract(
    contractAddress,
    exAbi,
    walletWithProvider
  );
  const msgHx = await contract._hash(msg);
  // Note: messageHash is a string, that is 66-bytes long, to sign the
  //       binary value, we must convert it to the 32 byte Array that
  //       the string represents
  //
  // i.e.
  //   // 66-byte string
  //   "0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba"
  //
  //   ... vs ...
  //
  //  // 32 entry Uint8Array
  //  [ 89, 47, 167, 67, 136, 159, 199, 249, 42, 194, 163,
  //    123, 177, 245, 186, 29, 175, 42, 92, 132, 116, 28,
  //    160, 224, 6, 29, 36, 58, 46, 103, 7, 186]
  const messageHashBytes = ethers.utils.arrayify(msgHx); // 위 주석처럼 이 과정을 거쳐야 제대로 sign이 됨
  const flatSig = await wallet.signMessage(messageHashBytes); // 우리가 원하는 최종 signature 해쉬값

  // @@@ 검증 단계 @@@
  // let sig = ethers.utils.splitSignature(flatSig);
  // let recovered = await contract.verifyHash(msgHx, sig.v, sig.r, sig.s);
  // console.log(recovered);

  return flatSig;
};

module.exports = { Sign };
