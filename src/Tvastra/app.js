const express = require("express");
const router = express.Router();
var jquery=require("jquery");
const app = express();
const cors = require("cors");
const multer=require("multer");
const compression = require("compression");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const logger = require("morgan");
const path = require("path");
var busboyBodyParser = require('busboy-body-parser');
app.use('/views',express.static(__dirname+'/views/'));

const session = require("express-session");
var cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(
    session({
      secret: "KonfinitySecretKey",
      resave: false,
      saveUninitialized: false,
      cookie: {}
    })
  );
  

const routes =require("./Backend/controller/route");
app.use(cors());
app.use(compression());
// app.use(express.multipart());
app.use(express.urlencoded({ extended: true}));
// parse application/json
app.use(bodyParser.json());


//parse multipart/form-data    
// app.use(busboyBodyParser());


app.use(express.json());

app.set("views", __dirname + "/client/views"); //line5

// ejs - for rendering ejs in html format
app.engine("html", require("ejs").renderFile); //Line6
app.use("/upload",express.static(__dirname+"/upload"));
// setting view-engine as ejs
app.set("view engine", "ejs"); //Line7
app.use(express.static(__dirname+"/client/"))
app.use(express.static(__dirname+"/Backend/"));
app.use(express.static(path.resolve(__dirname, "Backend/uploads")));
app.use(express.static(path.resolve(__dirname, "client/asset"))); //Line8

app.use(logger("dev"));

const db= require("./Backend/config/Mongoose");


app.use("/",routes);
app.set("port", process.env.PORT || 4000); //Line11
app.listen(app.get("port"), () => {
 console.log("Application running in port: " + app.get("port"));
});

module.exports = app;

