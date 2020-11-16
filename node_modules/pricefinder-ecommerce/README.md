# pricefinder

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2653fbb7dedb47d9892fc90598f17a4c)](https://app.codacy.com/manual/abinj30/pricefinder-ecommerce?utm_source=github.com&utm_medium=referral&utm_content=abinj30/pricefinder-ecommerce&utm_campaign=Badge_Grade_Dashboard)
![Tests](https://github.com/abinj30/pricefinder-ecommerce/workflows/Tests/badge.svg?branch=master)

Node module to fetch price of Flipkart/Amazon product given their URL.

## Usage
```js
const pricefinder = require('pricefinder-ecommerce');
const product = await pricefinder("https://www.amazon.in/dp/B084456GH4", "amazon");

console.log(product.name)
// Samsung Galaxy Z Flip (Gold, 8GB RAM, 256GB Storage) with No Cost EMI/Additional Exchange Offers
console.log(product.price) //in INR
// 109999
console.log(product.isAvailable)
// true
console.log(product.productCode)
// B084456GH4
```
