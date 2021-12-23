const mongoose =require("mongoose");
const multer = require("multer");
const path= require("path");
const AVATAR_PATH= path.join('/uploads/hospitals/avatars');
const hospitalschema = new mongoose.Schema({
    HospitalName:{type:String,required:true},
    Noofbeds:{type:String,required:true},
    Treatment:{type:Array, required:true},
    Speciality:{type:String,required:true},
    Location:{type:String,required:true},
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
hospitalschema.statics.uploadedAvatar= multer({storage: storage}).single('avatar');
hospitalschema.statics.avatarPath = AVATAR_PATH;
const hospitaldb = mongoose.model("hospitaldb",hospitalschema);

module.exports= hospitaldb;