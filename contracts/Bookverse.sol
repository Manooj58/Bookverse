// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract Bookverse is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;    
    Counters.Counter private _itemsSold;

    uint256 listingPrice = 0.025 ether; // every time a user list or post a nft. The owner of that marketplace is going to get 0.025 ether deposited to his wallet. This can also be in Matic depending upon the network it is deployed in
    // Then we have to declare the owner of the contract. The owner will earn a commision when every item sold.

    address payable owner;

    // we need to able to keep up all the NFT's that have been created
    mapping(uint256 => MarketItem) private idToMarketItem; // is we create a new MarketItem and pass an id we need to fetch the items using the id

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    // this is a special let say function that is getting triggered on some action 
    event MarketItemCreated (
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    constructor() ERC721("Metaverse Tokens", "METT"){
        owner = payable(msg.sender); // this line mean owner is the one who is deploying. Message is the actual transaction that is happening when we are deploying the contract. And he or she will get the listing price when somebody sells the nft
    }

    // this function will help the owner to update the listing price
    function updateListingPrice(uint _listingPrice) public payable { // payable mens it giving access to the function to rexeive ethereum
        require(owner == msg.sender,"Only marketplace owner can update the listing price"); // So, that only the owner can update the listing price. Second parameter is the error message

        listingPrice = _listingPrice;
    }

    // to know the current listing price
    function getListingPrice() public view returns (uint256){
        return listingPrice;
    }

    function createToken(string memory tokenURI, uint256 price) public payable returns(uint){  //upload a nft and gets it's tokenURI
        _tokenIds.increment(); // we are creating a new token so need to update the token id by one

        uint256 newTokenId = _tokenIds.current(); 

        // now we need to mint the token
        _mint(msg.sender,newTokenId); // this is a utility function that allows us to mint or create a nft
        _setTokenURI(newTokenId, tokenURI);

        createMarketItem(newTokenId,price);

        return newTokenId;
    }

    function createMarketItem(uint256 tokenId, uint256 price) private { // private function because we don't need to call it from the frontend react app. we only need to call it from the contract itself
        require(price > 0, "Price must be at least 1");
        require(msg.value == listingPrice,"Price must be equal to listing price"); // msg.value mean the actual amount the person is sending to create a acual marketItem
        
        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false // to signify it is not yet sold
        );

        // transfer the ownership of the nft to the contract
        _transfer(msg.sender, address(this), tokenId); //meaning the address of this current contract

        emit MarketItemCreated(tokenId,msg.sender,address(this),price,false);
    }
// allow someone to resell the token they have purchased
    function resellToken(uint256 tokenId, uint256 price) public payable {
        require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
        require(msg.value == listingPrice,"Price must be equal to listing price");

        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));
        
        _itemsSold.decrement();
        _transfer(msg.sender, address(this), tokenId);
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(uint256 tokenId) public payable {
      uint price = idToMarketItem[tokenId].price;
      require(msg.value == price, "Please submit the asking price in order to complete the purchase");
      idToMarketItem[tokenId].owner = payable(msg.sender);
      idToMarketItem[tokenId].sold = true;
      idToMarketItem[tokenId].seller = payable(address(0));
      _itemsSold.increment();
      
      // next, we want to transfer the NFT ownership from the seller to the buyer
      _transfer(address(this), msg.sender, tokenId);
      payable(owner).transfer(listingPrice);
      payable(idToMarketItem[tokenId].seller).transfer(msg.value);
    }

    // returns all the unsold items that currently belong to the marketplace
    function fetchMarketItems() public view returns(MarketItem[] memory) {
        uint itemCount = _tokenIds.current();
        uint unsoldItemCount = _tokenIds.current() - _itemsSold.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);

        for(uint i =0; i < itemCount; i++){
            if(idToMarketItem[i+1].owner == address(this)){
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyBooks() public view returns (MarketItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      // gives us the number of items that we own
      for (uint i = 0; i < totalItemCount; i++) {
        // check if nft is mine
        if (idToMarketItem[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        // check if nft is mine
        if (idToMarketItem[i + 1].owner == msg.sender) {
          // get the id of the market item
          uint currentId = i + 1;
          // get the reference to the current market item
          MarketItem storage currentItem = idToMarketItem[currentId];
          // insert into the array
          items[currentIndex] = currentItem;
          // increment the index
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      
      return items;
    }
}