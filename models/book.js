var mongoose = require("mongoose");

var BookSchema = mongoose.Schema({
    name : String,
    author : String,
    publisher: String,
    isbn: String,
    description: String,
    ecommerce_available: String,
    genre: String,
    language: String,
    image_link: String,
    amazon_link: String,
    flipkart_link: String,
    amazon_aff: String,
    flipkart_aff: String,
    ebook_link: String,
    keepa_link: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Book",BookSchema);