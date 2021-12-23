const mongoose =require("mongoose");

const scheduleschema = new mongoose.Schema({

   Doctorname:{
       type:String,
       required:true,
   },
   Email:{
       type: String,
       required:true,
   },
   City:{
        type:String,
        required:true
   },
   
   HospitalName:{
       type:String,
       required:true
   },
   Day:{
     type:String,
     required:true
   },
   Disablefull:{
        type:Boolean,
        required:true
   },
   Allslots:{
       type:Array,
       required:true
   },
   interval:{
       type:String,
       required:true
   },
});


const schedule = mongoose.model("schedule",scheduleschema);

module.exports= schedule;