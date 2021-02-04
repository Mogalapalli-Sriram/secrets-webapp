//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");
const app = express();
mongoose.connect("mongodb://localhost:27017/userDB" , { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded( { extended:true}));
app.use(express.static("public"));
app.set("view engine" , "ejs");

const userSchema = new mongoose.Schema({
  Email:String,
  Password:String
});
const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret:secret , encryptedFields:["Password"]} );
const User = mongoose.model("User", userSchema);


app.get("/" , function(req,res) {

  res.render("home");
});

app.get("/login" , function(req,res) {

  res.render("login");
});
app.get("/register" , function(req,res) {

  res.render("register");
});

app.get("/submit" , function(req,res) {

  res.render("submit");
});

app.post("/register" , function(req,res) {

  const userDetails = new User ({
    Email: req.body.username,
    Password: req.body.password
  });
  userDetails.save(function(err) {
    if (err) {
console.log("err");
}else {
  res.render("secrets");
}
  });
});

app.post("/login" , function(req,res) {
  var userName = req.body.username;
  var userPassword = req.body.password;
  User.findOne( {Email: userName} , function(err , finditem) {
    if (err) {
      res.send(err);
    }else {
      if (finditem) {
        if (finditem.Password === userPassword) {
          res.render("secrets");
        } else {
          res.send("You have entered incorrect password,Please try again.");
        }
      } else {
        res.send("You email is not registered.")
      }
    }
  });
});



app.listen(3000 , function() {

  console.log("server is listening on port number 3000");
});
