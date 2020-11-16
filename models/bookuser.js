var mongoose = require("mongoose");

var BookSchema = mongoose.Schema({
    name : String,
    author : String,
    publisher: String,
    isbn: {
        type: String,
        default:0
    },
    description: String,
    ecommerce_available: String,
    genre: String,
    language: String,
    image_link: String,
    amazon_link:{
        type: String,
        default:0
    },
    flipkart_link:{
        type: String,
        default:0
    },
    ebook_link:{
        type: String,
        default:0
    }
});

module.exports = mongoose.model("userbook",BookSchema);