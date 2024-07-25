const express = require("express");
const morgan = require("morgan");
const path = require("path");
const passport = require('./middlewares/authentication');
const expressSession = require('express-session');
// const db = require("./models");
const app = express();
const router = express.Router();
const bcrypt = require('bcryptjs');
const expressSanitizer = require('express-sanitizer')
const os = require('os');
const userRoutes = require("./middlewares/routes/userRoutes")
const habitRoutes = require("./middlewares/routes/habitRoutes");
const noteRoutes = require("./middlewares/routes/noteRoutes");
const commentRoutes = require("./middlewares/routes/commentRoutes");

const mongoose = require("mongoose");
const randomString = () => Array.from({length:10}, () => Math.random().toString(36).charAt(2)).join('');
const multer = require("multer");


require('dotenv').config();

let dbhost = '127.0.0.1';
if(process.env.NODE_ENV == "production") dbhost = 'mongo';
console.log('trying to connect to '+'mongodb://'+dbhost+':27017/HabitualDB')

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to the database');
    })
    .catch((error) => {
      console.log('Connection error:', error);
    });


//generic template start
const cors = require('cors');
const Users = require("./models/User");
const Habit = require("./models/Habit");
const Image = require("./models/Image");

app.use(cors({
    origin: ["http://localhost:3000", /*"http://"+os.networkInterfaces()['en0'][1].address+":3000"*/],
    method: ['POST, GET'],
    credentials: true
}));


const PORT = process.env.PORT;

//has to be used after the body-parser inorder to sanitize
app.use(expressSanitizer());

// this lets us parse 'application/json' content in http requests
app.use(express.json());

// setup passport and session cookies
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// add http request logging to help us debug and audit app use
const logFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(logFormat));
// app.get("/*", (req,res) => {
//   res.status(200).sendFile(path.join(__dirname, "../client/build/index.html"));
// });
// app.use(express.static(path.join(__dirname, "../client/build")));

  // all unknown routes should be handed to our react app
  // app.get("*", function (req, res) {
  //   res.sendFile(path.join(__dirname, "../client/build", "index.html")); //temp
  // });

  // Habits.create({userId: 2,habits: [{ habitId: 102, makeHabit: '100m x 10 dash', breakHabit: 'No high calorie intake', progress: 50, daysRemaining: 5, streak: 0, days: 6}]});
  
// start up the server
if (PORT) {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
} else {
  console.log("===== ERROR ====\nCREATE A .env FILE!\n===== /ERROR ====");
}
app.use(["/api/users", "/api/user"], passport.isAuthenticated(), userRoutes);
app.use(['/api/habit', '/api/habits'], passport.isAuthenticated(), habitRoutes);
app.use(['/api/notes', '/api/note'], passport.isAuthenticated(), noteRoutes);
app.use(['/api/comments', '/api/comment'], passport.isAuthenticated(), commentRoutes);

app.post('/api/login',
passport.authenticate('local'), 
  (req, res) => {
    res.json(req.user)
  });
  
  app.post('/api/register', 
  (req, res) => {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    
    /* if(req.user === 'dorjee' && req.password === 'hi'){
    //   res.json(req.user);
    } */ 
    // console.log(req.body.username, req.body.password)
    const username = req.body.username;
    // console.log(req.body, "body")
    Users.findOne({username}).then(user => {
      console.log("user doc", user);
      if(user){
        res.status(500).json({error: 'Username already exist'});
        return;
      }
      createUser();
    }).catch(e => console.log(e));

  const createUser = () => {
    console.log(req.body,"reqbody")
    const password = bcrypt.hashSync(req.body.password, 10);
    const motto = req.body.motto;
    Users.create({
      userId: randomString(),
      username,
      password,
      name: req.body.name,
      motto
    })
    .then(r => {  
      // res.status(500).end(); {
        Habit.create({
          userId: r._doc.userId
        }).then(rr => {
          res.status(200).json({name: r._doc.name, username: r._doc.username, habit: rr._doc.habits});
        }).catch(err => {
          console.log(err)
          res.status(500).json(err);
        }); 
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  }
  });

app.get('/api/login',
  (req, res) => {
    if(req.user){
       res.json(req.user)
    }else{
      res.sendStatus(401);
    }
});

// const Storage = multer.diskStorage({
//   destination: "imgUplaods",
//   fileName: (req, file, cb) => {
//     cb(null, file.originalname);
//   }
// });
const Storage = multer.memoryStorage({
    destination: "imgUplaods",
    fileName: (req, file, cb) => {
      cb(null, file.originalname);
    }
});


const upload = multer({storage: Storage}).single("img");
app.post('/imageUpload', passport.isAuthenticated(), (req, res) => {
  upload(req, res, (err) => {
    console.log("filemula", req.file)
    if(req.file === undefined || req.file.size < 100 || req.file.size > 7*10^6) {
      res.status(500).json({error:'no file'});
      return;
    }
    if (err) {
      return res.status(500).json({ error: err });
    }

    const imageData = {
      data: req.file.buffer,
      contentType: req.file.mimetype || 'image/png'
    };

    Image.findOneAndUpdate(
      { userId: req.session.passport.user }, // Filter
      { $set: { image: imageData } }, // Update
      { new: true, upsert: true } // Options: return the updated document, create if not exists
    )
    .then(r => res.status(200).json({"file":"uploaded"}))
    .catch(e => res.status(500).json({ error: e }));
  });
});

app.get('/profileImg', (req, res) => {
  Image.findOne({ userId: req.session.passport.user }, { _id: 0 }).then(a => {
    if (a && a.image && a.image.data) {
      res.setHeader('Content-Type', a.image.contentType);
      res.status(200).send(a.image.data);
    } else {
      res.status(404).send('Image not found');
    }
  }).catch(err => {
    res.status(500).send('Internal Server Error');
  });
});



app.post('/api/logout', 
  passport.isAuthenticated(),
  function(req, res, next){
    req.logout((err) => {
      if (err) { return next(err); }
      // res.redirect('/');
    });
  res.status(200).json({ message: 'Logout successful' });
});


// for production use, we serve the static react build folder
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  // all unknown routes should be handed to our react app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build", "index.html")); //temp
  });
}