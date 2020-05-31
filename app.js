var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose=require("mongoose");
var Item= require("./models/items");
var Comment=require("./models/comment");
var methodOverride=require("method-override");
var seedDB=require("./seeds");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var commentRoutes=require("./routes/comments");
var itemsRoutes=require("./routes/items");
var indexRoutes=require("./routes/index");
var flash=require("connect-flash");

var User =require("./models/user");
app.locals.moment = require('moment');

//comment this out to persist the saving of items
seedDB();

mongoose.connect("mongodb+srv://divik:mittal@mycluster-stmca.mongodb.net/test?retryWrites=true&w=majority");


app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(flash());

app.use(require("express-session")({
    secret:"kuch bhi",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser=req.user;
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   next();
});

app.use("/",indexRoutes);
app.use("/items/:id/comments",commentRoutes);
app.use("/items",itemsRoutes);

app.get("*",function(req,res){
	res.send("Error 404! Page not found");
});

app.listen(3000, "127.0.0.1", function(){
   console.log("The ItemCart Server Has Started!");
});