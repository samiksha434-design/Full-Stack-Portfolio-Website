require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const engine = require("ejs-mate");
const multer = require("multer");
const {storage} = require("./cloudConfig.js");
const upload = multer({storage});
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const messages = require("./models/messages.js");
const Project = require("./models/projects.js");
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized: true
};

app.use(session(sessionOptions));
app.use(flash());

// const MONGO_URL = "mongodb://127.0.0.1:27017/MyPortFolio";
const dns = require("dns");
dns.setServers(["1.1.1.1", "0.0.0.0"]);
const cloudName = process.env.CLOUD_NAME;
const dbUrl = process.env.ATLASDB_URL;

main().then(()=>{
    console.log("Connected to AtlasDB");
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(dbUrl);
}

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/", async(req, res) =>{
    let projects = await Project.find({});
    // console.log(projects);
    res.render("index", {projects});
});

app.post("/contact", async(req, res) =>{
    let newMessage = new messages(req.body);
    await newMessage.save();
    req.flash("success", "Message send successfully");
    res.redirect("/");
});

app.get("/admin", async(req, res) =>{
    res.render("adminForm");
});

app.post("/projects" , upload.single("image"), async(req, res) =>{

     if(!req.file){
        req.flash("error","Image upload failed!");
        return res.redirect("/admin");
    }

    let newProject = new Project({
        title: req.body.title,
        image : req.file.path,
        github : req.body.github,
        live : req.body.live,
        description : req.body.description
    });
    console.log(newProject);
    await newProject.save();
    req.flash("success", "Project added successfully!");
    res.redirect("/");
});

app.listen(8000, (req,res)=>{
    console.log("Server is listening to port 8000");
});