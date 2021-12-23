const mongoose =require("mongoose");


const appointmentschema = new mongoose.Schema({

    Timeslot:{
        type:String,
        required:true
    },
    Confirmed:{
        type:String,
        required:true
    },
    createdon:{
         type:String,
         required:true
    },
    Patientmobile:{
         type:String,
         maxlength:10,
         required:true
    },

    Patientemail:{
        type:String,
        required:true,
    },
     
    Patientname:{
        type:String,
        required:true
    },
    PresenterEmail:{
        type:String,
        required:true
    },
    Doctortobook:{
        type:String,
        required:true
    },
    HospitalName:{
        type:String,
        required:true
    }
});

const appointment = mongoose.model('appointment2',appointmentschema);

module.exports =appointment;