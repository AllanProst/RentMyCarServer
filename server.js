///***---PACKAGES---***\\\
var express = require("express");
var request = require("request");
var app = express();
//// Mongoose
var mongoose = require("mongoose");
var options = { server: { socketOptions: { connectTimeoutMS: 30000 } } };
var fileUpload = require('express-fileupload');
//// BodyParser (doublon de multer)
var bodyParser = require("body-parser");
//// Module pour comprendre les envois "Multipart Formdata

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(fileUpload());

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

app.post("/signup", function(req, res) {
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

app.post("/saveimage", function(req, res) {
  console.log(req.files.name);
  if (!req.files)
  return res.status(400).send('No files were uploaded.');

      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      let returnedimage = req.files.imgcar;

// Use the mv() method to place the file somewhere on your server
returnedimage.mv(`./public/images/test.jpg`, function(err) {
      if (err)
    return res.status(500).send(err);

  res.send('File uploaded!');
  });
});

///***---LISTEN---***\\\
var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("Moviez Online");
});
