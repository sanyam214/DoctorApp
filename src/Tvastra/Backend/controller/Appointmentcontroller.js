const signup =  require("../Model/Signupschema");
const multer = require("multer");
const getter = require("./getandpostcontroller");
const schedules =require("../Model/Schedules");
const appointment = require("../Model/Appointmentschema");
const doctordb = require("../Model/Doctorschems");
const report = require("../Model/Medicalreport");
var Doctorschema= require("../Model/Doctorschems");
const getsettings = (req,res)=>{
    console.log("Hello world sanyam singla");
    if(req.session.email){
        if(req.query.givetoast=="true"){
            res.render("user_settings",{dp:req.session.Profileimg,givetoast:"true",ProfileName:req.session.Name,ProfileMobile:req.session.Mobile,isdoctor:req.session.isdoctor});
   
        }
        else{
            res.render("user_settings",{dp:req.session.Profileimg,givetoast:"false",ProfileName:req.session.Name,ProfileMobile:req.session.Mobile,isdoctor:req.session.isdoctor});
  
        }
    }
   else{
       res.redirect("/Login");
   }
}
const getaddschedule = (req,res)=>{
    
            if(req.session.email)
            {
                res.render("Add_schedule",{dp:req.session.Profileimg,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile, timearray:["15:00-9:00"],interval:0,dayselected:req.session.dayselected,hospital:req.session.hospital,starttime:req.session.starttime,endtime:req.session.endtime});
         
            }
            else{
                res.redirect("/Login");
            }
}



const postaddschedule=(req,res)=>{
      
    var starttime=req.body.starttime;
    
        var endtime=req.body.endtime;

        var starthr=starttime[0]+starttime[1];
        starthr=parseInt(starthr);

        var endhr= endtime[0]+endtime[1];
        endhr= parseInt(endhr);

        var startmin=starttime[3]+starttime[4];
        startmin=parseInt(startmin);

        var endmin= endtime[3]+endtime[4];
        endmin= parseInt(endmin);

        var arr=[];
        arr.push(starthr+":"+startmin);

        while(1){
            if(starthr==endhr && startmin>=endmin){
                console.log("Hello World");
                break;
            }
            else if((startmin/60)>=1){
                starthr=starthr+1;
                startmin=startmin%60;
            }
            else{
                console.log("My trees ans mera interval");
                console.log(req.body.interval);
                startmin=startmin+parseInt(req.body.interval);
            }
            
            if(startmin<10){
                arr.push(starthr+":"+"0"+startmin);
                console.log(starthr+":"+"0"+startmin);
            }
            else{
                arr.push(starthr+":"+startmin);
                console.log(starthr+":"+startmin); 
            }
        }
        let arr1=[Object];
        let myobj;
        for(let i=0; i<arr.length-1; i++)
        {
            if(parseInt(arr[i][3]+arr[i][4])<=60  && parseInt(arr[i+1][3]+arr[i+1][4])<=60 )
            {
                myobj={disable:"",subslot:arr[i]+"-"+arr[i+1]}
                arr1.push(myobj);
              
            }
        
        }
        console.log("My best ejs ever");
        console.log(arr1);
        var Dayselect=req.body.days;
        console.log(Dayselect);
        //Dayselect=Dayselect.split(", ");
        var tempobj={subslots:arr1,starttime:req.body.starttime,endtime:req.body.endtime};
        var temparr=[];
        temparr.push(tempobj);
        for(let i=0; i<Dayselect.length; i++)
        {
            schedules.create({
                Doctorname:req.session.Name,
                Email:req.session.email,
                City:req.session.City,
                Disablefull:"false",
                Day:Dayselect[i],
                HospitalName:req.body.hospital,
                interval:req.body.interval,
                Allslots:temparr
            },(err,result)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Hi result",result);
                  
                }
            }) 
        }
        
    res.redirect("/schedule");
}       
function foundmakechanges(req,res,result){
    var starttime=req.body.starttime;
    
    var endtime=req.body.endtime;

    var starthr=starttime[0]+starttime[1];
    starthr=parseInt(starthr);

    var endhr= endtime[0]+endtime[1];
    endhr= parseInt(endhr);

    var startmin=starttime[3]+starttime[4];
    startmin=parseInt(startmin);

    var endmin= endtime[3]+endtime[4];
    endmin= parseInt(endmin);

    var arr=[];
    arr.push(starthr+":"+startmin);

    while(1){
        if(starthr==endhr && startmin>=endmin){
            console.log("Hello World");
            break;
        }
        else if((startmin/60)>=1){
            starthr=starthr+1;
            startmin=startmin%60;
        }
        else{
            console.log("My trees ans mera interval");
            console.log(req.body.interval);
            startmin=startmin+parseInt(req.body.interval);
        }
        
        if(startmin<10){
            arr.push(starthr+":"+"0"+startmin);
            console.log(starthr+":"+"0"+startmin);
        }
        else{
            arr.push(starthr+":"+startmin);
            console.log(starthr+":"+startmin); 
        }
    }
    let arr1=[Object];
    var xobj;
    for(let i=0; i<arr.length-1; i++)
    {
        if(parseInt(arr[i][3]+arr[i][4])<=60  && parseInt(arr[i+1][3]+arr[i+1][4])<=60 ){
            xobj={disable:"",subslot:arr[i]+"-"+arr[i+1]}
            arr1.push(xobj);
        console.log(arr[i]+"-"+arr[i+1]);  
        }
    
    }
    console.log("My best ejs ever");
    console.log(arr1);
    var tempobj={subslots:arr1,starttime:req.body.starttime,endtime:req.body.endtime};
    var temp=[];
   temp.push(tempobj);
    console.log("Updated Temp",temp);
            schedules.updateOne({Doctorname:req.session.Name,HospitalName:req.body.Hospital,Day:req.body.Day},{$set:{Allslots:temp}},(err,result)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log(result);
                }
            })
        
}
const posteditschedule=(req,res)=>{

    // console.log(req.body.starttime);
    // console.log(req.body.endtime);
    // console.log(req.body.Day);
    // console.log(req.body.interval);
    // console.log(req.body.Hospital);
    console.log("Edit Date is:",req.body.Day);
    var editslots;
    schedules.findOne({Doctorname:req.session.Name,HospitalName:req.body.Hospital,Day:req.body.Day},(err,result)=>{
        if(err){
            console.log(err);

        }
        else{
            console.log(result);
            foundmakechanges(req,res,result);
        }
    })
  
    res.redirect("/schedule");

}
const postsettings=(req,res)=>{
    console.log("Hello Rahul");
    if(req.body.newPassword==req.body.confirmPassword){
        signup.findOneAndUpdate({Email:"shivamsingla006@gmail.com"},{$set:{Password:req.body.newPassword}},(err,result)=>{
            if(err){
                console.log(err);
                return ;
            }
            else{
                console.log(result);
                res.redirect("/user_settings?givetoast=true");
            }
        });
    }
    else{
        console.log("Please make the new password and the confirm password matching");
        res.redirect("/user_settings");
    }
   
}
function collectinfo(req,res,name,toaster){
    console.log("kiju");
   
    Doctorschema.findOne({DoctorName:name},(err,result)=>{
        console.log(result.avatar);
        if(err){
            console.log(err);
        }
        else{
            if(toaster!="true"){
                res.render("user_profile",{dp:req.session.Profileimg,moredetails:result,givetoast:"false",Profileimg:result.avatar,ProfileCity:req.session.City,ProfileState:req.session.State,ProfileCountry:req.session.Country,ProfileEmail:req.session.email,ProfileGender:req.session.Gender,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile,isdoctor:req.session.isdoctor});
            }
            else{
                res.render("user_profile",{dp:req.session.Profileimg,moredetails:result,givetoast:"true",Profileimg:result.avatar,ProfileCity:req.session.City,ProfileState:req.session.State,ProfileCountry:req.session.Country,ProfileEmail:req.session.email,ProfileGender:req.session.Gender,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile,isdoctor:req.session.isdoctor});
            }
        }
    })
}
const getprofile = (req,res)=>{
    if(req.session.email)
    {
        console.log("Hello world sanyam singla");
        console.log(req.session.email);
        console.log(req.session.Name);
        if(req.session.isdoctor=="true"){
            if(req.query.givetoast=="true"){
                const moreinfo=collectinfo(req,res,req.session.Name,"true");
          
            }
            else{
                const moreinfo=collectinfo(req,res,req.session.Name,"false");
            }
        
        }
        else{
            var y={Speciality:'',Location:'',Treatment:'',Awards:'',Experience:'',AvgFees:'',Education:'',HospitalList:''};
            res.render("user_profile",{dp:req.session.Profileimg,moredetails:y,givetoast:"false",Profileimg:req.session.Profileimg,ProfileCity:req.session.City,ProfileState:req.session.State,ProfileCountry:req.session.Country,ProfileEmail:req.session.email,ProfileGender:req.session.Gender,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile,isdoctor:req.session.isdoctor});   
        }
       
    }
    else{
        res.redirect("/Login");
    }
   
}

const getprofiledoctor = (req,res)=>{
    
    res.render("profile_doctor",{DoctorProfile:"xyz"});
}
const postdoctordetails = (req,res)=>{
    console.log("Img Details");
    var x;
   
    Doctorschema.uploadedAvatar(req,res,(err)=>{
                if(err){
                    console.log("Multer err",err);
                }
                else{
                    var basic="",basic1="",basic2="",basic3="",basic4="",basic5="",basic6="";
                    var d="";
                    var b=req.body.basic.split(",");
                    for(let k=0; k<b.length; k++){
                        bx=b[k].split(":");
                        bx=bx[1].split("}");
                        bx=bx[0];
                        bx=bx.slice(1,bx.length-1);
                        d=d+bx+",";
                    }
                    d=d.slice(0,d.length-1);
                    basic=d;
                    console.log(d);
                         d="";
                        var b1=req.body.basic1.split(",");
                        for(let k=0; k<b1.length; k++){
                            bx=b1[k].split(":");
                            bx=bx[1].split("}");
                            bx=bx[0];
                            bx=bx.slice(1,bx.length-1);
                            d=d+bx+",";
                        }
                        d=d.slice(0,d.length-1);
                        basic1=d;
                        console.log(d);
                        d="";
                        var b2=req.body.basic2.split(",");
                        for(let k=0; k<b2.length; k++){
                            bx=b2[k].split(":");
                            bx=bx[1].split("}");
                            bx=bx[0];
                            bx=bx.slice(1,bx.length-1);
                            d=d+bx+",";
                        }
                        d=d.slice(0,d.length-1);
                        basic2=d;
                        console.log(d);
                        d="";
                        var b3=req.body.basic3.split(",");
                        for(let k=0; k<b3.length; k++){
                            bx=b3[k].split(":");
                            bx=bx[1].split("}");
                            bx=bx[0];
                            bx=bx.slice(1,bx.length-1);
                            d=d+bx+",";
                        }
                        d=d.slice(0,d.length-1);
                        basic3=d;
                        console.log(d);
                        d="";
                        var b4=req.body.basic4.split(",");
                        for(let k=0; k<b4.length; k++){
                            bx=b4[k].split(":");
                            bx=bx[1].split("}");
                            bx=bx[0];
                            bx=bx.slice(1,bx.length-1);
                            d=d+bx+",";
                        }
                        d=d.slice(0,d.length-1);
                        basic4=d;
                        console.log(d);
                        d="";
                        var b5=req.body.basic5.split(",");
                        for(let k=0; k<b5.length; k++){
                            bx=b5[k].split(":");
                            bx=bx[1].split("}");
                            bx=bx[0];
                            bx=bx.slice(1,bx.length-1);
                            d=d+bx+",";
                        }
                        d=d.slice(0,d.length-1);
                        basic5=d;
                        console.log(d);
                        d="";
                        var b6=req.body.basic6.split(",");
                        for(let k=0; k<b6.length; k++){
                            bx=b6[k].split(":");
                            bx=bx[1].split("}");
                            bx=bx[0];
                            bx=bx.slice(1,bx.length-1);
                            d=d+bx+",";
                        }
                        d=d.slice(0,d.length-1);
                        basic6=d;
                        console.log(d);
                        var avgfees=req.body.AvgFees;
                        var Doctors=req.session.Name;
                        var text=req.body.textarea;
                        var exp=req.body.Experience;
                        Doctorschema.create({
                            DoctorName:Doctors,
                            Description:text,
                            Experience:exp,
                            AvgFees:avgfees,
                            Speciality:basic,
                            Education:basic1,
                            Treatment:basic2,
                            Location:basic3,
                            HospitalList:basic4,
                            Achievements:basic5,
                            Awards:basic6,
                            avatar:req.file.filename      
                         },(err,result)=>{
                             if(err){
                                 console.log(err);
                             }
                             else{
                                 console.log("Data is stored in database ",result);
                                 res.redirect("/");
                             }
                         }) 
                }
            });           
    
}
function getslot(req,res,result,day){
    var temp=[Object];
    var dayslot=[Object];
    for(let i of result.Allslots){
        if(result.Day==day){

            for( let k of i.subslots){
                dayslot.push(k);
            }

        }
    }
    console.log("dayslot are:",dayslot);
    return dayslot;
}
function disable(req,res,result,day){
    console.log("Hi Handsome");
    const y=result
    for(let i of result.Allslots){
    
            for(let k of i.subslots){
                if(k.subslot==req.query.timedisabled && k.disable==""){   
                    k.disable="checked";
                    break;
                }
                if(k.subslot==req.query.timedisabled && k.disable=="checked"){
                    k.disable="";
                    break;
                }
         
        }
    }
  
    schedules.findOneAndUpdate({Doctorname:req.session.Name,HospitalName:req.query.hospital,Day:day},{$set:{Allslots:y.Allslots}},(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(result);
        }
    })
   
}
function findhospitalist(req,res,result){
    console.log("Kuccha",result.HospitalList);
    return result.HospitalList;
}
const getscheduleapi = (req,res)=>{
    schedules.find({},(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            return res.json(200,result);
        }
    })
}
const getschedule = (req,res)=>{
    var slots=[];
    var view="false";
    var selectedday="";
    console.log("Hello world sanyam singla");
    var hospital;
    Doctorschema.findOne({DoctorName:req.session.Name},(err,result)=>{
              if(err){
                  console.log(err);
              }
              else{
                  
                  hospital=findhospitalist(req,res,result);
                  console.log("oh",hospital);
                  hospital=hospital.split(',');
              }
    })

    if(req.session.email){
        if(req.query.day && req.query.viewdetails!="true"){
            schedules.findOneAndRemove({Doctorname:req.session.Name,HospitalName:req.query.hospital,Day:req.query.day},(err,result)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Document removed successfully");
                }
            })
        }
      
        if(req.query.day && req.query.viewdetails=="true"){
            schedules.findOne({Doctorname:req.session.Name,HospitalName:req.query.hospital,Day:req.query.day},(err,result)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log(req.query.timedisabled);
                    if(req.query.timedisabled){
                            console.log("Good Morning Miss");
                            console.log(req.query.timedisabled);
                            console.log(result);
                             disable(req,res,result,req.query.day);
                    }  
                    else{
                        slots=getslot(req,res,result,req.query.day);
                        console.log("slots[0]=",slots[0]);
                        view="true";
                        selectedday=req.query.day;
                    }
                   
                }
            })
        }
       
        schedules.find({Doctorname:req.session.Name},(err,result)=>{
            if(err){
                console.log(err);
            }
            else if(!result){
                res.render("schedules",{dp:req.session.Profileimg,hospitals:hospital,day:selectedday,viewslot:view,subslots:slots,Kschedules:"false",nofschedules:[],ProfileName:req.session.Name,ProfileMobile:req.session.Mobile}); 
            }
            else{
                console.log(result.Daywithslots);
                res.render("schedules",{dp:req.session.Profileimg,hospitals:hospital,day:selectedday,viewslot:view,subslots:slots,kschedules:"true",nofschedules:result,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile}); 
            }
        })
    }
    else{
        res.redirect("/Login");
    }
}

const postprofile = ((req,res)=>{
    console.log("Hi This beautiful world");
    console.log(req.session.email);
    if(req.session.isdoctor=="true"){
        var basic="",basic1="",basic2="",basic3="",basic4="",basic5="",basic6="";
        var d="";
        var b=req.body.basic.split(",");
        for(let k=0; k<b.length; k++){
            bx=b[k].split(":");
            bx=bx[1].split("}");
            bx=bx[0];
            bx=bx.slice(1,bx.length-1);
            d=d+bx+",";
        }
        d=d.slice(0,d.length-1);
        basic=d;
        console.log(d);
             d="";
            var b1=req.body.basic1.split(",");
            for(let k=0; k<b1.length; k++){
                bx=b1[k].split(":");
                bx=bx[1].split("}");
                bx=bx[0];
                bx=bx.slice(1,bx.length-1);
                d=d+bx+",";
            }
            d=d.slice(0,d.length-1);
            basic1=d;
            console.log(d);
            d="";
            var b2=req.body.basic2.split(",");
            for(let k=0; k<b2.length; k++){
                bx=b2[k].split(":");
                bx=bx[1].split("}");
                bx=bx[0];
                bx=bx.slice(1,bx.length-1);
                d=d+bx+",";
            }
            d=d.slice(0,d.length-1);
            basic2=d;
            console.log(d);
            d="";
            
            var b4=req.body.basic4.split(",");
            for(let k=0; k<b4.length; k++){
                bx=b4[k].split(":");
                bx=bx[1].split("}");
                bx=bx[0];
                bx=bx.slice(1,bx.length-1);
                d=d+bx+",";
            }
            d=d.slice(0,d.length-1);
            basic4=d;
            console.log(d);
    
            d="";
            var b6=req.body.basic5.split(",");
            for(let k=0; k<b6.length; k++){
                bx=b6[k].split(":");
                bx=bx[1].split("}");
                bx=bx[0];
                bx=bx.slice(1,bx.length-1);
                d=d+bx+",";
            }
            d=d.slice(0,d.length-1);
            basic6=d;
            console.log(d);
       Doctorschema.updateMany({DoctorName:req.session.Name},{avatar:req.body.avatar,Speciality:basic,Education:basic1,Treatment:basic2,Location:req.body.Location,HospitalList:basic4,Awards:basic6},(err,result)=>{
        if(err){
            console.log("Error ");
        }
        else{
             if(result){
                 console.log("Updated Successfully");
             }
        }
      }); 
      }

             signup.updateMany({Email:req.body.Email},{Profileimg:req.body.avatar,Name:req.body.Name,City:req.body.City,Profileimg:req.body.avatar},(err,result)=>{
                if(err){
                   console.log("Error ");
               }
                else{
                      var tname;
                      console.log("Everything is there");
                      console.log(result);
                      console.log("Pepe",result.Name);
                      console.log(req.session.Name);
                 
                }
            });    
     req.session.Profileimg=req.body.avatar;         
     console.log(req.body);
     res.redirect("/user_profile?givetoast=true");  
});

function Removebookedslot(req,res,result,day,time,removeornot){
    console.log("Hi Handsome");
    const y=result
    for(let i of y.Allslots){
    
            for(let k of i.subslots){
                if(k.subslot==time && k.disable=="" && removeornot=="true"){   
                    k.disable="checked";
                    k.Confirmed="true";
                    break;
                }
                if(k.subslot==time && k.disable=="checked" && removeornot=="false"){   
                    k.disable="";
                    k.Confirmed="false";
                    break;
                }
        }
    }
  
    schedules.findOneAndUpdate({Doctorname:req.session.Doctortobook,HospitalName:req.session.Hospitaltobook,Day:day},{$set:{Allslots:y.Allslots}},(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(result);
        }
    })
   
}

function BookedTimeslot(req,res,timeslot,day,removeornot){
    schedules.findOne({Doctorname:req.session.Doctortobook,HospitalName:req.session.Hospitaltobook,Day:day},(err,result)=>{
         if(err){
             console.log(err);
         }
         else{
             console.log(result);
             Removebookedslot(req,res,result,day,timeslot,removeornot);
         }
    });
}
const getconfirmappointment =(req,res)=>{
    if(req.session.email)
    {
        console.log("Hi Miss",req.session.Timeslot,req.session.Appointedday);
        if(req.query.remove=="true"){
            appointment.updateOne({Timeslot:req.session.Timeslot},{$set:{Confirmed:"cancel"}},(err,result)=>{
                if(err){
                  console.log(err);
                }
                else{
                  console.log(result);
                }
            });   
            BookedTimeslot(req,res,req.session.Timeslot,req.session.Appointedday,"false");
           res.redirect("/Doctorlist");
        }
        else{
             BookedTimeslot(req,res,req.session.Timeslot,req.session.Appointedday,"true");   
            if(req.query.givetoast=="false"){
                 if(req.query.patientname==req.session.PatientName){
    
                res.render("confirmappointment",{Doctortobook:req.session.Doctortobook,dp:req.session.Profileimg,Timeselected:req.session.apptime,Date:req.session.Appointedday,givetoast:"true",Patientname:req.query.patientname,timeslot:req.session.Timeslot,ProfileName:req.session.Name, ProfileMobile:req.session.Mobile, Name:req.query.patientname, Mobile:req.query.mobile,Appointedday:req.session.Date});
                }
                else{
                    res.render("confirmappointment",{Doctortobook:req.session.Doctortobook,dp:req.session.Profileimg,Timeselected:req.session.apptime,Date:req.session.Appointedday,givetoast:"true",Patientname:req.query.patientname,timeslot:req.session.Timeslot,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile, Name:req.query.patientname, Mobile:req.query.mobile,Appointedday:req.session.Date});
                }
            }
            else{
                if(req.query.patientname==req.session.PatientName){
    
                    res.render("confirmappointment",{Doctortobook:req.session.Doctortobook,dp:req.session.Profileimg,Timeselected:req.session.apptime,Date:req.session.Appointedday,givetoast:"true",Patientname:req.query.patientname,timeslot:req.session.Timeslot,ProfileName:req.session.Name, ProfileMobile:req.session.Mobile, Name:req.query.patientname, Mobile:req.query.mobile,Appointedday:req.session.Date});
                }
                else{
                    res.render("confirmappointment",{Doctortobook:req.session.Doctortobook,dp:req.session.Profileimg,Timeselected:req.session.apptime,Date:req.session.Appointedday,givetoast:"true",Patientname:req.query.patientname,timeslot:req.session.Timeslot,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile, Name:req.query.patientname, Mobile:req.query.mobile,Appointedday:req.session.Date});
                }
            }
           
        }
       
    }
    else{
        res.redirect("/Login");
    }
    
}
const getbookappointment=(req,res)=>{
    console.log(req.query.doctor);
    console.log(req.query.hospital);
    req.session.Doctortobook=req.query.doctor;
    req.session.Hospitaltobook=req.query.hospital;
    req.session.Timeslot=req.query.time;
    req.session.apptime=req.query.timeselect;
    req.session.Date=req.query.Date;
    var x=req.query.day;
    if(x.includes(',')){
        x=x[0]+x[1]+x[2];
        req.session.Appointedday=x;
    }
    else{
        req.session.Appointedday=req.query.day;
    }
    console.log("Day sis:",x);
    
    if(req.session.email)
    {
        if(req.query.givetoast=="true"){
                if(req.query.ispatient=="true"){
                    req.session.timeslot=req.query.time;
                    res.render("bookappointment",{Doctor:req.session.Doctortobook,Hospital:req.session.Hospitaltobook,dp:req.session.Profileimg,apptimes:req.session.apptime,Day:req.session.Appointedday,givetoast:"true",time:req.query.timeslot,Name:req.session.Name,PatientName:req.session.Name,PatientEmail:req.session.email,PatientNumber:req.session.Mobile,Mobile:req.session.Mobile});
                }
                else{
                    req.session.timeslot=req.query.time;
                    res.render("bookappointment",{Doctor:req.session.Doctortobook,Hospital:req.session.Hospitaltobook,dp:req.session.Profileimg,apptimes:req.session.apptime,Day:req.session.Appointedday,givetoast:"true",time:req.query.time,Name:req.session.Name,PatientName:"",PatientEmail:"",PatientNumber:"",Mobile:""});
                }
       }
       else{
        if(req.query.ispatient=="true"){
            req.session.timeslot=req.query.timeslot;
            res.render("bookappointment",{Fill:"true",Doctor:req.session.Doctortobook,Hospital:req.session.Hospitaltobook,dp:req.session.Profileimg,apptimes:req.session.apptime,Day:req.session.Appointedday,givetoast:"false",time:req.query.timeslot,Name:req.session.Name,PatientName:req.session.Name,PatientEmail:req.session.email,PatientNumber:req.session.Mobile,Mobile:req.session.Mobile});
        }
        else{
            req.session.timeslot=req.query.timeslot;
            res.render("bookappointment",{Fill:"true",Doctor:req.session.Doctortobook,Hospital:req.session.Hospitaltobook,dp:req.session.Profileimg,apptimes:req.session.apptime,Day:req.session.Appointedday,givetoast:"false",time:req.query.timeslot,Name:req.session.Name,PatientName:"",PatientEmail:"",PatientNumber:"",Mobile:""});
        }
    }
    }
    else{
        res.redirect("/Login");
    }
    
}
const getrescheduleappointment=(req,res)=>{
   if(req.session.email && req.query.newtime){
    console.log("New time is:",req.query.newtime);
    console.log("New Day is:",req.query.newday);
    console.log("New Date is:",req.query.newdate)
       BookedTimeslot(req,res,req.session.Timeslot,req.session.Appointedday,"false");
       BookedTimeslot(req,res,req.query.newtime,req.query.newday,"true");
       appointment.findOneAndUpdate({createdon:req.session.Date,Timeslot:req.session.Timeslot},{$set:{Timeslot:req.query.newtime,createdon:req.query.newdate}},(err,result)=>{
           if(err){
               console.log(err);
           }else{
               console.log("Finding is:",result);
               res.redirect("/Appointment?reschedule=true");
           }
       })
   
   }
   else if(req.session.email){
            if(req.session.Date){
                req.session.Date=req.session.Date;
            }
            else{
                req.session.Date=req.query.Date;
            }
            console.log("The final date is:",req.session.Date)
            if(req.session.Timeslot){
                req.session.Timeslot=req.session.Timeslot;
            }
            else{
                req.session.Timeslot=req.query.timeslot;
            }
            console.log("The final Timeslot is:",req.session.Timeslot);
            if(req.session.Appointedday){
                req.session.Appointedday=req.session.Appointedday;
            }
            else{
                var date=req.session.Date.split(",");
                date=date[0];
                date=date[0]+date[1]+date[2];
                req.session.Appointedday=date;
            }
            console.log("The final Appointed day is:",req.session.Appointedday);
            res.render("rescheduleappointment",{PatientEmail:req.session.Patientemail,Doctor:req.session.Doctortobook,Date:req.session.Date,dp:req.session.Profileimg,Patientname:req.query.Patient,time:req.query.timeslot,ProfileName:req.session.Name,ProfileMobile:req.session.Mobile});
        
    }
    else{
        res.redirect("/Login");
    }
}
function isconfirmed(date){
      var day,month,year;
      console.log("The date is:",date);
      console.log("Ha Ha date");
      date=date.split(",");
      var d=date[1].split(" ");
      console.log("d is:",d);
      day=d[1];
      month=d[2];
      year=date[2];
      console.log("The date,year,month,day is:",year,month,day);
      var m=["Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sep","Oct","Nov","Dec"];
      
      for(let i=0; i<m.length; i++){
          if(month==m[i]){
              month=i;
              break;
          }
      }
      console.log("The month in integer is:",month);
      var thecurrdate=new Date();
      var appdate= new Date(year,month,day);
      console.log("Hi pictures loooking",year,month,day);
      if(thecurrdate<=appdate){
           console.log("Thank God");
           return true;
      }
      else{
          console.log("sorry");
          return false;
      }
}

const postbookappointment= (req,res)=>{
    
        console.log(req.body.Customer);
        console.log(req.session.Date);
        req.session.Patientemail=req.body.Patientemail;
            if(req.body.Customer=="someone"){
                let confirmed=isconfirmed(req.session.Date);
            appointment.create({Doctortobook:req.session.Doctortobook,HospitalName:req.session.Hospitaltobook,Timeslot:req.session.Timeslot,PresenterEmail:req.session.email,Patientname:req.body.Patientname,
            Confirmed:confirmed,Patientmobile:req.body.Patientmobile,Patientemail:req.body.Patientemail,createdon:req.session.Date
            },(err,result)=>{
                    if(err){
                         console.log(err);    
                    }
                    else{
                        console.log(result);
                         req.session.Patientname=result.Patientname;
                         console.log(req.session.Patientname);
                         console.log("Time slot selected is:",result.Timeslot);
                        res.redirect("/confirmappointment?patientname="+result.Patientname+"&&mobile="+result.Patientmobile+"&givetoast=true");
                    }
            });
    }
    else{
        let confirmed=isconfirmed(req.session.Date);
        console.log("Confirmed Date is true or false",confirmed);
        appointment.create({Doctortobook:req.session.Doctortobook,HospitalName:req.session.Hospitaltobook,Timeslot:req.session.Timeslot,PresenterEmail:req.session.email,Patientname:req.body.sessionName,
            Confirmed:confirmed,Patientmobile:req.body.Patientmobile,Patientemail:req.body.Patientemail,createdon:req.session.Date
            },(err,result)=>{
                    if(err){
                         console.log(err);    
                    }
                    else{
                        console.log(result);
                         req.session.Patientname=result.Patientname;
                         console.log(req.session.Patientname);
                         console.log("Time slot selected is:",result.Timeslot);
                         res.redirect("/confirmappointment?patientname="+req.session.Name+"&&mobile="+req.session.Mobile+"&givetoast=true");
                        // res.redirect("/confirmappointment?patientname="+result.Patientname+"&&mobile="+result.Patientmobile+"&givetoast=true");
                    }
            });
        
    }
 }
 const postreport=(req,res)=>{
    
     report.uploadedAvatar(req,res,(err)=>{
        console.log(req);
        var reportarr=[];
          if(req.files){
              for(let i=0; i<req.files.length; i++){
                  reportarr.push(req.files[i].filename);
              }
          }
          console.log(reportarr);
             if(err){
                 console.log(err);
             }
             else{
                report.create({ReportDate:req.body.Date,Title:req.body.Title,Reporttype:req.body.Report,Patientname:req.body.PatientName,Reportimg:reportarr},(err,result)=>{
         
                    if(err){
                         console.log(err);
                     }
                     else{
                         console.log("successully saved in database",result);
                         res.redirect("/report?givetoastar=true");
           
                     }
                 })
             }
     });
      
 }
module.exports={
    getsettings:getsettings,
    getprofile: getprofile,
    getschedule:getschedule,
    postprofile:postprofile,
    postsettings:postsettings,
    getaddschedule: getaddschedule,
    postaddschedule:postaddschedule,
    getbookappointment:getbookappointment,
    postbookappointment:postbookappointment,
    getconfirmappointment:getconfirmappointment,
    getrescheduleappointment:getrescheduleappointment,
    getprofiledoctor:getprofiledoctor,
    postdoctordetails:postdoctordetails,
    postreport:postreport,
    posteditschedule:posteditschedule,
 
}
