require('dotenv').config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const ejsMATE= require("ejs-mate");
const passport = require("passport");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local");
const path = require("path");
const methodoverride= require("method-override");
const mongoose = require("mongoose");
const MONGO_URL=process.env.MONGODB_URI;
const User = require("./models/users.js");
const session = require("express-session");
const fs = require("fs");
const sharp = require("sharp");
const { exec } = require("child_process");
const multer = require("multer");
const secret = process.env.SESSION_SECRET;

// Define storage options for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");  // Specify folder to store the file
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);  // Generate a unique filename
    },
  });
  
  // Set up the Multer upload middleware
  const upload = multer({ storage: storage });


// Increase body size limits for large base64 images
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMATE);
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));


// app.get("/",(req,res)=> {
//     res.send("hii I am root");
// });

const sessionOptions = {
    
    secret: "mysupersecretstring",
    resave: false, 
    saveUninitialized: true,
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});




//website
app.get("/",(req,res)=>{
    res.render("listings/home.ejs");
});

app.get("/about",(req,res)=>{
    res.render("listings/about.ejs");
});

app.get("/scan",(req,res)=>{
    res.render("listings/scan.ejs")
});

app.post("/results",(req,res)=>{
    res.render("listings/results.ejs");
});


// app.post("/process-scan", (req, res) => {
//     // Later: handle file upload + face shape detection here
//     req.flash("success", "Image received! Processing...");
//     res.redirect("/home");
// });





// app.post("/process-scan", async (req, res) => {
//     console.log("BODY RECEIVED --->", req.body);
    
//     const imageData = req.body.capturedData;

//     if (!imageData) {
//         req.flash("error", "No image captured.");
//         return res.redirect("/scan");
//     }

//     // Remove the prefix "data:image/png;base64,"
//     const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
//     const buffer = Buffer.from(base64Data, "base64");

//     // Save it temporarily
//     const imagePath = path.join(__dirname, "public/uploads", `scan_${Date.now()}.png`);
//     try {
//         await sharp(buffer).resize(300, 300).toFile(imagePath);
//         console.log("Saved image:", imagePath);
//     } catch (err) {
//         console.error("Error saving image:", err);
//         req.flash("error", "Image processing failed.");
//         return res.redirect("/scan");
//     }

//     // Call Python script to analyze the face shape
//     exec(`python3 ai/face_shape_classifier.py ${imagePath}`, (error, stdout, stderr) => {
//         if (error) {
//             console.error(`AI Error: ${error}`);
//             req.flash("error", "AI failed to analyze the image.");
//             return res.redirect("/scan");
//         }

//         const faceShape = stdout.trim(); // e.g., "oval", "round", etc.
//         console.log("Predicted face shape:", faceShape);

//         // Suggest hairstyles based on face shape
//         const suggestions = getHairstyles(faceShape);

//         // Render the result page
//         res.render("listings/results.ejs", {
//             faceShape,
//             suggestions
//         });
//     });
// });

// // Helper function to get hairstyle suggestions based on face shape
// function getHairstyles(faceShape) {
//     const hairstyles = {
//         oval: [
//             "Short Quiff",
//             "Pompadour",
//             "Side Part"
//         ],
//         round: [
//             "Spiky Hair",
//             "Undercut",
//             "Buzz Cut"
//         ],
//         square: [
//             "Crew Cut",
//             "Side Swept",
//             "Ivy League"
//         ],
//         heart: [
//             "Textured Crop",
//             "Shaggy Hair",
//             "Long Layers"
//         ]
//     };

//     return hairstyles[faceShape] || ["Try something new!"];
// }

// app.post("/process-image", upload.single("image"), async (req, res) => {
//     const imagePath = req.file.path;
//     try {
//       // Process image with AI
//       const result = await analyzeFaceShape(imagePath);
//       res.json({ success: true, result });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, error: "Failed to process image" });
//     }
//   });
  




//users 
app.get("/signup",(req,res)=>{
    res.render("login/signup.ejs");
});

app.get("/login",(req,res)=>{
    res.render("login/login.ejs");
});

app.listen(PORT,() => {
    console.log(`listening to port ${PORT} :3`);
});