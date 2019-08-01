var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require('body-parser');

app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
    extended: true
})); 

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/login");
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/home", (req, res) => {
    res.sendFile(__dirname + "/index.html");
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

  mongoose.model('User', UserSchema);

app.post("/signup", (req, res) => {
    var name = request.body.username;
    var email = request.body.email;
    var password = request.body.password;
    
    var data = { 
        "name": name, 
        "email":email, 
        "password":password
    } 

    db.collection('users').insertOne(data,function(err, collection){ 
        if (err) throw err; 
        console.log("User added successfully");  
    }); 

    // return res.redirect("profile.html"); 
});

app.post("/signin", (req, res) => {
    var email = request.body.email;
    var password = request.body.password;

});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});
