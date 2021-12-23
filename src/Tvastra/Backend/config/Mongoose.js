const mongoose =require("mongoose");

mongoose.connect("mongodb://localhost/Tvastradb");

const db= mongoose.connection;

db.on("error",console.error.bind("error","Error in connecting to the Tvastra Db"));

db.once("open",()=>{
       console.log("Successfully connected to the Tvastra Database");
});
