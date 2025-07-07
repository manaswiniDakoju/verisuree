
// contracts/FakeProductVerification.sol
// This Solidity code serves as the conceptual blueprint for the backend's "baked-in" logic.
// It will NOT be compiled or deployed for this simulated setup, but its logic is mirrored in blockchainState.js.

pragma solidity ^0.8.0;

contract FakeProductVerification {
    address public owner;

    struct Product {
        uint id;
        string name;
        string qrHash;
        bool isFake;
    }

    mapping(uint => Product) public products;
    uint public productCount;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized: Only contract owner can perform this action.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addProduct(uint _id, string memory _name, string memory _qrHash) public onlyOwner {
        require(products[_id].id == 0, "Product already exists with this ID.");
        products[_id] = Product(_id, _name, _qrHash, false);
        productCount++;
    }

    function markAsFake(uint _id) public onlyOwner {
        require(products[_id].id != 0, "Product does not exist.");
        products[_id].isFake = true;
    }

    function isProductFake(uint _id) public view returns (bool) {
        return products[_id].isFake;
    }
}
