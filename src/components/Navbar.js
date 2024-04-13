import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [connected, toggleConnect] = useState(false);
  const location = useLocation();
  const [currAddress, updateAddress] = useState('0x');

  async function getAddress() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
  }

  function updateButton() {
    const ethereumButton = document.querySelector('.enableEthereumButton');
    ethereumButton.textContent = "Connected";
    ethereumButton.classList.remove("hover:bg-blue-70");
    ethereumButton.classList.remove("bg-blue-500");
    ethereumButton.classList.add("hover:bg-green-70");
    ethereumButton.classList.add("bg-green-500");
  }

  async function connectWebsite() {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log('----', chainId);
      if (chainId !== '0x44c') {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x44c' }],
        })
      }
      await window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(() => {
          updateButton();
          getAddress();
        }).catch((err) => {
          console.log('Error:', err);
        });
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (window.ethereum === undefined)
      return;
    let val = window.ethereum.isConnected();
    if (val) {
      getAddress();
      toggleConnect(val);
      updateButton();
    }

    window.ethereum.on('accountsChanged', function (accounts) {
      window.location.replace(location.pathname)
    })
  }, []);

  return (
    <div className="">
      <nav className="w-screen">
        <ul className='flex items-end justify-between py-3 bg-transparent text-white pr-5'>
          <li className='flex items-end ml-5 pb-2'>
            <Link to="/">
              <div className='inline-block font-bold text-xl ml-2'>
                AGNUS AI
              </div>
            </Link>
          </li>
          <li className='w-2/6'>
            <ul className='lg:flex justify-between font-bold mr-10 text-lg'>
              <NavItem to="/" active={location.pathname === "/"}>Marketplace</NavItem>
              <NavItem to="/sellNFT" active={location.pathname === "/sellNFT"}>List My NFT</NavItem>
              <NavItem to="/profile" active={location.pathname === "/profile"}>Profile</NavItem>
              <li>
                <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={connectWebsite}>{connected ? "Connected" : "Connect Wallet"}</button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div className='text-white text-bold text-right mr-10 text-sm'>
        {currAddress !== "0x" ? "Connected to" : ""} {currAddress}
      </div>
    </div>
  );
}

const NavItem = ({ to, active, children }) => (
  <li>
    <Link to={to} className={`text-white ${active ? "border-b-2 border-white pb-1" : "hover:border-b-2 hover:border-white pb-1"}`}>
      {children}
    </Link>
  </li>
);

export default Navbar;
