const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const bcryptjs =require("bcryptjs");
const signup =  require("../Model/Signupschema");
const appointment = require("../Model/Appointmentschema");
const Nexmo = require("nexmo");
const report = require("../Model/Medicalreport");
const schedules=require("../Model/Schedules");
const ejs = require("ejs");
const Doctorschema= require("../Model/Doctorschems");
const hospitaldb=require("../Model/Hospitaldb");
var name;
var verifyauth=false;
var mobilenumber;
var otpmob="";
const nexmo = new Nexmo({
    apiKey:"fd34219d",
    apiSecret:"1y6MgoK2wA3H6uWH"
  });
let counter=0;
const index = (req,res)=>{
     req.session.select=[];
     req.session.city=[];
     req.session.treatments=[];
     req.session.hospital=[];
     counter++;
    console.log("Beautifule name is:",name);
     if(req.session.email || verifyauth==true){
       if(counter<=2){
         console.log("hEllo");
         console.log(counter);
          if(verifyauth){

            res.render("index",{bol:1,Name:'Profile',Mobile:otpmob,isdoctor:req.session.isdoctor,dp:req.session.Profileimg});
          }
          res.render("index",{bol:1,Name:name,Mobile:mobilenumber,isdoctor:req.session.isdoctor,dp:req.session.Profileimg});
       }
       else{
         console.log(counter);
         res.render("index",{bol:0,Name:name,Mobile:mobilenumber,isdoctor:req.session.isdoctor,dp:req.session.Profileimg});
       }
     }
     else{
      //  res.redirect("/Login");
      res.redirect("/Login");
     }
}

var bolchange="";
const getlogin = (req,res)=>{
      res.render("LoginPage",{dp:req.session.Profileimg,bol:bolchange});
    
}
const getsignup = (req,res)=>{
    
    res.render("SignUp",{dp:req.session.Profileimg,Name:"Profile",Mobile:"1200-1200-12"});
   
}
const search=(req,res)=>{
  // var doctor=['RoseMoon','Neeraj Joshi','Venkata Aggarwal','vikas','John'];
  var treatmentarray=['Cardiologist','Cornea',"Cataract",'Surgeon','Dentist','Orthopologist','MD','Plastic Surgeon','Fortis','Apollo','Rockland','Primus'];
  // var doctorsandTreatments=doctors.concat(Treatments);
  var hospitalarray=["PGI","Gangaram1","Fortis","Ascort","AIIMS"];
  var cities=['Ahmedabad','Amritsar','Agartala','Ambala','Anantpuram','Delhi','Dehradun','Dabhel','Mumbai','Noida','Banglore','Bereilly','Bhilai','Bhiwandi','Hyderabad','Pune','Chandigarh','Gurgoan'];
  console.log(req.body.serachtype);
  // if(treatmentarray.includes(req.body.searchtype))
  // {
       
  //      for(let i of treatmentarray)
  //      {
  //        if(i==req.body.searchtype)
  //        {
  //           req.session.searchitem=i;
  //        }
  //      }
  // }

  // if(hospitalarray.includes(req.body.searchtype))
  // {
       
  //      for(let i of hospitalarray)
  //      {
  //        if(i==req.body.searchtype)
  //        {
  //           req.session.searchitem=i;
  //        }
  //      }
  // }
  req.session.searchitem=req.body.searchtype;
  req.session.searchlocation=req.body.location;
  res.redirect("/Doctorlist/page1");
}
const getreport = (req,res)=>{
  var afterresult;
  if(req.session.email){
    console.log(req.query.id);
    if(req.query.id){
         report.findByIdAndRemove({_id:req.query.id},(err,result)=>{
                  if(err){
                    console.log(err);
                  }
                  else{
                    console.log(result);
                  }
         });
    }
   
    report.find({Patientname:req.session.Name},(err,result)=>{
      if(req.query.givetoast=="true"){
        res.render("report",{dp:req.session.Profileimg,givetoast:"true",givetoastar:"false",results:result,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile,isdoctor:req.session.isdoctor});
      }

         else if(err){
           console.log(err);
         }
         else{
           if(req.query.givetoastar=="true"){
            afterresult=result;
            console.log(result);
            if(!result){
             res.render("report",{dp:req.session.Profileimg,givetoast:"false",givetoastar:"true",results:[],ProfileName:req.session.Name,ProfileMobile:req.session.Mobile,isdoctor:req.session.isdoctor});
            }
            else{
            res.render("report",{dp:req.session.Profileimg,givetoast:"false",givetoastar:"true",results:result,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile,isdoctor:req.session.isdoctor});
            }
           }
           else{
           afterresult=result;
           console.log(result);
           if(!result){
            res.render("report",{dp:req.session.Profileimg,givetoast:"false",givetoastar:"false",results:[],ProfileName:req.session.Name,ProfileMobile:req.session.Mobile,isdoctor:req.session.isdoctor});
           }
           else{
           res.render("report",{dp:req.session.Profileimg,givetoast:"false",givetoastar:"false",results:result,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile,isdoctor:req.session.isdoctor});
           }
          }
         }
    })
}

}
function getimgname(name){
  Doctorschema.findOne({DoctorName:name},(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log("Doctor details is",result._doc.avatar);
      return result._doc.avatar;
    }
  })
}
function ModifyRecord(req,res,result){
    for(let i of result){
       var y=i.HospitalList;
       y=y.split(",");
       console.log(y);
       for(let j=0; j<y.length; j++){
         if(y[j]==req.session.hospitalselected){
           y[j]=req.body.hospital;
         }
       }
       console.log("Arr y is:",y);
       var str="";
       for(let j=0; j<y.length; j++){
         str=str+y[j];
         if(j!=y.length-1){
             str=str+",";
         }
       }
       console.log("inputting string is:",str);
       Doctorschema.update({DoctorName:i.DoctorName},{$set:{HospitalList:str}},(err,results)=>{
           if(err){
             console.log(err);
           }
           else{
             console.log("Updates Successfully",results);
           }
       })
    }
}
const postverify_hospital=(req,res)=>{
  // var basic="",basic1="",basic2="",basic3="",basic4="",basic5="",basic6="";
  var treatment=[];
  hospitaldb.uploadedAvatar(req,res,(err)=>{
    if(err){
        console.log("Multer err",err);
    }
    else{
      var d="";
        var b=req.body.speciality.split(",");
        for(let k=0; k<b.length; k++){
            bx=b[k].split(":");
            bx=bx[1].split("}");
            bx=bx[0];
            bx=bx.slice(1,bx.length-1);
            d=d+bx+",";
        }
        d=d.slice(0,d.length-1);
        console.log(d);
        b=req.body.treatment.split(",");
        for(let k=0; k<b.length; k++){
            bx=b[k].split(":");
            bx=bx[1].split("}");
            bx=bx[0];
            bx=bx.slice(1,bx.length-1);
            treatment.push(bx);
        }
        
        console.log(treatment);
       console.log(req.body.hospital);
       console.log(req.body.treatment);
       console.log(req.file.filename);
       console.log(req.body.speciality);
       console.log(req.body.desc);
       console.log(req.body.location);
       console.log(req.body.beds);
      hospitaldb.updateMany({HospitalName:req.session.hospitalselected},{$set:{HospitalName:req.body.hospital,
      Treatment:treatment,avatar:req.file.filename,Location:req.body.location,Noofbeds:req.body.beds,Speciality:d}},(err,result)=>{
        if(err){
          console.log(err);
        }
        else{
          console.log("Udation is done successfully",result);
        }
      })
      schedules.updateMany({HospitalName:req.session.hospitalselected},{$set:{HospitalName:req.body.hospital}},(err,result)=>{
          if(err){
            console.log(err);
          }
          else{
            console.log("Updation is doen Successfully");
          }
      });
    }
     Doctorschema.find({HospitalList:{$regex:req.session.hospitalselected}},(err,result)=>{
       if(err){
         console.log(err);
       }
       else{
         console.log("Surprisingly:",result);
         ModifyRecord(req,res,result);
       }
     })
    res.redirect("/admin_hospitals");
});   
}

const verify_hospital=(req,res)=>{
  req.session.hospitalselected=req.query.hospital_selected;
  res.render("verify_hospital",{hospitalselect:req.session.hospitalselected,dp:req.session.Profileimg,Timeselected:req.session.apptime,givetoast:"false",isdoctor:req.session.isdoctor,Name:req.session.Name,Mobile:req.session.Mobile,isdoctor:req.session.isdoctor});
}

const postlogin =(req,res)=>{

     let hash;
     signup.findOne({Email: req.body.Email},(err,temp)=>{

        if(err){
          console.log(err);
        }
        else{
          if(!temp){
              console.log("Username does not exist in the database");
              res.render("LoginPage",{bol:0,dp:req.session.Profileimg});
          }
          else{
            console.log(temp);
            hash = temp.Password;
            req.session.Name = temp.Name;
            req.session.Mobile=temp.Mobno;
            req.session.Gender=temp.Gender;
            req.session.City=temp.City;
            req.session.State=temp.State;
            req.session.Country=temp.Country;
            req.session.isdoctor=temp.Areudoctor;
            req.session.Profileimg=temp.Profileimg;
           
            bcrypt.compare(req.body.Password, hash,(err, isMatch)=> {
              if (err) {
                console.log(err);
              } else if (!isMatch) {
                console.log("Password doesn't match!");
                console.log("Entering the wrong Password");
                bolchange=0;
                res.render("LoginPage",{bol:bolchange});
              } else {
                console.log("Password matches!");
                req.session.email = req.body.Email;
                console.log("Session is being started",req.session.email);
                name=temp.Name;
                mobilenumber= temp.Mobno;
                console.log("Value of bool change after worng is:",bolchange);
                console.log("Name of the session joiner is:",temp.Name);
                if(temp.Name=="admin"){
                  res.redirect("/admin_dashboard/page1");
                }
                else{
                  res.redirect("/");
                }
                
              }
            });
          }
         
        }

     });
   
}

const getMobileNumber= (req,res)=>{
    res.render("GetMobileNumber",{Name:"Profile",Mobile:"1200-1200-12",dp:req.session.Profileimg});
}

const postMobileNumber =(req,res)=>{

        nexmo.verify.request({
          number: req.body.number,
          brand: 'Vonage',
          code_length: '4'
        }, (err, result) => {
            rid= result.request_id;
            console.log(rid);
            otpmob=req.body.number;
            var realmob=otpmob.slice(2,otpmob.length);
            signup.findOne({Mobno:realmob},(err,result)=>{
              if(err){
                console.log(err);
              }
              else{
                if(result){
                  name=result.Name;
                  req.session.email=result.Email;
                }
              }
            })
          console.log(err ? err : result);
          res.render("check",{reqid:rid,Name:"Profile",Mobile:"1200-1200-12",dp:req.session.Profileimg});
        });    
}

const verifyotp =(req,res)=>{
    nexmo.verify.check({
        request_id: req.body.request,
        code: req.body.code1 + req.body.code2 + req.body.code3 + req.body.code4
      }, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log(req.body.code);
          console.log(result);
          verifyauth=true;
          res.redirect("/");
        }
      });

}

const postsignup = (req,res)=>{
  const saltRounds = 10;
  console.log("Reqest.body is:",req.body);
  console.log("Om nama shivay",req.body.Areudoctor);
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      throw err
    } else {
      bcrypt.hash(req.body.Password, salt,(err, hash)=> {
        if (err) {
          console.log(err);
        } else {
          console.log(hash);
           
      signup.create({

        Name: req.body.Name,
        Email: req.body.Email,
        Password: hash,
        Gender: req.body.Gender,
        Date:req.body.Date,
        Mobno: req.body.Mobile,
        City:req.body.City,
        State: req.body.State,
        Country: req.body.Country,
        Address: req.body.State,
        Areudoctor:req.body.Areudoctor,
        Profileimg:"defaultdp.jpg"
      },(err,result)=>{

          if(err)
          {
              console.log(err);
              res.render("SignUp");
          }

          else{
              console.log(result);
              if(result.Areudoctor=="true"){
                  req.session.isdoctor="true";
                  req.session.Name=result.Name;

                  res.redirect("/profile_doctor?Logemail="+result.Email+"&Doctorname="+result.Name);
              }
              else{
                res.redirect("/");
              }
            
          }

      });
        }
      });
    }
  });
     
}
// function uniquehospitals(req,res,result)
// {
//    var str="";
//    var hospitals=[];
//    for(let i of result){
//        str=str+i.HospitalList;
//        str=str.split(",");
//        for(let i=0; i<str.length; i++){
//              hospitals.push(str[i]);
//        }
//        str="";
//    }

//   var unique=[];
//   for(let i=0; i<3; i++){
//      var arr=hospitals.slice(i+1,hospitals.length);
//      if(!(arr.includes(hospitals[i]))){
//           unique.push({HospitalName:hospitals[i],Location:"Banglore",beds:"100",Speciality:"Cardiology",Treatment:"Infertility,Transplant,Kemo Theropy,Covid patients"});
//      }
//   }
//     unique.push({HospitalName:hospitals[hospitals.length-1],Location:"Banglore",beds:"100",Speciality:"Cardiology",Treatment:"Infertility,Transplant,Kemo Theropy,Covid patients"});
//     console.log("Unique hospitals are",unique);
   
//     for( let i of unique){
//       hospitaldb.create({HospitalName:i.HospitalName,Noofbeds:i.beds,Speciality:i.Speciality,Location:i.Location,Treatment:i.Treatment,avatar:""},(err,result)=>{
//         if(err){
//           console.log(err);
//         }
//         else{
//           console.log("created",result);
//           console.log("Running Fine");
//         }
//       })
//     }
// }


// function getallhospitals(req,res){
//   var allhospital;
//     Doctorschema.find({},(err,result)=>{
//           if(err){
//             console.log(err)
//           }
//           else{
            
//              allhospital=uniquehospitals(req,res,result);
//           }
//     });
    
// }

const Hospitallist = (req,res) =>{
  if(req.session.email  || verifyauth==true ){
    // hospitaldb.deleteMany({},(err,result)=>{
    //   if(err){
    //     console.log(err);
    //   }
    //   else{
    //     console.log("records deleted");
    //     getallhospitals(req,res);
    //   }
    //  })
    
     hospitaldb.find({},(err,result)=>{
       if(err){
         console.log(err);
       }
       else{
        res.render('Hospital',{Name:name,Mobile:mobilenumber,dp:req.session.Profileimg,hospitals:result});
       }
     })
  }
  else{
    bolchange=-1;
    res.redirect("/Login");
  }
}

const Dentistry = (req,res) =>{
  if(req.session.email  || verifyauth==true){
  res.render('Dentistry',{Name:name,Mobile:mobilenumber,dp:req.session.Profileimg});
  }
  else{
    bolchange=-1;
    res.redirect("/Login");
  }
}

const getfaq = (req,res)=>{
  if(req.session.email  || verifyauth==true){
    res.render("FAQ",{Name:name,Mobile:mobilenumber,dp:req.session.Profileimg});
  }
  else{
    bolchange=-1;
    res.redirect("/Login");
  }
}

const getabouthospital = (req,res)=>{
  if(req.session.email  || verifyauth==true){
    res.render("about-hospital",{Name:name,Mobile:mobilenumber,dp:req.session.Profileimg});
  }
  else{
    res.redirect("/Login");
  }
}

const getabout_us = (req,res)=>{
  if(req.session.email  || verifyauth==true){
    res.render("about_us",{Name:name,Mobile:mobilenumber,dp:req.session.Profileimg});
  }
  else{
    res.redirect("/Login");
  }
}
function isgreater(req,res){
  var arr=[],temp;
  appointment.find({},(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
     
       console.log("Result is:",result);  
       for(let i of result){
        var day,month,year,date;
        console.log("Ha Ha date");
        date=i.createdon.split(",");
        var d=date[1].split(" ");
        day=d[0];
        month=d[1];
        year=date[2];
        var m=["Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sep","Oct","Nov","Dec"];
        
        for(let j=0; j<m.length; j++){
            if(month==m[j]){
                month=j;
                break;
            }
        }
        var thecurrdate=new Date();
        var appdate= new Date(year,month,day);
        console.log("Hi pictures loooking",year,month,day);
        if(thecurrdate<=appdate && i.Confirmed!="cancel"){
             i.Confirmed="true"
        }
        else if(thecurrdate>appdate && i.Confirmed!="cancel"){
            i.Confirmed="false";
        }
        else{
          i.Confirmed="cancel";
        }
        arr.push(i);
      }
    }
    for(let i=0; i<arr.length; i++){
        appointment.updateOne({Patientname:arr[i].Patientname},{$set:{model:arr[i].model}},(err,result)=>{
            if(err){
              console.log(err);
            }
            else{
              console.log("Updated Successfully",result);
            }
        })
    }
  })
  
  console.log("World is too beautiful",arr);
  return arr;
}
const getAppointment = (req,res)=>{
  //  var arr=isgreater(req,res);
  // console.log("The value of arr is:",arr);
  if(req.session.email  || verifyauth==true){
    
    if(req.query.admin=="true")
    {
      if(req.query.id){
        appointment.updateOne({_id:req.query.id},{$set:{Confirmed:"cancel"}},(err,result)=>{
                 if(err){
                   console.log(err);
                 }
                 else{
                   console.log(result);
                 }
        });
      }
      else{
        appointment.find({Patientname:req.query.user_search},(err,result)=>{
        if(err){
            console.log(err);
          }
          else{
            console.log(result);
            console.log("I am doctor or not ",req.session.isdoctor);
            res.render("admin_appointments",{dp:req.session.Profileimg,Timeselected:req.session.apptime,givetoast:"false",isdoctor:req.session.isdoctor,results:result,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile,isdoctor:req.session.isdoctor});
          }
        });
      }
    }
    else{
      if(req.query.id){
        appointment.updateOne({_id:req.query.id},{$set:{Confirmed:"cancel"}},(err,result)=>{
                 if(err){
                   console.log(err);
                 }
                 else{
                   console.log(result);
                
                 }
        });
      }
      if(req.session.isdoctor!="true"){
        if(req.query.reschedule=="true")
        {
          appointment.find({PresenterEmail:req.session.email},(err,result)=>{
            if(req.query.givetoast=="true"){
              res.render("Appointment",{dp:req.session.Profileimg,Timeselected:req.session.apptime,givetoast:"cancel",isdoctor:req.session.isdoctor,results:result,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile,isdoctor:req.session.isdoctor});
            }
            else if(err){
              console.log(err);
            }
            else{
              console.log(result);
              console.log("I am doctor or not ",req.session.isdoctor);
              res.render("Appointment",{dp:req.session.Profileimg,Timeselected:req.session.apptime,givetoast:"true",isdoctor:req.session.isdoctor,results:result,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile,isdoctor:req.session.isdoctor});
            }
          });
        }
        else{
          appointment.find({PresenterEmail:req.session.email},(err,result)=>{
            if(req.query.givetoast=="true"){
              res.render("Appointment",{dp:req.session.Profileimg,Timeselected:req.session.apptime,givetoast:"cancel",isdoctor:req.session.isdoctor,results:result,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile,isdoctor:req.session.isdoctor});
            }
            else if(err){
              console.log(err);
            }
            else{
              console.log(result);
              console.log("I am doctor or not ",req.session.isdoctor);
              res.render("Appointment",{dp:req.session.Profileimg,Timeselected:req.session.apptime,givetoast:"false",isdoctor:req.session.isdoctor,results:result,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile,isdoctor:req.session.isdoctor});
            }
          });
        }
        
      }
      else if(req.session.isdoctor=="true"){
        console.log(req.session.Name);
        if(req.query.reschedule=="true")
        {
          appointment.find({Doctortobook:req.session.Name},(err,result)=>{
            // var createdon= result.createdon.split(",");
            // createdon=createdon[0]+createdon[1];
            if(req.query.givetoast=="true"){
              res.render("Appointment",{dp:req.session.Profileimg,Timeselected:req.session.apptime,givetoast:"cancel",isdoctor:req.session.isdoctor,results:result,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile,isdoctor:req.session.isdoctor});
            }
            else if(err){
              console.log(err);
            }
            else{
              console.log(result);
              console.log("I am doctor or not ",req.session.isdoctor);
             
              res.render("Appointment",{dp:req.session.Profileimg,Timeselected:req.session.apptime,givetoast:"true",isdoctor:req.session.isdoctor,results:result,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile,isdoctor:req.session.isdoctor,dp:req.session.Profileimg});
            }
          });
        }
        else{
          appointment.find({Doctortobook:req.session.Name},(err,result)=>{
            // var createdon= result.createdon.split(",");
            // createdon=createdon[0]+createdon[1];
            if(req.query.givetoast=="true"){
              res.render("Appointment",{dp:req.session.Profileimg,Timeselected:req.session.apptime,givetoast:"cancel",isdoctor:req.session.isdoctor,results:result,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile,isdoctor:req.session.isdoctor});
            }
            else if(err){
              console.log(err);
            }
            else{
              console.log(result);
              console.log("I am doctor or not ",req.session.isdoctor);
             
              res.render("Appointment",{dp:req.session.Profileimg,Timeselected:req.session.apptime,givetoast:"false",isdoctor:req.session.isdoctor,results:result,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile,isdoctor:req.session.isdoctor,dp:req.session.Profileimg});
            }
          });
        }
        
      }
        
    }
   
      
  }
  else{
    res.redirect("/Login");
  }
}

const getplus = (req,res)=>{
  if(req.session.email  || verifyauth==true){
    res.render("travastra-plus",{Name:name,Mobile:mobilenumber,dp:req.session.Profileimg});
  }
  else{
    res.redirect("/Login");
  }
}

const getsubmitquery = (req,res)=>{
  if(req.session.email  || verifyauth==true){
    res.render("submitquery",{Name:name,Mobile:mobilenumber,dp:req.session.Profileimg});
  }
  else{
    res.redirect("/Login");
  }
}

const all_appointments= (req,res)=>{
  if(req.session.email  || verifyauth==true){
    if(req.query.createdon && req.query.Timeslot){
        appointment.findOneAndUpdate({createdon:req.query.createdon,
          Timeslot:req.query.Timeslot,
          PresenterEmail:req.query.PresenterEmail},{$set:{Confirmed:"cancel"}},(err,result)=>{
          if(err){
            console.log(err);
          }
          else{
            console.log("It is Cancelled Successfully",result);
            res.redirect("back");
          }
        })
    }
    else{
      appointment.find({Doctortobook:req.query.doctorname},(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
         res.render("all_appointments",{Name:name,Mobile:mobilenumber,dp:req.session.Profileimg,allapp:result});
        }
     })
    }
  }
  else{
    res.redirect("/Login");
  }
}

const getContactUs = (req,res)=>{
  if(req.session.email  || verifyauth==true){
    res.render("ContactUs",{Name:name,Mobile:mobilenumber,dp:req.session.Profileimg});
  }
  else{
    res.redirect("/Login");
  }
}

const getadmin_users = (req,res)=>{
  if(req.session.email  || verifyauth==true){
    signup.find({},(err,result)=>{
          if(err){
            console.log(err);
          }
          else{
            console.log(result);
            res.render("admin_users",{Name:name,Mobile:mobilenumber,dp:req.session.Profileimg,allcus:result});
          }
    })
   
  }
  else{
    res.redirect("/Login");
  }
}

const getadmin_appointments = (req,res)=>{
  if(req.session.email  || verifyauth==true){
          appointment.find({Doctortobook:req.query.user_search},(err,result)=>{
              if(err){
                console.log(err);
              }
              else{
                res.render("admin_appointments",{isdoctor:"true",ProfileName:req.session.Name,ProfileMobile:req.session.Mobno,dp:req.session.Profileimg,results:result});
   
              }
          })
         
  }
  else{
    res.redirect("/Login");
  }
}

const getadmin_dashboard = (req,res)=>{
  if(req.session.email  || verifyauth==true)
  {
    if(req.params.pageno=="page1"){
      var nofappointments,nofdoctors,nofusers;
      signup.count().then((count) => {
      console.log(count);
      nofusers=count;
      });
      Doctorschema.count().then((count) => {
        console.log(count);
        nofdoctors=count;
        });
      appointment.count().then((count) => {
        nofappointments=count;
        console.log("All in one:",nofusers,nofdoctors,nofappointments);
        
      
          signup.find({},(err,result)=>{
              if(err){
                console.log(err);
              }
              else{
                nofusers=nofusers-nofdoctors-1;
                console.log(result);
                res.render("admin_dashboard",{pageno:"page1",nusers:nofusers,ndoctors:nofdoctors,nappointments:nofappointments,Name:name,Mobile:mobilenumber,dp:req.session.Profileimg,allusers:result});
              }
          })
        });
      }        
    else if(req.params.pageno=="page2"){
     
        var nofappointments,nofdoctors,nofusers;
        signup.count().then((count) => {
        console.log(count);
        nofusers=count;
        });
        Doctorschema.count().then((count) => {
          console.log(count);
          nofdoctors=count;
          });
        appointment.count().then((count) => {
          nofappointments=count;
          console.log("All in one:",nofusers,nofdoctors,nofappointments);
          
        
            signup.find({},(err,result)=>{
                if(err){
                  console.log(err);
                }
                else{
                  nofusers=nofusers-nofdoctors-1;
                  console.log(result);
                  res.render("admin_dashboard",{pageno:"page2",nusers:nofusers,ndoctors:nofdoctors,nappointments:nofappointments,Name:name,Mobile:mobilenumber,dp:req.session.Profileimg,allusers:result});
                }
            })
          });
               
    }
    else if(req.params.pageno=="page3"){
    
        var nofappointments,nofdoctors,nofusers;
        signup.count().then((count) => {
        console.log(count);
        nofusers=count;
        });
        Doctorschema.count().then((count) => {
          console.log(count);
          nofdoctors=count;
          });
        appointment.count().then((count) => {
          nofappointments=count;
          console.log("All in one:",nofusers,nofdoctors,nofappointments);
          
        
            signup.find({},(err,result)=>{
                if(err){
                  console.log(err);
                }
                else{
                  nofusers=nofusers-nofdoctors-1;
                  console.log(result);
                  res.render("admin_dashboard",{pageno:"page3",nusers:nofusers,ndoctors:nofdoctors,nappointments:nofappointments,Name:name,Mobile:mobilenumber,dp:req.session.Profileimg,allusers:result});
                }
            })
          });
               
    }
    else if(req.params.pageno=="page4"){
      
        var nofappointments,nofdoctors,nofusers;
        signup.count().then((count) => {
        console.log(count);
        nofusers=count;
        });
        Doctorschema.count().then((count) => {
          console.log(count);
          nofdoctors=count;
          });
        appointment.count().then((count) => {
          nofappointments=count;
          console.log("All in one:",nofusers,nofdoctors,nofappointments);
          
        
            signup.find({},(err,result)=>{
                if(err){
                  console.log(err);
                }
                else{
                  nofusers=nofusers-nofdoctors-1;
                  console.log(result);
                  res.render("admin_dashboard",{pageno:"page4",nusers:nofusers,ndoctors:nofdoctors,nappointments:nofappointments,Name:name,Mobile:mobilenumber,dp:req.session.Profileimg,allusers:result});
                }
            })
          });
               
    }
    else if(req.params.pageno=="page5"){
      
        var nofappointments,nofdoctors,nofusers;
        signup.count().then((count) => {
        console.log(count);
        nofusers=count;
        });
        Doctorschema.count().then((count) => {
          console.log(count);
          nofdoctors=count;
          });
        appointment.count().then((count) => {
          nofappointments=count;
          console.log("All in one:",nofusers,nofdoctors,nofappointments);
          
        
            signup.find({},(err,result)=>{
                if(err){
                  console.log(err);
                }
                else{
                  nofusers=nofusers-nofdoctors-1;
                  console.log(result);
                  res.render("admin_dashboard",{pageno:"page5",nusers:nofusers,ndoctors:nofdoctors,nappointments:nofappointments,Name:name,Mobile:mobilenumber,dp:req.session.Profileimg,allusers:result});
                }
            })
          });
               
    }
    else{
      
        var nofappointments,nofdoctors,nofusers;
        signup.count().then((count) => {
        console.log(count);
        nofusers=count;
        });
        Doctorschema.count().then((count) => {
          console.log(count);
          nofdoctors=count;
          });
        appointment.count().then((count) => {
          nofappointments=count;
          console.log("All in one:",nofusers,nofdoctors,nofappointments);
          
        
            signup.find({},(err,result)=>{
                if(err){
                  console.log(err);
                }
                else{
                  nofusers=nofusers-nofdoctors-1;
                  console.log(result);
                  res.render("admin_dashboard",{pageno:page1,nusers:nofusers,ndoctors:nofdoctors,nappointments:nofappointments,Name:name,Mobile:mobilenumber,dp:req.session.Profileimg,allusers:result});
                }
            })
          });
        }       
    
  }
  else
  {
    res.redirect("/Login");
  }
};
  
  

const getadmin_doctors = (req,res)=>{
  if(req.session.email  || verifyauth==true){
    Doctorschema.find({},(err,result)=>{
      if(err){
        console.log(err);
      }
      else{
        res.render("admin_doctors",{Name:name,Mobile:mobilenumber,dp:req.session.Profileimg,alldoct:result});
      }
    })
    
  }
  else{
    res.redirect("/Login");
  }
}
function getalldetails(req,res,result,user){
    Doctorschema.findOne({DoctorName:user},(err,doctor)=>{
      if(err){
        console.log(err);
      }
      else{
        res.render("admin_profile",{ProfileName:req.session.Name,ProfileMobile:req.session.Mobno,dp:req.session.Profileimg
          ,isdoctor:result.Areudoctor,pCity:result.City,pState:result.State,pEmail:result.Email,pCountry:result.Country,
           pName:result.Name,pMobile:result.Mobno,pavatar:doctor.avatar,pGender:result.Gender,Speciality:doctor.Speciality,
           Treatments:doctor.Treatment,Location:doctor.Location,AvgFees:doctor.AvgFees,Experience:doctor.Experience,
           Awards:doctor.Awards,Education:doctor.Education,HospitalList:doctor.HospitalList
          }); 
      }
      
    })
   
}
const getadmin_profile = (req,res)=>{
  if(req.session.email  || verifyauth==true){
    signup.findOne({Name:req.query.user_search},(err,result)=>{
             if(err){
               console.log(err);
             }
             else if(result.Areudoctor=="true"){
              console.log("Result is:",result);
               getalldetails(req,res,result,req.query.user_search);
             
             }
             else{
               console.log("Result is:",result.Name);
              res.render("admin_profile",{ProfileName:req.session.Name,ProfileMobile:req.session.Mobno,dp:req.session.Profileimg
              ,isdoctor:result.Areudoctor,pCity:result.City,pState:result.State,pEmail:result.Email,pCountry:result.Country,
               pName:result.Name,pMobile:result.Mobno,pavatar:result.Profileimg,pGender:result.Gender,Speciality:result.Speciality,
               Treatments:result.Treatment,Location:result.Location,AvgFees:result.AvgFees,Experience:result.Experience,
               Awards:result.Awards,Education:result.Education,HospitalList:result.HospitalList
              });
             }
    });
    }
  else{
    res.redirect("/Login");
  }
}

const getadmin_report = (req,res)=>{
  console.log("Hi user is:",req.query.user_search);
  if(req.session.email  || verifyauth==true){
    if(req.query.doctor=="true"){
      report.find({Patientname:req.query.user_search},(err,result)=>{
        if(err){
          console.log(err);
        }
        else{
          console.log("Reports are:",result);
          res.render("admin_report",{Name:req.session.Name,Mobile:req.session.Mobno,dp:req.session.Profileimg,allreport:result,isdoctor:"true"});
        }
      })
    }
    else{
      report.find({Patientname:req.query.user_search},(err,result)=>{
        if(err){
          console.log(err);
        }
        else{
          console.log("Reports are:",result);
          res.render("admin_report",{Name:req.session.Name,Mobile:req.session.Mobno,dp:req.session.Profileimg,allreport:result,isdoctor:"false"});
        }
      })
    }
    
    
  }
  else{
    res.redirect("/Login");
  }
}

const getadmin_settings = (req,res)=>{
  if(req.session.email  || verifyauth==true){
    res.render("admin_settings",{Name:name,Mobile:mobilenumber,dp:req.session.Profileimg});
  }
  else{
    res.redirect("/Login");
  }
}

const getadmin_hospitals = (req,res)=>{
  if(req.session.email  || verifyauth==true){
    hospitaldb.find({},(err,result)=>{
      if(err){
        console.log(err);
      }
      else{
        res.render("admin_hospitals",{Name:name,Mobile:mobilenumber,dp:req.session.Profileimg,allhospital:result});
      }
    })
   
  }
  else{
    res.redirect("/Login");
  }
}

const getdoctorprofile = (req,res)=>{
  if(req.session.email  || verifyauth==true){
    var doctorname=req.query.nameofdoctor;
    Doctorschema.findOne({DoctorName:doctorname},(err,result)=>{

      if(err){
        console.log("Something went wrong");
      }
      else{
        res.render("doctor's-profile",{Name:name,Mobile:mobilenumber,doctordetails:result,dp:req.session.Profileimg});
      }

    })
    
  }
  else{
    res.redirect("/Login");
  }
}
function uniquehospitals(req,hospital){
  var unique=[];
  for(let i=0; i<hospital.length-1; i++){
    var arr=hospital.slice(i+1,hospital.length);
    if(!(arr.includes(hospital[i]))){
       if(req.session.searchitem == hospital[i])
       {
        unique.push({Hospital:hospital[i],check:"checked"});
       }
       else{
        unique.push({Hospital:hospital[i],check:""});
       }
        
    }
 }
  unique.push({Hospital:hospital[hospital.length-1],ckeck:""});
  return unique;
}
function uniquetreatment(req,treatment){
  var unique=[];
  for(let i=0; i<treatment.length-1; i++){
    var arr=treatment.slice(i+1,treatment.length);
    if(!(arr.includes(treatment[i]))){
         if(req.session.searchitem==treatment[i])
         {
          unique.push({Treatment:treatment[i],check:"checked"});
         }
         else{
          unique.push({Treatment:treatment[i],check:""});
         }
        
    }
 }
  unique.push({Treatment:treatment[treatment.length-1],ckeck:""});
  return unique;
}
function uniquecities(city){
  var unique=[];
    for(let i=0; i<city.length-1; i++){
       var arr=city.slice(i+1,city.length);
       if(!(arr.includes(city[i]))){
            unique.push({Doctorcity:city[i],check:""});
       }
    }
      unique.push({Doctorcity:city[city.length-1],ckeck:""});

return unique;
    
}
function gethospitals(req,result){
   var y=result;
   let z=[];
   for(let x of y){
      var h=x.HospitalList.split(",");
      for(let i=0; i<h.length; i++){
        z.push(h[i]);
      }
   }
   var hospitals=uniquehospitals(req,z);
   return hospitals;
}
function getcities(result){
    var y=result;
    console.log(y);
    let z=[];
    for(let x of y){
        console.log(x.Location);
        z.push(x.Location);
    }
     var cities=uniquecities(z);
    return cities;
}
function gettreatment(req,result){
  var y=result;
  let z=[];
  for(let x of y){
     var h=x.Treatment.split(",");
     for(let i=0; i<h.length; i++){
       z.push(h[i]);
     }
  }
  var treatments=uniquetreatment(req,z);
  return treatments;
}

function checkedornot(x){
    
      if(x.includes('-')){
        return true;
      }
      else{
        return false;
      }

}
function getuniquedoctors(req,res,cities,hospitals,treatments,prevresult){
    if(req.query.sortby){
      console.log("sorted result is:",prevresult);
      if(req.params.pageno=="page1")
      {
        res.render("Doctorlist",{pageno:"page1",treatment:treatments,dp:req.session.Profileimg,selected:[],city:cities,hospital:hospitals,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:prevresult,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});
      
      }
      else{
        res.render("Doctorlist",{pageno:"page2",treatment:treatments,dp:req.session.Profileimg,selected:[],city:cities,hospital:hospitals,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:prevresult,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});
      
      }
                
    }
    else{
      Doctorschema.find({},(err,result)=>{
        if(err){
          console.log(err);
        }
        else{
          console.log(result);
          if(req.params.pageno=="page1")
          {
            res.render("Doctorlist",{pageno:"page1",dp:req.session.Profileimg,selected:[],treatment:treatments,city:cities,hospital:hospitals,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});
          
          }
          else if(req.params.pageno=="page2")
          {
            res.render("Doctorlist",{pageno:"page2",dp:req.session.Profileimg,selected:[],treatment:treatments,city:cities,hospital:hospitals,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});
          
          }           
        }
      })
    }
   
}
function getpattern(req,res,updatecities,updatetreatments,updatehospitals,select){
  var obj=[];
  for(let i=0; i<select.length; i++){
      obj.push(select[i]);
  }
  console.log("Updated Treatmenst and Updated hospitals are:",updatehospitals,updatetreatments);
  Doctorschema.find( { Location: { $exists: true, $in: obj } },(err,result)=>{
        if(err){
          console.log(err);
        }
        else{
          if(!result){
            if(req.params.pageno=="page1")
            {
              res.render("Doctorlist",{pageno:"page1",dp:req.session.Profileimg,selected:select,treatment:updatetreatments,hospital:updatehospitals,city:updatecities,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});
   
            }
            else if(req.params.pageno=="page2")
            {
              res.render("Doctorlist",{pageno:"page2",dp:req.session.Profileimg,selected:select,treatment:updatetreatments,hospital:updatehospitals,city:updatecities,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});
   
            }
          }
          else{
            console.log(result);
            if(req.params.pageno=="page1")
            {
              res.render("Doctorlist",{pageno:"page1",dp:req.session.Profileimg,selected:select,treatment:updatetreatments,hospital:updatehospitals,city:updatecities,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});
     
            }      
            else if(req.params.pageno=="page2")
            {
              res.render("Doctorlist",{pageno:"page2",dp:req.session.Profileimg,selected:select,treatment:updatetreatments,hospital:updatehospitals,city:updatecities,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});
     
            }
          }
         
        }
  } )
}

function getpattern1(req,res,updatecities,updatetreatments,updatehospitals,select){
  var obj=[];
  for(let i=0; i<select.length; i++){
      obj.push(select[i]);
  }
  console.log("Updated Treatmenst and Updated hospitals are:",updatehospitals,updatetreatments);
  Doctorschema.find({Treatment:{$regex:obj}} ,(err,result)=>{
        if(err){
          console.log(err);
        }
        else{
          if(!result){
            if(req.params.pageno=="page1")
            {
              res.render("Doctorlist",{pageno:"page1",dp:req.session.Profileimg,selected:select,treatment:updatetreatments,hospital:updatehospitals,city:updatecities,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});
   
            }
            else if(req.params.pageno=="page2")
            {
              res.render("Doctorlist",{pageno:"page2",dp:req.session.Profileimg,selected:select,treatment:updatetreatments,hospital:updatehospitals,city:updatecities,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});
   
            }
          }
          else{
            console.log(result);
            if(req.params.pageno=="page1")
            {
              res.render("Doctorlist",{pageno:"page1",dp:req.session.Profileimg,selected:select,treatment:updatetreatments,hospital:updatehospitals,city:updatecities,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});
     
            }
            else if(req.params.pageno=="page2")
            {
              res.render("Doctorlist",{pageno:"page2",dp:req.session.Profileimg,selected:select,treatment:updatetreatments,hospital:updatehospitals,city:updatecities,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});
     
            }
          }
         
        }
  } )
}

function getpattern12(req,res,updatecities,updatetreatments,updatehospitals,select){
  var obj=[];
  for(let i=0; i<select.length; i++){
      obj.push(select[i]);
  }
  console.log("Updated Treatmenst and Updated hospitals are:",updatehospitals,updatetreatments);
  Doctorschema.find( {HospitalList:{$regex:obj}},(err,result)=>{
        if(err){
          console.log(err);
        }
        else{
          if(!result){
            if(req.params.pageno=="page1")
            {
              res.render("Doctorlist",{pageno:"page1",dp:req.session.Profileimg,selected:select,treatment:updatetreatments,hospital:updatehospitals,city:updatecities,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});
            }
            else if(req.params.pageno=="page2")
            {
              res.render("Doctorlist",{pageno:"page2",dp:req.session.Profileimg,selected:select,treatment:updatetreatments,hospital:updatehospitals,city:updatecities,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});
            }
          }
          else{
            console.log(result);
            if(req.params.pageno=="page1"){
            res.render("Doctorlist",{pageno:"page1",dp:req.session.Profileimg,selected:select,treatment:updatetreatments,hospital:updatehospitals,city:updatecities,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});
            }
            else if(req.params.pageno=="page2")
            {
              res.render("Doctorlist",{pageno:"page2",dp:req.session.Profileimg,selected:select,treatment:updatetreatments,hospital:updatehospitals,city:updatecities,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});
            }
          }
         
        }
  } )
}

const Doctorlist =(req,res,middleware)=>
{
  var obj=[{id:"DLF CITY",labelval:"DLF City",x:false},{id:"Dwarka",labelval:"Dwarka",x:false}];
  if(req.session.email  || verifyauth==true)
  {
         if(req.query.remove=="true"){
                appointment.deleteOne({Patientname:req.query.patient},(err)=>{
                       if(err){
                         console.log(err);
                       }
                       else{
                         console.log(req.session.Patientname);
                         console.log("Patient is successfully deleted");
                       }
                });
                res.redirect("/Doctorlist");
                // res.render("Doctorlist",{selected:[],city:cities,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"true",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});        
             
        }
        else{
          var emp='';
          
            Doctorschema.find({},(err,result)=>{
              if(err){
                console.log(err);
              }
              else
              {
                 var updatehospitals=[];
                 var updatetreatments=[];
                 var updatecities=[];
                 var select=[];
                
                if(req.query.cityarray)
                {
                        
                    var c=req.query.cityarray.split(',');
                  
                    console.log("hello mister",c[0],c[1],c[2]);
                    if(req.session.select.length>0)
                    {
                      for(let i=0; i<c.length; i++)
                      {
                          if(c[i].includes('$')){
                            var o= c[i].indexOf('$');
                            console.log(o);
                            c[i]=c[i].slice(0,o);
                            
                            
                              req.session.select.push(c[i]);
                              updatecities.push({Doctorcity:c[i],check:"checked"});
                              req.session.city=updatecities;
                              exist(req,c[i]);
                           
                          }
                          else{
                            alreadyexist(req,c[i]);
                            updatecities.push({Doctorcity:c[i],check:""});
                            req.session.city=updatecities;
                          }
                      }
                        if(req.session.select.length>0)
                        {
                              if(req.session.hospital.length==0){
                                  req.session.hospital=gethospitals(req,result);
                              }
                             
                              if(req.session.treatments.length==0)
                              {
                                req.session.treatments=gettreatment(req,result);
                              }
                              var updatedpattern= getpattern(req,res,req.session.city,req.session.treatments,req.session.hospital,req.session.select);
                        }
                       
                    }
                    else
                    {
                       
                      for(let i=0; i<c.length; i++)
                      {
                          if(c[i].includes('$')){
                            var o= c[i].indexOf('$');
                            console.log(o);
                            c[i]=c[i].slice(0,o);
                            
                            
                              req.session.select.push(c[i]);
                              updatecities.push({Doctorcity:c[i],check:"checked"});
                              req.session.city=updatecities;
                            
                              exist(req,c[i]);
                          }
                          else{
                            alreadyexist(req,c[i]);
                            updatecities.push({Doctorcity:c[i],check:""});
                            req.session.city=updatecities;
                          }
                      }
                      if(req.session.select.length>0)
                      {
                             
                             updatehospitals=gethospitals(req,result);
                             updatetreatments=gettreatment(req,result);
                             var updatedpattern= getpattern(req,res,req.session.city,updatetreatments,updatehospitals,req.session.select);
                      }
                      else
                      {
                            // cities=cities.slice(1,cities.length);
                            var cities=getcities(result);
                            console.log(cities[1].Doctorcity);
                            var hospitals=gethospitals(req,result);
                            var treatments=gettreatment(req,result);
                            getuniquedoctors(req,res,cities,hospitals,treatments,result);
                            // console.log("Unique Doctors",y);
                            // res.render("Doctorlist",{selected:[],city:cities,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});  
                            
                      }
                    }
                   
                 
                }
               else if(req.query.treatmentarray)
                {
                        
                        var c=req.query.treatmentarray.split(',');
                      
                        console.log("hello mister",c[0],c[1],c[2]);
                       if(req.session.select.length>0)
                       {
                              for(let i=0; i<c.length; i++){
                                if(c[i].includes('$')){
                                  var o= c[i].indexOf('$');
                                  console.log(o);
                                  c[i]=c[i].slice(0,o);
                                 
                                  
                                    req.session.select.push(c[i]);
                                    updatetreatments.push({Treatment:c[i],check:"checked"});
                                    req.session.treatments=updatetreatments;  
                                    exist(req,c[i]); 
                                }
                                else{
                                  alreadyexist(req,c[i]);
                                  updatetreatments.push({Treatment:c[i],check:""});
                                  req.session.treatments=updatetreatments;
                                }
                              }
                             
                                  if(req.session.city.length==0)
                                  {
                                    req.session.city=getcities(result);
                                  }
                                  if(req.session.hospital.length==0)
                                  {
                                     req.session.hospital=gethospitals(req,result);
                                  }  
                                   
                                    var updatedpattern= getpattern1(req,res,req.session.city,req.session.treatments,req.session.hospital,req.session.select);
                              
                   
                       } 
                       else
                       {
                           
                              for(let i=0; i<c.length; i++){
                                if(c[i].includes('$')){
                                  var o= c[i].indexOf('$');
                                  console.log(o);
                                  c[i]=c[i].slice(0,o);
                                  
                                  
                                    req.session.select.push(c[i]);
                                    updatetreatments.push({Treatment:c[i],check:"checked"});
                                    req.session.treatments=updatetreatments;
                                    exist(req,c[i]);
                                  
                                 }
                                else{
                                  alreadyexist(req,c[i]);
                                  updatetreatments.push({Treatment:c[i],check:""});
                                  req.session.treatments=updatetreatments;
                                }
                              }
                              if(req.session.select.length>0)
                              {
                                  
                                    updatecities=getcities(result);
                                    updatehospitals=gethospitals(req,result);
                                    var updatedpattern= getpattern1(req,res,updatecities,req.session.treatments,updatehospitals,req.session.select);
                              }
                              else
                              {
                                    // cities=cities.slice(1,cities.length);
                                    var cities=getcities(result);
                                    console.log(cities[1].Doctorcity);
                                    var hospitals=gethospitals(req,result);
                                    var treatments=gettreatment(req,result);
                                    getuniquedoctors(req,res,cities,hospitals,treatments,result);
                                    // console.log("Unique Doctors",y);
                                    // res.render("Doctorlist",{selected:[],city:cities,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});  
                                    
                              } 
                   
                       }
                        
                   }
                   else if(req.query.hospitalarray)
                   {
                        
                            var c=req.query.hospitalarray.split(',');
                          
                            console.log("hello mister",c[0],c[1],c[2]);
                            if(req.session.select.length>0)
                            {
                              for(let i=0; i<c.length; i++){
                                if(c[i].includes('$')){
                                  var o= c[i].indexOf('$');
                                  console.log(o);
                                  c[i]=c[i].slice(0,o);
                                  
                                  
                                    req.session.select.push(c[i]);
                                    updatehospitals.push({Hospital:c[i],check:"checked"});
                                    req.session.hospital=updatehospitals;
                                    exist(req,c[i]);
                                  
                                }
                                else{
                                  alreadyexist(req,c[i]);
                                  updatehospitals.push({Hospital:c[i],check:""});
                                   req.session.hospital=updatehospitals;
                                }
                             }
                         
                                   if(req.session.city.length==0)
                                   {
                                       req.session.city=getcities(result);
                                   }
                                   if(req.session.treatments.length==0)
                                   {
                                        req.session.treatments=gettreatment(req,result);
                                   }
                                    
                                
                                    var updatedpattern= getpattern12(req,res,req.session.city,req.session.treatments,req.session.hospital,req.session.select);
                             
                            }
                            else
                            {
                              for(let i=0; i<c.length; i++){
                                if(c[i].includes('$')){
                                  var o= c[i].indexOf('$');
                                  console.log(o);
                                  c[i]=c[i].slice(0,o);
                                  
                                  
                                    req.session.select.push(c[i]);
                                    updatehospitals.push({Hospital:c[i],check:"checked"});
                                    req.session.hospital=updatehospitals;
                                    exist(req,c[i]);
                                  
                              }
                                else{
                                  alreadyexist(req,c[i]);
                                  updatehospitals.push({Hospital:c[i],check:""});
                                   req.session.hospital=updatehospitals;
                                }
                             }
                             if(req.session.select.length>0)
                              {
                                  
                                    updatecities=getcities(result);
                                    updatetreatments=gettreatment(req,result);
                                    var updatedpattern= getpattern12(req,res,updatecities,updatetreatments,req.session.hospital,req.session.select);
                              }
                                else
                                {
                                      // cities=cities.slice(1,cities.length);
                                      var cities=getcities(result);
                                      console.log(cities[1].Doctorcity);
                                      var hospitals=gethospitals(req,result);
                                      var treatments=gettreatment(req,result);
                                      getuniquedoctors(req,res,cities,hospitals,treatments,result);
                                      // console.log("Unique Doctors",y);
                                      // res.render("Doctorlist",{selected:[],city:cities,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});  
                                      
                                }
                            }
                           
                    }
                  
                 
                    else
                    {
                      var cities=getcities(result);
                      // console.log(cities[1].Doctorcity);
                      console.log("Hi Beauty",req.body.City,req.body.treatment,req.body.hospital);
                       
                      // cities=cities.slice(1,cities.length);
                      var cities=getcities(result);
                      // console.log(cities[1].Doctorcity);
                      var hospitals=gethospitals(req,result);
                      var treatments=gettreatment(req,result);
                      console.log(treatments,hospitals);
                      /**************************** */
                      if(req.query.sortby=="Experience"){
            
                        Doctorschema.aggregate(
                         [
                           { $sort : {Experience: 1} }
                         ],(err,result)=>{
                              if(err){
                                console.log(err);
                              }
                              else{
                               var cities=getcities(result);
                               // console.log(cities[1].Doctorcity);
                            
                               console.log("Hi Beauty experience is:",result);

                               // cities=cities.slice(1,cities.length);
                             
                               getuniquedoctors(req,res,cities,hospitals,treatments,result);
                              }
                        });
                      
                     }
                     else if(req.query.sortby=="DoctorName"){
                       
                        Doctorschema.aggregate(
                         [
                           { $sort : {DoctorName: 1} }
                         ],(err,result)=>{
                              if(err){
                                console.log(err);
                              }
                              else{
                               var cities=getcities(result);
                               // console.log(cities[1].Doctorcity);
                               console.log("Hi Beauty");
                            
                             
                               getuniquedoctors(req,res,cities,hospitals,treatments,result);
                              }
                        });
                     }
           
                     else if(req.query.sortby=="AvgFees"){
                   
                         Doctorschema.aggregate(
                          [
                            { $sort : {AvgFees: 1} }
                          ],(err,result)=>{
                               if(err){
                                 console.log(err);
                               }
                               else{
                                var cities=getcities(result);
                                // console.log(cities[1].Doctorcity);
                                console.log("Hi Beauty");
                              
                                // cities=cities.slice(1,cities.length);
                              
                                getuniquedoctors(req,res,cities,hospitals,treatments,result);
                               }
                         });
                     }
                     else if(req.query.sortby=="Experience(desc)"){
                   
                       Doctorschema.aggregate(
                        [
                          { $sort : {Experience: -1} }
                        ],(err,result)=>{
                             if(err){
                               console.log(err);
                             }
                             else{
                              var cities=getcities(result);
                              // console.log(cities[1].Doctorcity);
                              console.log("Hi Beauty");
                            
                              // cities=cities.slice(1,cities.length);
                            
                              getuniquedoctors(req,res,cities,hospitals,treatments,result);
                             }
                       });
                   }
                     else if(req.query.sortby=="DoctorName(desc)"){
                   
                       Doctorschema.aggregate(
                        [
                          { $sort : {DoctorName: -1} }
                        ],(err,result)=>{
                             if(err){
                               console.log(err);
                             }
                             else{
                              var cities=getcities(result);
                              // console.log(cities[1].Doctorcity);
                              console.log("Hi Beauty");
                              // cities=cities.slice(1,cities.length);
                            
                            
                              getuniquedoctors(req,res,cities,hospitals,treatments,result);
                             }
                       });
                   }
                     else if(req.query.sortby=="AvgFees(desc)"){
                   
                       Doctorschema.aggregate(
                        [
                          { $sort : {AvgFees: -1} }
                        ],(err,result)=>{
                             if(err){
                               console.log(err);
                             }
                             else{
                              var cities=getcities(result);
                              // console.log(cities[1].Doctorcity);
                              console.log("Hi Beauty");
                             
                              // cities=cities.slice(1,cities.length);
                            
                              getuniquedoctors(req,res,cities,hospitals,treatments,result);
                             }
                       });
                   }
                      /**************************** */
                      else{
                        if(req.session.searchitem)
                        {
                          var t=req.session.searchitem;
                            req.session.searchitem="";
                            var loc=req.session.searchlocation;
                            req.session.searchlocation="";
                            searchtheitems(req,res,cities,hospitals,treatments,t,loc);
                        }
                        else{
                          getuniquedoctors(req,res,cities,hospitals,treatments,result);
                        }
                       
                      }
                      
                      // res.render("Doctorlist",{selected:[],city:cities,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});
                  
                    }
                }
          })
      
    }
            
  }
  else
  {
    bolchange=-1;
    res.redirect("/Login");
  }
}
function exist(req,searchit)
{
  var arr=[];
  for(let i=0 ; i<req.session.select.length; i++)
  {
    var temp=req.session.select.slice(i+1,req.session.select.length);
    console.log("My Temp is:",temp);
     if(temp.includes(req.session.select[i]))
     {
        console.log("Good");
     }
     else{
       arr.push(req.session.select[i]);
     }
  }
  console.log("Then the arr is:",arr);
  req.session.select=arr;
  console.log("Then the session",req.session.select);
}
function alreadyexist(req,searchit)
{
  var arr=[];
  for(let i=0 ; i<req.session.select.length; i++)
  {
    
     if(req.session.select[i]==searchit)
     {
        console.log("Good");
     }
     else{
       arr.push(req.session.select[i]);
     }
  }
  console.log("Then the arr is:",arr);
  req.session.select=arr;
  console.log("Then the session",req.session.select);
}
function searchtheitems(req,res,cities,hospitals,treatments,t,loc)
{
    Doctorschema.find({$or:[{Treatment:{$regex:t}},{HospitalList:{$regex:t}},{DoctorName:{$regex:t}}]},(err,result)=>{
        if(err)
        {
          console.log(err);
        }
        else{
          if(req.params.pageno=="page1")
          {
            res.render("Doctorlist",{pageno:"page1",dp:req.session.Profileimg,selected:[t],treatment:treatments,city:cities,hospital:hospitals,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});
          
          }
          else{
            res.render("Doctorlist",{pageno:"page2",dp:req.session.Profileimg,selected:[t],treatment:treatments,city:cities,hospital:hospitals,weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],results:result,givetoast:"false",myprofile:"",select1:"",select2:"",Name:name,changepage2:"false",Mobile:mobilenumber,changepage1:"false",ck0:"",ck1:"",ck2:"",ck3:"",ck4:"",ck5:"",ck6:"",ck7:"",ck8:"",ck9:"",ckx:"",cka:"",ckb:"",ckc:"",ckd:"",cke:"",ckf:"",ckg:"",ckh:"",cki:"",ckj:"",ckk:"",ckl:"",ckm:"",ckn:"",cko:"",ckp:"",ckq:"",ckr:"",cks:"",ckt:"",cku:"",ckv:"",ckw:"",cky:""});
          
          }
         
        }
    })
}
const confirm = (req,res)=>{
  console.log("Hiiii!");
  signup.updateOne({Email:req.query.username},{$set:{Password:req.body.password}},function(err,result){
         
         if(err)
         {
           console.log(err);
           res.render("forgetpass",{n:'',Name:"Profile",Mobile:"1200-1200-12"});
         }
         else{
           if(!result){
             console.log("Please enter the corect username");
           }
           else{
             console.log("Password changed successfully");
             console.log(result);
             res.redirect("/");
           }
         }
  });
}
const getapi=(req,res)=>{
  console.log("Hello World");
  schedules.find({},(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log("json is:",result);
      return res.json(200,result);
    }
  })
}
const Mobileforpass =(req,res)=>{
     
     res.render("Mobileforpass",{Name:"Profile",Mobile:"1200-1200-12",dp:req.session.Profileimg});
}

const checkforpass= (req,res)=>{
    const rid= req.query.requestid;
    console.log(req.query.username);
    console.log(req.query.rid);
    res.render("checkforpass",{reqid:rid, username:req.query.username,Name:"Profile",Mobile:"1200-1200-12"});
}
const postMobileforpass = (req,res)=>{

     const x= req.query.username;
     console.log("Mobile by username",x);
     nexmo.verify.request({
      number: req.body.number,
      brand: 'Vonage',
      code_length: '4'
    }, (err, result) => {
        rid= result.request_id;
        console.log(rid);
      console.log(err ? err : result);
      res.redirect("/checkforpass?username="+x+"&requestid="+rid+"&get=true");
    });
     
}

const postcheckforpass =(req,res)=>{
    
   const uname= req.body.username
  // console.log("uname",username);
  const reqid= req.body.request;
  console.log("reqid",reqid);
  nexmo.verify.check({
    request_id: reqid,
    code: req.body.code1 + req.body.code2 + req.body.code3 + req.body.code4
  }, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(req.body.code);
      console.log(result);
      res.redirect("/forgetpass?username="+uname+"&get=true");
    }
  });
}

const getpasspage =(req,res)=>{
  
  const x= req.body.Email;
  console.log(x);
  res.redirect("/Mobileforpass?username="+x+"&get=true");
  // res.redirect("/forgetpass?username="+x+"&get=true");
}

const forgetpass =(req,res)=>{
  
    const y =req.query.username;
    console.log("forgetpass by username",y);
    res.render("forgetpass",{n:y,Name:"Profile",Mobile:"1200-1200-12"});
}

const Logout =(req,res)=>{
  counter=1;
  bolchange="";
  otpmob='';
  verifyauth=false;
  console.log("Destroying the session of email",req.session.email);
  req.session.destroy(function(){
        res.redirect("/Login");
  });
}
const getimg=(req,res)=>{
  var img=req.query.pic;
  res.render("imgpage",{image:img});
}
function deletedoc(todelete,result)
{
  var arr=[];
  console.log("Hi the result is:",result.Reportimg[0]);
    for(let i=0; i< result.Reportimg.length; i++)
    {
        
          if(result.Reportimg[i]!=todelete)
          {
            if(result.Reportimg[i][0].includes('.jpg')||result.Reportimg[i].includes('.png')||result.Reportimg[i].includes('.jpeg'))
            {
              arr.push(result.Reportimg[i][0]);
            }
               
          }
       
    }   
    return arr;
}
const getdocuments=(req,res)=>{
  var arr;
  if(req.query.delete)
  {
       report.findOne({Patientname:req.query.patientname,ReportDate:req.query.reportdate},(err,result)=>{
            if(err)
            {
              console.log(err);
            }
            else{
              console.log(result);
              arr=deletedoc(req.query.delete,result);
            }
       })
      
       report.updateOne({Patientname:req.query.patientname,ReportDate:req.query.reportdate},{$set:{Reportimg:arr}},(err,result)=>{
        if(err){
          console.log(err);
        }
        else{    
             console.log("After the deletion result is:",result);
             res.render("collectreport",{Name:req.session.Name,Mobile:req.session.Mobile,dp:req.session.Profileimg,reporttype:req.query.doc,alldocs:result.Reportimg});
        }
      })
  }
  else
  {
    report.findOne({Patientname:req.query.patientname,ReportDate:req.query.reportdate},(err,result)=>{
      if(err){
        console.log(err);
      }
      else{    
           console.log(result);
           res.render("collectreport",{Name:req.session.Name,Mobile:req.session.Mobile,dp:req.session.Profileimg,reporttype:req.query.doc,alldocs:result.Reportimg});
      }
    })
  }
 
}
module.exports ={
    indexfile:index,
    getlogin:getlogin,
    getsignup:getsignup,
    postsignup:postsignup,
    postverify_hospital:postverify_hospital,
    postlogin:postlogin,
    getMobileNumber:getMobileNumber,
    postMobileNumber: postMobileNumber,
    verifyotp:verifyotp,
    Dentistry:Dentistry,
    // getcheck:getcheck,
    Doctorlist:Doctorlist,
    Hospitallist:Hospitallist,
    Logout:Logout,
    getpasspage:getpasspage,
    getapi:getapi,
    confirm:confirm,
    forgetpass:forgetpass,
    checkforpass:checkforpass,
    Mobileforpass:Mobileforpass,
    postMobileforpass:postMobileforpass,
    postcheckforpass:postcheckforpass,
    getfaq:getfaq,
    getAppointment:getAppointment,
    getContactUs:getContactUs,
    getplus:getplus,
    getdoctorprofile:getdoctorprofile,
    getabout_us:getabout_us,
    getabouthospital:getabouthospital,
    getsubmitquery:getsubmitquery,
    getreport:getreport,
    getimg:getimg,
    getdocuments:getdocuments,
    getadmin_users:getadmin_users,
    getadmin_hospitals:getadmin_hospitals,
    getadmin_doctors:getadmin_doctors,
    getadmin_settings:getadmin_settings,
    getadmin_dashboard:getadmin_dashboard,
    getadmin_report:getadmin_report,
    getadmin_appointments:getadmin_appointments,
    getadmin_profile:getadmin_profile,
    verify_hospital:verify_hospital,
    search:search,
    all_appointments:all_appointments
}