const mongoose =require("mongoose");
const multer = require("multer");
const path= require("path");
const AVATAR_PATH= path.join('/uploads/profilepic/avatars');
const signupschema = new mongoose.Schema({

   Name:{
       type:String,
       required:true,

   },

   Email:{
       type: String,
       required:true,
   },
   
   Password:{
       type: String,
       required:true,
   },
  
   Gender:{
        type:String,
        required:true
   },

   Date:{
       type:String,
       required:true
   },

   Mobno:{
       type:String,
       required:true,
       maxlength:10
   },

   City:{
        type:String,
        required:true
   },

   State:{
       type:String,
       required:true
   },

   Country:{
       type:String,
       required:true
   },

   Address:{
       type:String,
       required:true
   },

   Areudoctor:{
        type:String,
   },
   
   Profileimg:{
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
signupschema.statics.uploadedAvatar= multer({storage: storage}).single('avatar');
signupschema.statics.avatarPath = AVATAR_PATH;

const signup = mongoose.model("signup",signupschema);

module.exports= signup;