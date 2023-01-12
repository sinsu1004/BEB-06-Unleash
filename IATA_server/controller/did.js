const { ethers } = require('ethers');
const { EthrDID, DelegateTypes } = require('ethr-did');
const {
  createVerifiableCredentialJwt,
  verifyCredential,
} = require('did-jwt-vc');
const { getDate } = require('../helper/did');
const db = require('../sequelize/models');

require('dotenv').config();
const chainNameOrId = 5;
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const ISSUER_PK = process.env.ISSUER_PK;
const ISSUER_ADDRESS = process.env.ISSUER_ADDRESS;

const ISSUER_Signer = new ethers.Wallet(ISSUER_PK, provider);

// Issuer DID
const ISSUER_Did = new EthrDID({
  identifier: ISSUER_ADDRESS,
  privateKey: ISSUER_PK,
  provider: ISSUER_Signer.provider,
  chainNameOrId,
  txSigner: ISSUER_Signer,
  alg: 'ES256K',
});

module.exports = {
  claimVC: async (req, res) => {
    let responseData;
    try {
      const { walletAddress, expiresIn } = req.body;

      // 회원 정보 조회
      const userInfo = await db['user'].findOne({
        where: {
          wallet_address: walletAddress,
        },
      });

      // RETURN : 회원정보 없을 경우 return Error
      if (userInfo == null) {
        responseData = {
          message: 'No User Info',
        };
        return res.status(400).send(responseData);
      }

      // Create Holder DID
      const subjectDid = new EthrDID({
        chainNameOrId,
        identifier: walletAddress,
      });

      // User Info From DB
      const {
        email,
        sure_name,
        given_name,
        nick_name,
        national,
        country_code,
        phone_number,
        wallet_address,
      } = userInfo;

      // W3C 표준 V1 데이터 모델 Credential 데이터
      const vcPayload = {
        sub: subjectDid.did,
        vc: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential'],
          credentialSubject: {
            issuer: {
              Authority: 'IATA',
              Message:
                'This Credentials is valid for all countries unless otherwise endorsed.',
              Address: ISSUER_ADDRESS,
            },
            user: {
              email,
              sure_name,
              given_name,
              nick_name,
              national,
              country_code,
              phone_number,
              wallet_address,
              DateOfIssue: getDate(),
            },
          },
        },
      };

      // ISSUER : VC ID 생성 후, ERC1056 DID Registry에 등록
      const addDelegate = await ISSUER_Did.createSigningDelegate(
        DelegateTypes.veriKey,
        expiresIn
      );

      // VC JWT 서명할 VC ID 준비
      const issuerDelegateKp = new EthrDID(
        Object.assign(Object.assign({}, addDelegate.kp), { chainNameOrId })
      );

      // Sign JWT VC : 최종적인 JWT VC 데이터
      const vcJwt = await createVerifiableCredentialJwt(
        vcPayload,
        issuerDelegateKp
      );

      // 기존 VC 있는지 확인
      // const vcInfo = await db['vc_list'].findOne({
      //   where: {
      //     user_id: userInfo.id,
      //   },
      // });

      // RETURN : 기존 VC 있는 경우 갱신, UPDATE
      // if (vcInfo !== null) {
      //   const vcSaveInfo = await db['vc_list'].update(
      //     {
      //       vc: vcJwt,
      //     },
      //     {
      //       where: {
      //         user_id: userInfo.id,
      //       },
      //     }
      //   );
      //   responseData = {
      //     user_id: vcInfo.user_id,
      //     did: vcInfo.did,
      //     vc: vcJwt,
      //   };
      //   return res.status(200).send(responseData);
      // }

      // 기존 VC 없는 경우 발급, INSERT
      // const vcSaveInfo = await db['vc_list'].create({
      //   user_id: userInfo.id,
      //   did: subjectDid.did,
      //   vc: vcJwt,
      // });

      responseData = {
        vc: vcJwt,
      };
      return res.status(200).send(responseData);
    } catch (error) {
      responseData = {
        message: 'Claim VC API ERROR',
        error,
      };
      return res.status(404).send(responseData);
    }
  },

  // DID VC는 SSI를 실형하기 위해 유저가 보관해야 한다는 피드백으로 DB에 저장된 VC JWT 요청 API 삭제
  // requestVC: async (req, res) => {
  //   let responseData;
  //   try {
  //     const { walletAddress } = req.body;

  //     // Create Holder DID
  //     const subjectDid = new EthrDID({
  //       chainNameOrId,
  //       identifier: walletAddress,
  //     });

  //     const vcInfo = await db['vc_list'].findOne({
  //       where: {
  //         did: subjectDid.did,
  //       },
  //     });

  //     // RETURN : vc 정보가 없을 경우 return Error
  //     if (vcInfo == null) {
  //       responseData = {
  //         vc: null,
  //       };
  //       return res.status(204).send(responseData);
  //     }

  //     responseData = {
  //       vc: vcInfo.vc,
  //     };
  //     return res.status(200).send(responseData);
  //   } catch (error) {
  //     console.log(`Request VC API ERROR : ${error}`);
  //     responseData = {
  //       ok: false,
  //       message: 'Request VC API ERROR',
  //       data: {
  //         error: error,
  //       },
  //     };
  //     return res.status(404).send(responseData);
  //   }
  // },
};
