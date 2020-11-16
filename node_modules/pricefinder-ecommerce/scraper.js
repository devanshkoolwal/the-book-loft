let config = null;

function parseName($) {
   //parses the name from DOM
   let selectedText = $(config.nameSelector).text();
   return selectedText.trim();
}

function parseAvailability($) {
   //parses the availability status from DOM
   let selectedText = $(config.availabilitySelector).text();
   return !(selectedText.includes(config.notAvailableStr));
}

function parsePrice($) {
   //parses the price from DOM
   for (let selector of config.priceSelectors) {
      var selectedText = $(selector).text();
      if (selectedText) { break; }
   }
   let priceString = selectedText.replace(config.priceReplRegex, "");
   return parseFloat(priceString);
}

function getProductCode(url) {
   //gets the product code from the url
   let matchedPattern = matchUrlPattern(url);
   if(matchedPattern === null) {
      throw new Error("The given URL is invalid or not supported.");
   }
   const match = matchedPattern[0];
   return match.slice(match.length - config.productCodeLength);
}

function getProduct($, url) {
   //get the product details from DOM
   return {
      productCode: getProductCode(url),
      name: parseName($),
      price: parsePrice($),
      available: parseAvailability($),
      url
   };
}

function matchUrlPattern(url) {
   //matches with any of the product urls
   let match = null;
   for (let pattern of config.urlPatterns) {
      match = url.match(pattern);
      if (match) { break; }
   }
   return match;
}

function isValidUrl(url) {
   //validate the url
   return matchUrlPattern(url) !== null;
}

function init(args){
   //initialize the config object with values
   config = args;
}

module.exports = {getProduct, isValidUrl, init};