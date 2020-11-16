const bent = require("bent");
const getBody = bent("string");
const cheerio = require("cheerio");
const config = require("./config");
const scraper = require("./scraper");

async function getPage(url) {
   const headers = {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      "Accept-Language": "en,ml;q=0.9",
      "Accept-Encoding": "br;q=1.0, gzip;q=0.8, *;q=0.1",
      "Dnt": "1",
      "Referer": "https://www.google.co.in/",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
   };

   return await getBody(url, null ,headers);
}

async function getProduct(url, website) {

   if(!Object.keys(config).includes(website)) {
      throw new Error(`${website} is not supported`);
   }
   scraper.init(config[website]);

   if(!scraper.isValidUrl(url)) {
      throw new Error("Input Url invalid");
   }

   let htmlBody = await getPage(url);
   return scraper.getProduct(cheerio.load(htmlBody), url);
}

module.exports = getProduct;