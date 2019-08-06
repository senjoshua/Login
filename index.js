var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
    extended: true
})); 

app.use(cookieParser());
app.use(session({secret: "secret"}));

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Login");

var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/logout", (req, res) => {
    res.redirect("/");
});

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
      },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true
    }
  });

  var User = mongoose.model('User', UserSchema);
  module.exports = User;

app.post("/signup", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    bcrypt.hash(password, 10, function(err, hash) {
      
      var data = new User({ 
        "name": name, 
        "email":email, 
        "password":hash
      });

      req.session.user = data;
  
      data.save(function(error) {
        console.log("User added successfully");
        if (error) {
          console.error(error);
        }
      });
      
    });
    
    return res.redirect("profile.html"); 
    res.render('profile.html',{name:name});
});

app.post("/signin", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    db.collection('users').findOne({ 
        'email': email}, function(err, user) {
        // if (err) throw err; 
        bcrypt.compare(password, user.password, function(err, result) {
          if (err) throw err; 
          
          if(result){
            return res.redirect("profile.html");
            res.render('profile.html',{name:name});
            //req.session.user.name
          }
          else{
            res.redirect("/");
          }

        })

       })

});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});
