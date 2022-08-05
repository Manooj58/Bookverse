import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';

import { MarketAddress, MarketAddressABI } from './constant';

export const BookContext = React.createContext();

export const BookProvider = ({ children }) => {
  const currency = 'ETH';

  return (
    <BookContext.Provider value={{ currency }}>
      {children}
    </BookContext.Provider>
  );
};