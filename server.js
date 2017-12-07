///***---PACKAGES---***\\\
var express = require("express");
var request = require("request");
var app = express();
var mongoose = require("mongoose");
var options = { server: { socketOptions: { connectTimeoutMS: 30000 } } };
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

///***---MONGODB---***\\\
var customerschema = mongoose.Schema({
  posterpath: String,
  title: String,
  overview: String
});


var customermodel = mongoose.model("moviezfav", customerschema);

mongoose.connect(
  "mongodb://drivy:drivy@ds129926.mlab.com:29926/totocar",
  options,
  function(err) {
    console.log(err);
  }
);

///***---ROUTES---***\\\

app.get("/", function(req, res) {
  res.render("home");
});

app.post("/signup", function(req, res) {
  console.log(req.body);
  res.redirect("/");
});


///***---LISTEN---***\\\
var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("Moviez Online");
});
