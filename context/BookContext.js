import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";

import { MarketAddress, MarketAddressABI } from "./constant";

export const BookContext = React.createContext();

export const BookProvider = ({ children }) => {
  const currency = "ETH";
  const [currentAccount, setcurrentAccount] = useState(""); // address of currently connected account
  const checkIfWalletIsConnected = async () => {
    // first needed to check if the user have metamask installed
    if (!window.ethereum) return alert("Please install MetaMask");

    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length) {
      setcurrentAccount(accounts[0]);
    } else {
      console.log("No accounts found.");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setcurrentAccount(accounts[0]);
    window.location.reload();
  };
  return (
    <BookContext.Provider value={{ currency, connectWallet, currentAccount }}>{children}</BookContext.Provider>
  );
};
