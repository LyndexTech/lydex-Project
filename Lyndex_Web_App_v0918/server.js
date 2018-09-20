/*********************************************************************************
* Lyndex Web App
*
* Developed by Steven Wang
*
* Version: 1.0.0
*
* Date: Sep.20.2018
*
********************************************************************************/ 

// load Node.js libraries
const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs-extra");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const clientSessions = require("client-sessions");
// load custom JavaScript
const dataService = require("./data_service.js");     
const dataServiceAuth = require("./data_service_auth.js");

// set up web app
var app = express();

// express-handlebars function --  layout template and helper functions set up
app.engine('.hbs', exphbs({extname: '.hbs', 
                           defaultLayout: 'main',
                           helpers: {
                            navLink: function(url, options){
                              return '<li' + ((url == app.locals.activeRoute) ? ' class="active" ' : '') + '><a href="' + url + '">' + options.fn(this) + '</a></li>';
                           },
                            equal: function (lvalue, rvalue, options) {
                            if (arguments.length < 3)
                            throw new Error("Handlebars Helper equal needs 2 parameters");
                            if (lvalue != rvalue) {
                            return options.inverse(this);
                            } else {
                            return options.fn(this);
                            }
                           } 
                          }
                        }));
app.set('view engine', '.hbs');

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// user upload functions middleware
const storage = multer.diskStorage({
    destination: "./public/files/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
// NEED TO BE MODIFIED *************************************************
// to create AJAX call Javascript for front end uploading modal view
app.post("/accessment", upload.array("files", 12), (req, res) => {
    res.redirect("/accessment");
});
//*********************************************************************/

// middlewares setup functions
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req,res,next){
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
 });
app.use(clientSessions({
  cookieName: "session",
  secret: "lyndex_web_app",
  duration: 2*60*1000,
  activeDuration: 60*1000
}));
app.use(function(req, res, next) {
  res.locals.session = req.session;
 next();
 });

 //helper middleware function to check login status
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/signin");
  } else {
    next();
  }
} 

//*** Define GET methods of all routes */

// setup a route to listen on the default url path 
app.get("/", function(req,res){
    res.render('home');
});
 
 // setup a route to listen on /home
app.get("/home", function(req,res){
   res.render('home');
});

 // setup a route to listen on /signin
app.get("/signin", (req, res) => {
    res.render("signin");
});
 
// setup a route to listen on /register
app.get("/register", (req, res) => {
    res.render("register");
});

// setup a route to listen on /forgetpassword
app.get("/forgetpassword", (req, res) => {
    res.render("forgetpassword");
});

// setup a route to listen on /logout
app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/");
});

app.get("/accessment", ensureLogin, (req, res) => {
    res.render("accessment");
});
// setup a route to listen on /companyinfo
app.get("/companyinfo", ensureLogin, (req, res) => {
    // Company info query from database need to be developed
    res.render("companyinfo");
});

// setup a route to listen on /financialanalysis
app.get("/financialanalysis", ensureLogin, (req, res) => {
    // financial analysis query from database need to be developed
    res.render("financialanalysis");
});

// setup a route to listen on /taxcredit
app.get("/taxcredit", ensureLogin, (req, res) => {
    // tax credit query from database need to be developed
    res.render("taxcredit");
});

// setup a route to listen on /taxexpense
app.get("/taxexpense", ensureLogin, (req, res) => {
    // tax expense query from database need to be developed
    res.render("taxexpense");
});

// setup a route to listen on /product
app.get("/product", ensureLogin, (req, res) => {
    // product query from database need to be developed
    res.render("product");
});

//*** GET methods done  */

//*************************************************************//

//*** Define all POST methods */

// register user form
app.post("/register", (req, res) => {
    dataServiceAuth.registerUser(req.body)
    .then(() => {
      res.render("register", {successMessage: "User created"});
    })
    .catch((err) => {
      res.render("register", {errorMessage: err, userName: req.body.userName});
    });
});

// sign-in user form
app.post("/signin", (req, res) => {
    req.body.userAgent = req.get("User-Agent");
    dataServiceAuth.checkUser(req.body)
    .then((user) => {
      req.session.user = {
      userName: user.userName,
      email: user.email
      }
      res.redirect("/accessment");
     })
    .catch((err) => {
      res.render("signin", {errorMessage: err, userName: req.body.userName});
    });
});

// POST method for company info form to be developed

// POST method for financial analysis form to be developed

// POST method for tax credit form to be developed

// POST method for tax expense form to be developed

// POST method for product form to be developed

//*** POST methods end */

//*****************************************************/

// setup custom 404 page
app.use((req,res) => {
    res.status(404).send("Cannot find the page!!!");
});
  
// setup http server to listen on HTTP_PORT
dataService.initialize()
.then(dataServiceAuth.initialize)
.then(function(){
app.listen(HTTP_PORT, function(){
    console.log("app listening on: " + HTTP_PORT)
});
}).catch(function(err){
    console.log("unable to start server: " + err);
});
  