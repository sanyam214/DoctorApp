const mongoose =require("mongoose");
const multer = require("multer");
const path= require("path");
const AVATAR_PATH= path.join('/uploads/Reports/reportdocs');
const reportschema = new mongoose.Schema({

   ReportDate:{
      type:String,
      required:true
   },

   Title:{
       type:String,
       required:true
   },
   Reporttype:{
       type:String,
       required:true
   },
   Patientname:{
       type:String,
       required:true
   },
   Reportimg:{
       type:[Array]
   }
});
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
         cb(null, path.join(__dirname,"..",AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null,  Date.now()+file.originalname);
    }
  });
console.log(path.join(__dirname,"..",AVATAR_PATH));
reportschema.statics.uploadedAvatar= multer({storage: storage}).array('Reportimg',10);
reportschema.statics.avatarPath = AVATAR_PATH;

const report = mongoose.model("report",reportschema);

module.exports= report;