import React from "react";
import DefaultNft from '../components/NFTs/DefaultNft'
import FirstNFT from '../components/NFTs/FirstNFT'

const NftDetailPage = () => {
  return (
    <>
      {/* 헤더헤더 */}
      <div className="detailpage">
        <div className="detailpage_container">
          <div className="detailpage_container_nft">
            <div className="detailpage_container_nft_container">
              <FirstNFT/>
              <div className="detailpage_nft_info">
                <span>Paris</span>

              </div>
            </div>
          </div>
          <div className="detailpage_container_info">
            infos
          </div>
        </div>
      </div>
    </>
  );
};
  
export default NftDetailPage;
