///***---PACKAGES---***\\\
var express = require("express");
var request = require("request");
var app = express();
//// Mongoose
var mongoose = require("mongoose");
var options = { server: { socketOptions: { connectTimeoutMS: 30000 } } };
//// BodyParser (doublon de multer)
var bodyParser = require("body-parser");
//// Module pour comprendre les envois "Multipart Formdata"
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

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
  latitude: Number,
  longitude: Number
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

app.get("/getmarkers", function(req, res) {
    customermodel.find(function (err, markers) {
    res.json(markers);
  })
});

app.post("/signup", upload.array(), function(req, res) {
  request(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.ville}&key=AIzaSyDZFJG4GhBshMDF2oz93IfAkf8oYHIx6c4`, function(error, response, body){
    var retourapi = JSON.parse(body);
    var lat = retourapi.results[0].geometry.location.lat;
    var lng = retourapi.results[0].geometry.location.lng;
    var newcustomer = new customermodel({
      modele: req.body.modele,
      marque: req.body.marque,
      ville: req.body.ville,
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

app.post("/saveimage", upload.single("imgcar"), function(req, res) {
    console.log(req.file);
    res.redirect("/");
});

///***---LISTEN---***\\\
var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("Moviez Online");
});
