
// blockchainState.js for VeriSure
// Simulates blockchain logic and persists state

const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const dataFilePath = path.join(__dirname, '../data/products.json');

let products = {};
let productCount = 0;
let owner = 'admin';

function Product(id, name, qrHash, isFake) {
    this.id = id;
    this.name = name;
    this.qrHash = qrHash;
    this.isFake = isFake;
}

function loadState() {
    try {
        if (fs.existsSync(dataFilePath)) {
            const data = fs.readFileSync(dataFilePath, 'utf8');
            const loadedProductsArray = JSON.parse(data);
            products = {};
            productCount = 0;
            loadedProductsArray.forEach(p => {
                products[p.id] = new Product(p.id, p.name, p.qrHash, p.isFake);
                productCount++;
            });
        } else {
            fs.writeFileSync(dataFilePath, '[]', 'utf8');
        }
    } catch (error) {
        console.error('Error loading blockchain state:', error.message);
        products = {};
        productCount = 0;
    }
}

function saveState() {
    try {
        const productsArray = Object.values(products);
        fs.writeFileSync(dataFilePath, JSON.stringify(productsArray, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving blockchain state:', error.message);
    }
}

loadState();

function onlyOwner(senderId) {
    if (senderId !== owner) {
        throw new Error("Not authorized: Only contract owner can perform this action.");
    }
}

async function addProduct(senderId, _id, _name) {
    onlyOwner(senderId);
    if (products[_id] && products[_id].id !== 0) {
        throw new Error("Product already exists with this ID.");
    }
    const qrHash = `product_${_id}_${Date.now()}`;
    const qrDataUrl = await QRCode.toDataURL(qrHash);

    products[_id] = new Product(_id, _name, qrHash, false);
    productCount++;
    saveState();
    return qrDataUrl;
}

function markAsFake(senderId, _id) {
    onlyOwner(senderId);
    if (!products[_id] || products[_id].id === 0) {
        throw new Error("Product does not exist.");
    }
    products[_id].isFake = true;
    saveState();
}

function isProductFake(_id) {
    if (!products[_id] || products[_id].id === 0) {
        return false;
    }
    return products[_id].isFake;
}

function getProductById(_id) {
    return products[_id] || undefined;
}

function getAllProducts() {
    return Object.values(products);
}

module.exports = {
    addProduct,
    markAsFake,
    isProductFake,
    getProductById,
    getAllProducts,
    getOwner: () => owner,
    setOwner: (newOwner) => { owner = newOwner; }
};
