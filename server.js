///***---PACKAGES---***\\\
var express = require("express");
var request = require("request");
var app = express();
var mongoose = require("mongoose");
var options = { server: { socketOptions: { connectTimeoutMS: 30000 } } };
var bodyParser = require("body-parser");
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var lat;
var lng;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

///***---MONGODB---***\\\
var customerschema = mongoose.Schema({
  modele: String,
  marque: String,
  ville: String,
  places: String,
  latitude: String,
  longitude: String
});

var customermodel = mongoose.model("customers", customerschema);

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

app.post("/signup", upload.array(), function(req, res) {
  request(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.city}&key=AIzaSyDZFJG4GhBshMDF2oz93IfAkf8oYHIx6c4`, function(error, response, body){
    var retourapi = JSON.parse(body);
    console.log(retourapi);
    lat = retourapi.results[0].geometry.location.lat;
    lng = retourapi.results[0].geometry.location.lng;
    console.log(req.body);
    var newcustomer = new customermodel({
      modele: req.body.modele,
      marque: req.body.marque,
      ville: req.body.marque,
      places: req.body.places,
      latitude: lat,
      longitude: lng
    });
    console.log(newcustomer);
    newcustomer.save(function(error, customers) {
      ///on peut mettre une fonction de call-back ici
    });
    res.redirect("/");
  });
});

///***---LISTEN---***\\\
var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("Moviez Online");
});
