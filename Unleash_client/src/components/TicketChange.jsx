import { GiCommercialAirplane } from 'react-icons/gi';
import { useContext } from "react";
import { ListContext } from "../resources/context_store/ListContext";

const TicketChange = (props) => {
  const context = useContext(ListContext);
  const {  selectedNft } = context;


    return (
       <div className="ticket-system">
          <div className="top">
            <h1 className="title">Wait a second, your ticket is being printed</h1>
            <div className="printer" />
          </div>
          <div className="receipts-wrapper">
            <div className={"receipts" + (props.ticket ? " on" : ""  ) }>
              <div className="receipt">
                {/* <svg className="airliner-logo" viewBox="0 0 403 94" xmlns="http://www.w3.org/2000/svg" serif="http://www.serif.com/" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414">
                  <path d="M402.772 59.544c0-13.172-9.632-16.649-21.203-20.114-5.601-1.644-10.58-3.115-10.58-7.98 0-4.271 4.319-5.691 7.571-5.691 2.738 0 7.917.578 8.342 6.918h14.702c-.252-12.098-10.128-17.364-22.78-17.364-7.835 0-14.34 2.226-18.431 6.246-2.835 2.808-4.578 6.922-4.578 11.209 0 11.122 7.418 15.579 15.823 18.123 9.431 2.879 15.669 4.606 15.669 9.801 0 3.462-2.741 6.927-8.161 6.927-6.914 0-9.415-4.118-9.581-8.165h-14.843c0 13.757 11.587 18.803 24.424 18.803 16.37 0 23.626-9.321 23.626-18.713m-53.36 0c0-13.172-9.584-16.649-21.171-20.114-5.585-1.644-10.6-3.115-10.6-7.98 0-4.271 4.338-5.691 7.587-5.691 2.757 0 7.913.578 8.326 6.918h14.675c-.244-12.098-10.073-17.364-22.749-17.364-7.839 0-14.348 2.226-18.415 6.246-2.831 2.808-4.582 6.922-4.582 11.209 0 11.122 7.418 15.579 15.835 18.123 9.415 2.879 15.673 4.606 15.673 9.801 0 3.462-2.745 6.927-8.169 6.927-6.922 0-9.431-4.118-9.581-8.165h-14.835c0 13.757 11.586 18.803 24.416 18.803 16.326 0 23.59-9.321 23.59-18.713m-166.379 0c0-11.453-6.077-15.288-19.366-19.622-6.266-2.037-12.106-3.607-12.106-8.472 0-4.271 4.338-5.691 7.587-5.691 2.749 0 7.929.578 8.349 6.918h14.659c-.252-12.098-10.088-17.364-22.749-17.364-7.846 0-14.328 2.226-18.418 6.246-2.844 2.808-4.578 6.922-4.578 11.209 0 11.122 7.425 15.579 15.814 18.123 9.44 2.879 15.678 4.606 15.678 9.801 0 3.462-2.75 6.927-8.181 6.927-6.891 0-9.404-4.118-9.561-8.165h-14.844c0 13.757 11.603 18.803 24.405 18.803 16.349 0 23.311-9.321 23.311-18.713m74.787-42.843l-9.978 40.035-11.689-40.035h-14.981l-11.681 40.035-10.006-40.035h-15.162l16.491 59.739h16.02l11.822-40.966 11.827 40.966h16l16.542-59.739H257.82zm36.723 59.739h-15.516V16.701h15.516V76.44zM102.141 93.347H0L74.861 0h50.276l-22.996 93.347z" fill="#dc2f34" />
                  <path d="M86.514 38.058V17.96H69.291v20.098H49.193v17.223h20.079v20.106h17.23V55.281h20.11V38.058H86.514z" fill="#fff" />
                </svg> */}
                <div className="Header_logo_border">
                  <GiCommercialAirplane className="Header_logo" />
                </div>
                <div className="Header_logo_text">𝙐𝙣𝙡𝙚𝙖𝙨𝙝</div>
                <div className="route">
                  <h2>ICN</h2>
                  <svg className="plane-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 510 510">
                    <path fill="#3f32e5" d="M497.25 357v-51l-204-127.5V38.25C293.25 17.85 275.4 0 255 0s-38.25 17.85-38.25 38.25V178.5L12.75 306v51l204-63.75V433.5l-51 38.25V510L255 484.5l89.25 25.5v-38.25l-51-38.25V293.25l204 63.75z" />
                  </svg>
                  <h2>{selectedNft[0].token.to}</h2>
                </div>
                <div className="details">
                  <div className="item">
                    <span>Passanger</span>
                    <h3>69Pixels</h3>
                  </div>
                  <div className="item">
                    <span>Flight No.</span>
                    <h3>US6969</h3>
                  </div>
                  <div className="item">
                    <span>Departure</span>
                    <h3>{selectedNft[0].token.departuretime.substr(0,10) + " " + selectedNft[0].token.departuretime.substr(11,2) + ":00"}</h3>
                  </div>
                  <div className="item">
                    <span>Gate Closes</span>
                    <h3>{selectedNft[0].token.departuretime.substr(11,2) -1 + ":30"}</h3>
                  </div>
                  <div className="item">
                    <span>Luggage</span>
                    <h3>Hand Luggage</h3>
                  </div>
                  <div className="item">
                    <span>Seat</span>
                    <h3>69P</h3>
                  </div>
                </div>
              </div>
              <div className="receipt qr-code">
                <svg className="qr" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.938 29.938">
                  <path d="M7.129 15.683h1.427v1.427h1.426v1.426H2.853V17.11h1.426v-2.853h2.853v1.426h-.003zm18.535 12.83h1.424v-1.426h-1.424v1.426zM8.555 15.683h1.426v-1.426H8.555v1.426zm19.957 12.83h1.427v-1.426h-1.427v1.426zm-17.104 1.425h2.85v-1.426h-2.85v1.426zm12.829 0v-1.426H22.81v1.426h1.427zm-5.702 0h1.426v-2.852h-1.426v2.852zM7.129 11.406v1.426h4.277v-1.426H7.129zm-1.424 1.425v-1.426H2.852v2.852h1.426v-1.426h1.427zm4.276-2.852H.002V.001h9.979v9.978zM8.555 1.427H1.426v7.127h7.129V1.427zm-5.703 25.66h4.276V22.81H2.852v4.277zm14.256-1.427v1.427h1.428V25.66h-1.428zM7.129 2.853H2.853v4.275h4.276V2.853zM29.938.001V9.98h-9.979V.001h9.979zm-1.426 1.426h-7.127v7.127h7.127V1.427zM0 19.957h9.98v9.979H0v-9.979zm1.427 8.556h7.129v-7.129H1.427v7.129zm0-17.107H0v7.129h1.427v-7.129zm18.532 7.127v1.424h1.426v-1.424h-1.426zm-4.277 5.703V22.81h-1.425v1.427h-2.85v2.853h2.85v1.426h1.425v-2.853h1.427v-1.426h-1.427v-.001zM11.408 5.704h2.85V4.276h-2.85v1.428zm11.403 11.405h2.854v1.426h1.425v-4.276h-1.425v-2.853h-1.428v4.277h-4.274v1.427h1.426v1.426h1.426V17.11h-.004zm1.426 4.275H22.81v-1.427h-1.426v2.853h-4.276v1.427h2.854v2.853h1.426v1.426h1.426v-2.853h5.701v-1.426h-4.276v-2.853h-.002zm0 0h1.428v-2.851h-1.428v2.851zm-11.405 0v-1.427h1.424v-1.424h1.425v-1.426h1.427v-2.853h4.276v-2.853h-1.426v1.426h-1.426V7.125h-1.426V4.272h1.426V0h-1.426v2.852H15.68V0h-4.276v2.852h1.426V1.426h1.424v2.85h1.426v4.277h1.426v1.426H15.68v2.852h-1.426V9.979H12.83V8.554h-1.426v2.852h1.426v1.426h-1.426v4.278h1.426v-2.853h1.424v2.853H12.83v1.426h-1.426v4.274h2.85v-1.426h-1.422zm15.68 1.426v-1.426h-2.85v1.426h2.85zM27.086 2.853h-4.275v4.275h4.275V2.853zM15.682 21.384h2.854v-1.427h-1.428v-1.424h-1.427v2.851zm2.853-2.851v-1.426h-1.428v1.426h1.428zm8.551-5.702h2.853v-1.426h-2.853v1.426zm1.426 11.405h1.427V22.81h-1.427v1.426zm0-8.553h1.427v-1.426h-1.427v1.426zm-12.83-7.129h-1.425V9.98h1.425V8.554z" />
                </svg>
                <div className="description">
                  <h2>69Pixels</h2>
                  <p>Show QR-code when requested</p>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }
  
  export default TicketChange;
  