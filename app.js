require('dotenv').config()
var express = require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose = require("mongoose");
var Book=require("./models/book");
var userBook=require("./models/bookuser");
var passport = require("passport");
var LocalStrategy= require("passport-local");
var User = require("./models/user");
var unirest = require("unirest");
methodOverride=require("method-override");
var Comment=require("./models/comment");
var partials=require("express-partials");
const { render } = require("ejs");
const pricefinder = require('pricefinder-ecommerce');
const PriceFinder = require('price-finder');
const priceFinder = new PriceFinder();
var axios=require('axios');
var cherrio=require('cheerio');
const rp = require('request-promise');
flash=require("connect-flash");
//customer-reviews-content id


mongoose.connect(process.env.DATABASE,{ useNewUrlParser: true,useUnifiedTopology: true });



app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine" , "ejs");  
app.use(methodOverride("_method"));
app.use(express.static(__dirname+"/public"));
app.use(flash());

app.use(partials());


app.use(require("express-session")({
    secret: "I don't know",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req,res,next){
    res.locals.currentUser =req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})





    app.get("/", function(req,res){
        Book.find({}, function(err,allBooks){
            if(err){
                console.log(err);
            }
            else{
                
                res.render("index" , {books:allBooks}); 
            }
        })
       
    });

    

    app.get("/book/:id" , function(req,res){
        Book.findById(req.params.id).populate("comments").exec(function(err, foundBook){
            if(err){
                console.log(err);
            } else{
               
                // var amazonPrice=scrapePageAmazon(foundBook.amazon_link);
                // var flipkartPrice=scrapePageFlipkart(foundBook.flipkart_link);
                
                
                function AmazonPriceFetcher(){
                    var a=scrapePageAmazon(foundBook.amazon_link).then(result =>{
                        // console.log(result+"hhh");
                        return result
                    })
                   return a;
                };
                function FlipkartPriceFetcher(){
                    var a=scrapePageFlipkart(foundBook.flipkart_link).then(result =>{
                        // console.log(result+"hhh");
                        return result
                    })
                   return a;
                };

                async function aaa(){
                    var AmazonPrice= await AmazonPriceFetcher();
                    var FlipkartPrice= await FlipkartPriceFetcher();
                    
                    res.render("book", {book:foundBook, fPrice: FlipkartPrice, aPrice: AmazonPrice })
                    // return AmazonPrice;
                }
                var price=aaa();
                
                
                
                // (async () => {
                //    var FlipkartPrice=JSON.stringify(await scrapePageAmazon(foundBook.amazon_link))
                //    console.log(FlipkartPrice);
                // })();
                
                
                
                // Promise.all([rp(scrapePageFlipkart(foundBook.flipkart_link)), rp(scrapePageAmazon(foundBook.amazon_link))]).then([r1,r2] => {
                //     res.render("book", {book:foundBook})
                // }).catch(err =>{
                //     console.log(err);
                // });
                
                
        
            }
        });
        
    });

    async function aaa(){
        
    }


    app.get("/category/:category", function(req,res){
        Book.find({genre: req.params.category}, function(err,foundBook){
            if(err)
                console.log(err);
            else    
                res.render("index", {books: foundBook});
        })
    });
    app.get("/language/:language", function(req,res){
        Book.find({language: req.params.language}, function(err,foundBook){
            if(err)
                console.log(err);
            else    
                res.render("index", {books: foundBook});
        })
    });

    app.get("/launch", isLoggedIn,function(req,res){
        res.render("launch");
    });

    app.post("/launch",function(req,res){
        userBook.create(req.body.bookuser, function(err, createdBook){
            if(err)
                console.log(err);
            else{
                // console.log(createdBook);
                req.flash("success","Successfully submitted! Verification pending")
                res.redirect("/");


            }
        })

    });

    app.get("/validatebook",checkAdmin, function(req,res){
            userBook.find({},function(err,foundbook){
                if(err){
                    
                    console.log(err);
                }
                else{
                    res.render("validatebook",{books:foundbook});
                }
            });
    });


    app.post("/validatebook",function(req,res){
        
        
        Book.create(req.body.newbook,function(err,addedbook){
            if(err){
                console.log(err);
            }
            else{
                console.log(req.body.newbook);
                userBook.findByIdAndRemove(req.body.bookid,function(err){
                    
                    res.redirect("validatebook");   
                });
                
            }
        });
    });




//login signup

app.get("/register", function(req,res){
    
    res.render("signup");
});

app.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user){
        if(err){
           // req.flash("error", err.message);
           console.log(err);
            return res.render("signup");
        }
        passport.authenticate("local")(req,res, function(){
            req.flash("success","Welcome to The Book Loft");
            res.redirect("/");
        })
    })
});


app.get("/login", function(req,res){
    res.render("signin");
});

app.post("/login", passport.authenticate("local",
{
    successRedirect:"/",  
    failureRedirect:"/login"
}),function(req,res){
 
});

app.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
});


// comment 

app.get("/book/:id/comments/new", isLoggedIn, function(req,res){
    Book.findById(req.params.id, function(err, book){
        if(err){
            console.log(err);
        }
        else{
            res.render("commentsnew", {book: book} );
        }
    })
});

app.post("/book/:id/comments/", isLoggedIn, function(req,res){
    
    
    Book.findById(req.params.id, function(err,book){
        if(err){
            res.render(err);
            res.redirect("/");
        }
        else{
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    //req.flash("error","Something went wrong");
                    res.render(err);
                }
                else{
                    comment.author.id = req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    book.comments.push(comment);
                    book.save();
                    //req.flash("success","Successfully added comment");
                    res.redirect("/book/"+book._id);
                }
            })
        }
    })
});


app.get("/book/:id/comments/:comment_id/edit", checkCommentOwnership, function(req,res){

    Comment.findById(req.params.comment_id, function(err,foundComment){
        if(err)
            res.redirect("back");
        else{
            res.render("commentsedit",{book_id: req.params.id, comment:foundComment});
        }
        
    })
    
});

app.put("/book/:id/comments/:comment_id", checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err)
            res.redirect(back);
        else
            res.redirect("/book/"+req.params.id);
    })
});


app.delete("/book/:id/comments/:comment_id", checkCommentOwnership, function(req,res){
    
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }
        else{
            //req.flash("success","Comment deleted");
            res.redirect("back");
        }
    })
});

app.get("/about", function(req,res){
    res.render("about");
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

function checkCommentOwnership(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                
                console.redirect("back");
            }
            else{

                if(foundComment.author.id.equals(req.user._id))
                    next();
                else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");         
                    }
                }
        });

    }
    else{
        //req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }

};

app.get("/check", function(req,res){
    res.render("check");
});

app.get("/search", function(req,res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        

        Book.find({$or:[{name:regex},{author: regex}]}, function(err,foundBook){
            if(err)
                console.log(err);
            else{
                
                res.render("index" , {books:foundBook}); 
               
            }
        })
    }

});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
function checkAdmin(req,res,next){
    if(req.isAuthenticated()){
        if(res.locals.currentUser.role===1){
            next();
        }
        else{
            req.flash("error","You need to be logged in to do that");
            res.redirect("/");
        }

    }
    else{
        //req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }

};

async function scrapePageAmazon(productURL) {
    
    const html = await getHTML(productURL);
    const price = await getAmazonPrice(html);
    
    return price;
  }
  async function scrapePageFlipkart(productURL) {
    const html = await getHTML(productURL);
    const price = await getFlipkartPrice(html);
    
    return price;
  }
  async function getHTML(productURL) {
    const { data: html } = await  axios.get(productURL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36'
      }
    })
    .catch(function (error) {
      console.log(error);
    })
    return html;
  }
  
  async function getAmazonPrice(html) {
    const $ = cherrio.load(html)
    
    const span = $('.a-size-base.a-color-price')
    return span.html();
  }
  async function getFlipkartPrice(html) {
    const $ = cherrio.load(html)
    
    const span = $('._30jeq3._16Jk6d')
    return span.html();
  }

app.listen(process.env.PORT,function(){
    console.log("Book Loft at 2609");
});