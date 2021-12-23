const { Int32 } = require("bson");
const mongoose =require("mongoose");
const multer = require("multer");
const path= require("path");
const AVATAR_PATH= path.join('/uploads/doctors/avatars');
const doctorschema = new mongoose.Schema({
    DoctorName:{type:String,required:true},
    Description:{type:String,required:true},
    Speciality:{type:String,required:true},
    Education:{type:String,required:true},
    Treatment:{type:String,required:true},
    Location:{type:String,required:true},
    HospitalList:{type:String,required:true},
    Achievements:{type:String,required:true},
    Awards:{type:String,required:true},
    Experience:{type:String,required:true},
    AvgFees:{type:String,required:true},

  avatar:{
    type:String
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
doctorschema.statics.uploadedAvatar= multer({storage: storage}).single('avatar');
doctorschema.statics.avatarPath = AVATAR_PATH;
const doctordb = mongoose.model("doctordb",doctorschema);

module.exports= doctordb;