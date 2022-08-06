import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { MarketAddress, MarketAddressABI } from "./constant";

export const BookContext = React.createContext();

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

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

  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`; // so this is the path of the newly uploaded nft
      return url;
    } catch (error) {
      console.log('Error Uploading File to IPFS');
    }
  };

  const createBook = async (formInput, fileUrl, pdfUrl, router) => {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl || !pdfUrl) return;

    const data = JSON.stringify({ name, description, image: fileUrl, pdf: pdfUrl });
    try {
      // upload entirity of data to ipfs
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      await createSale(url, price);
      router.push('/');
    } catch (error) {
      console.log('Error uploading file to IPFS.', error);
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInputPrice, 'ether');
    const contract = fetchContract(signer);
    const listingPrice = await contract.getListingPrice();
    const transactions = await contract.createToken(url, price, { value: listingPrice.toString() });
    await transactions.wait();
    console.log(contract);
  };

  const fetchBooks = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    const data = await contract.fetchMarketItems();
    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      const response = await axios.get(tokenURI);
      const { data: { image, name, description, pdf } } = await axios.get(tokenURI);
      const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

      return {
        price,
        tokenId: tokenId.toNumber(),
        seller,
        owner,
        image,
        pdf,
        name,
        description,
        tokenURI,
      };
    }));

    return items;
  };
  
  const fetchMyBooksOrListedBooks = async (type) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);
    
    const data = type === 'fetchItemsListed' ? await contract.fetchItemsListed() : await contract.fetchMyBooks();

    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      const { data: { image, name, description, pdf } } = await axios.get(tokenURI);
      const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

      return {
        price,
        tokenId: tokenId.toNumber(),
        seller,
        owner,
        image,
        pdf,
        name,
        description,
        tokenURI,
      };
    }));
    return items;
  };

  const buyBook = async (book) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);

    const price = ethers.utils.parseUnits(book.price.toString(), 'ether');

    const transaction = await contract.createMarketSale(book.tokenId, { value: price });

    await transaction.wait();
  };

  return (
    <BookContext.Provider value={{ currency, connectWallet, currentAccount, uploadToIPFS, createBook, fetchBooks, fetchMyBooksOrListedBooks, buyBook, createSale }}>{children}</BookContext.Provider>
  );
};
