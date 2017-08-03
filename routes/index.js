var express = require('express');
var router = express.Router();
var passport = require('passport');

var db;

var m = require("../middlewares");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var nodemailer = require("nodemailer")
var transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
            user: 'abhimessi318@gmail.com', // Your email id
            pass: 'Abhishek318' // Your password
          }
        });

/* GET home page. */
router.get('/', function (req, res) {
  res.render('cover', { user : req.user });
});

router.get('/login', function(req, res) {
  res.render('login_signup', { });
});

router.get('/donation', function(req, res) {
  res.render('donation', { });
});
router.get('/scheduling', function(req, res) {
  res.render('scheduling', { });
});
router.get('/item', function(req, res) {
  res.render('item', { });
});

//My code
router.post('/donor', function(req, res) {
  console.log(req.body);
  var query;
  var data;
   query = 'INSERT INTO donor values(?,?,?,?,?,?,?)';
    data = [
    req.body.id,
    req.body.fname,
    req.body.lname,
    req.body.email,
    req.body.address,
    req.body.mobileno,
    req.body.amt,
    ];
  db.query(query,data, function(err){
    if(err){
      throw err;
      return res.sendStatus(500);
    }
      return res.send("SUCCESS");
  });
});

router.post('/item', function(req, res) {
  console.log(req.body);
  var query;
  var data;
   query = 'INSERT INTO item values(?,?,?,?,?,?,?,?)';
    data = [
    req.body.id,
    req.body.type,
    req.body.quantity,
    req.body.manu_date,
    req.body.expiry_date,
    req.body.dealer,
    req.body.cost,
    req.body.purchased,
    ];
  db.query(query,data, function(err){
    if(err){
      throw err;
      return res.sendStatus(500);
    }
      return res.send("SUCCESS");
  });
});
//End


router.post('/register', function(req, res) {
  console.log(req.body);
  var query,query2;
  var data,data2;
  query2 = 'INSERT INTO user (profile_id,Email,password,type) values(?,?,?,?)';
  data2 = [
  req.body.id,
  req.body.email,
  req.body.password,
  ];

  if(req.body.userType=='FAMILY'){
    query = 'INSERT INTO family values(?,?,?,?,?,?,?)';
    data = [
    req.body.id,
    req.body.fname,
    req.body.lname,
    req.body.mobNo,
    req.body.age,
    req.body.sex,
    req.body.income,
    ];
    data2.push("family");
  }

  else if(req.body.userType=="ADMIN"){
    query = 'INSERT INTO admin values(?,?,?,?)';
    data = [
    req.body.id,
    req.body.mobNo,
    req.body.age,
    req.body.sex,
    ];
    data2.push("admin");
  }

  else{
    query = 'INSERT INTO volunteer values(?,?,?,?,?,?)';
    data = [
    req.body.id,
    req.body.fname,
    req.body.lname,
    req.body.mobNo,
    req.body.age,
    req.body.sex,
    ];
    data2.push("volunteer");
  }
  db.query(query,data, function(err){
    if(err){
      throw err;
      return res.sendStatus(500);
    }
    console.log(query2,data2);
    db.query(query2,data2, function(err){
      if(err){
        throw err;
      }
      return res.send("SUCCESS");
    })
  });
});

router.post('/login',passport.authenticate('local-login'), function(req, res) {
  res.redirect('/profile');
});

router.post('/complaint', function(req, res) {
const mailOptions = {
    from: 'abhimessi318@gmail.com',
    to: 'abhishek.rathi2015@vit.ac.in',
    subject: 'Complaint : '+req.body.name,
    html: JSON.stringify(req.body),
};

transport.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
    }
    console.log(`Message sent: ${info}`);
});
  // User.find({
  //   block : req.user.block
  // }).exec(function(err,users){
  //   if(err)throw err;
  //   users.forEach(function(user){
  //     if(user.userType!="Warden" && user.userType!="Mess")return;
  //     var mailOptions = {
  //           from: 'abhimessi318@gmail.com', // sender address
  //           to: 'abhishek.rathi2015@vit.ac.in', // list of receivers
  //           subject: 'Complaint : '+req.body.complaintType, // Subject line
  //           text: req.body.description //, // plaintext body
  //           // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
  //         };
  //         transporter.sendMail(mailOptions, function(error, info){
  //           if(error){
  //             console.log(error);
  //               //res.json({yo: 'error'});
  //             }else{
  //               console.log('Message sent: ' + info.response);
  //               //res.json({yo: info.response});
  //             };
  //           });
  //       });
  // })
  // var complaint = new Complaint({
  //   complaintType: req.body.complaintType,
  //   description: req.body.description,
  //   date : new Date(),
  //   user : req.user
  // });
  // complaint.save(function(err){
  //   if(err){
  //     console.log("ERROR : ",err);
  //   }else{
  //     return res.redirect("/complaint");
  //   }
  // });
});

router.post('/forum',m.authenticatedOnly, function(req, res) {
  var question = new Question({
    description: req.body.description,
    date : new Date(),
    tags: req.body.tags,
    answersCount: question.answers.length,
    user : req.user
  });
  question.save(function(err){
    if(err){
      console.log("ERROR : ",err);
    }
    else{
      return res.redirect("/forum");
    }
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get("/complaint",function(req,res){
  // Complaint.find({user: req.user},function(err,complaints){
  //   if(err)throw err;
  //   res.render("complaint",{
  //     complaints : complaints  
  //   });
  // });
  res.render("complaint");
});

router.get("/profile",m.authenticatedOnly, function(req,res){
  console.log(req.user);
  res.render("profile",{
    user : req.user
  })


  // if(req.user.userType=="Mess"){
  //   Complaint.find({}).populate("user").exec(function(err,complaints){
  //     var newCom = [];
  //     complaints.forEach(function(com){
  //       if(com.complaintType=="Mess"){
  //         newCom.push(com);
  //       }
  //     })
  //     complaints = newCom;
  //     if(err)throw err;
  //     res.render("profile_mess",{
  //       complaints : complaints,
  //       user:req.user
  //     });
  //   });
  // }
  // else if(req.user.userType=="Warden"){
  //   Complaint.find({}).populate("user").exec(function(err,complaints){
  //     var newCom = [];
  //     complaints.forEach(function(com){
  //       if(com.user.block==req.user.block && com.complaintType!="Mess"){
  //         newCom.push(com);
  //       }
  //     });
  //     complaints = newCom;
  //     if(err)throw err;
  //     res.render("profile_warden",{
  //       complaints : complaints,
  //       user:req.user
  //     });
  //   });
  // }
  // else{
  //   Complaint.find({"user" : req.user}).populate("user").exec(function(err,complaints){
  //     if(err)throw err;
  //     res.render("profile",{
  //       complaints : complaints,
  //       user:req.user
  //     });
  //   });
  // }
});

router.get("/forum",function(req,res){
  res.render("../public/webtech/mainforum");
});

module.exports = function(database){
  db = database;
  return router;
}

router.get('/logout',function(req,res,next){
if(req.user){
  req.user = null;
  res.redirect('/');
}
else{
  res.redirect('/');
}
});
