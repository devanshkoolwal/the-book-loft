module.exports = {
   flipkart: {
      productCodeLength: 16,
      urlPatterns: [/http[s]*:[\/]{2}www\.flipkart\.com\/.*\?[pid=]+[a-z0-9]{16}/i],
      priceReplRegex: /₹|&#x20B9|;|,/gi,
      priceSelectors: ["._1vC4OE._3qQ9m1"],
      nameSelector: "._35KyD6",
      availabilitySelector: "._9-sL7L",
      notAvailableStr: "Sold Out",
   },
   amazon: {
      urlPatterns: [
         /http[s]*:[\/]{2}www\.amazon\.in\/gp\/product\/.{10}/i,
         /http[s]*:[\/]{2}www\.amazon\.in\/dp\/.{10}/i,
         /http[s]*:[\/]{2}www\.amazon\.in\/.*\/dp\/.{10}/i,
         /http[s]*:[\/]{2}www\.amazon\.de\/dp\/.{10}/i,
      ],
      productCodeLength: 10,
      priceReplRegex: /₹| |,/gi,
      priceSelectors: ["#priceblock_ourprice", "#priceblock_dealprice", "#priceblock_saleprice"],
      nameSelector: "#productTitle",
      availabilitySelector: "#availability",
      notAvailableStr: "Currently unavailable"
   }
}






