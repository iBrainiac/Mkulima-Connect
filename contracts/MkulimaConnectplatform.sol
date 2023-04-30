// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MkulimaConnect is Ownable {
    using Counters for Counters.Counter;

    struct Farmer {
        address farmerAddress;
        string name;
        string location;
        bool isRegistered;
    }

    struct Product {
        uint256 id;
        address payable farmerAddress;
        string name;
        string description;
        uint256 price;
        uint256 quantity;
    }

    mapping(address => Farmer) public farmers;
    mapping(uint256 => Product) public products;

    Counters.Counter private _productIds;

    event FarmerRegistered(address indexed farmerAddress, string name, string location);
    event ProductListed(uint256 indexed productId, address indexed farmerAddress, string name, uint256 price, uint256 quantity);
    event ProductPurchased(uint256 indexed productId, address indexed buyer, uint256 quantity, uint256 totalPrice);

    // Register a new farmer
    function registerFarmer(string memory _name, string memory _location) public {
        require(!farmers[msg.sender].isRegistered, "Farmer already registered");
        require(bytes(_name).length > 0, "Name is required");
        require(bytes(_location).length > 0, "Location is required");

        farmers[msg.sender] = Farmer(msg.sender, _name, _location, true);
        emit FarmerRegistered(msg.sender, _name, _location);
    }

    // List a new product
    function listProduct(string memory _name, string memory _description, uint256 _price, uint256 _quantity) public {
        require(farmers[msg.sender].isRegistered, "Farmer not registered");
        require(bytes(_name).length > 0, "Product name is required");
        require(bytes(_description).length > 0, "Product description is required");
        require(_price > 0, "Price must be greater than zero");
        require(_quantity > 0, "Quantity must be greater than zero");

        _productIds.increment();
        uint256 productId = _productIds.current();
        products[productId] = Product(productId, payable(msg.sender), _name, _description, _price, _quantity);

        emit ProductListed(productId, msg.sender, _name, _price, _quantity);
    }

    // Purchase a product
    function purchaseProduct(uint256 _productId, uint256 _quantity) public payable {
        require(products[_productId].quantity >= _quantity, "Not enough quantity available");
        require(msg.value == products[_productId].price * _quantity, "Incorrect payment amount");

        products[_productId].quantity -= _quantity;
        products[_productId].farmerAddress.transfer(msg.value);

        emit ProductPurchased(_productId, msg.sender, _quantity, msg.value);
    }

    // Allow farmers to withdraw their earnings
    function withdrawEarnings() public {
        require(farmers[msg.sender].isRegistered, "Farmer not registered");

        Farmer storage farmer = farmers[msg.sender];
        uint256 earnings = address(this).balance;

        (bool success, ) = farmer.farmerAddress.call{value: earnings}("");
        require(success, "Withdrawal failed");
    }

    // Allow the contract owner to update farmer registration status
    function updateFarmerRegistrationStatus(address _farmerAddress, bool _isRegistered) public onlyOwner {
        require(farmers[_farmerAddress]}}
