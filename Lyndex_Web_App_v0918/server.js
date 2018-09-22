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
    //req.body.userAgent = req.get("User-Agent");
    dataServiceAuth.checkUser(req.body)
    .then((user) => {
      req.session.user = {
      cli_loginName: user.cli_loginName,
      }
      res.redirect("/accessment");
     })
    .catch((err) => {
      res.render("signin", {errorMessage: err, cli_loginName: req.body.cli_loginName});
    });
});

// POST method for company info form to be developed

app.post('/post_companyinfo', function (req, res) {

    var request = {
        'basicInfo': {
            'companyName': req.body.companyName,
            'companyLocation': req.body.companyLocation,
            'companyType': req.body.companyType,
            'fiscalYear': req.body.fiscalYear
        },
        'incomeStatement':{
            '2015':{
                'ins_sales': req.body.sales2015,
                'ins_workingCapital': req.body.workingCapital2015,
                'ins_profitLoss': req.body.profit2015,
                'ins_operatingProfit': req.body.operatingProfit2015,
                'ins_incomeTax': req.body.incomeTax2015,
                'ins_COGS': req.body.cogs2015,
                'ins_rd': req.body.rd2015
            },
            '2016':{
                'ins_sales': req.body.sales2016,
                'ins_workingCapital': req.body.workingCapital2016,
                'ins_profitLoss': req.body.profit2016,
                'ins_operatingProfit': req.body.operatingProfit2016,
                'ins_incomeTax': req.body.incomeTax2016,
                'ins_COGS': req.body.cogs2016,
                'ins_rd': req.body.rd2016
            },
            '2017':{
                'ins_sales': req.body.sales2016,
                'ins_workingCapital': req.body.workingCapital2017,
                'ins_profitLoss': req.body.profit2017,
                'ins_operatingProfit': req.body.operatingProfit2017,
                'ins_incomeTax': req.body.incomeTax2017,
                'ins_COGS': req.body.cogs2017,
                'ins_rd': req.body.rd2017
            },
        },
        'balancesheet':{

            '2015':{
                'bas_propertyPlantEquip': req.body.ppe2015,
                'bas_constructInProgress': req.body.construction2015,
                'bas_computerSoftwareEquip': req.body.cse2015,
                'bas_otherPPE': req.body.OtherPpe2015,
                'bas_accummulatedDepreciation': req.body.accumDep2015,
                'bas_intangibleAsset': req.body.intangibleAssets2015
            },
            '2016':{
                'bas_propertyPlantEquip': req.body.ppe2016,
                'bas_constructInProgress': req.body.construction2016,
                'bas_computerSoftwareEquip': req.body.cse2016,
                'bas_otherPPE': req.body.OtherPpe2016,
                'bas_accummulatedDepreciation': req.body.accumDep2016,
                'bas_intangibleAsset': req.body.intangibleAssets2016
            },
            '2017':{
                'bas_propertyPlantEquip': req.body.ppe2017,
                'bas_constructInProgress': req.body.construction2017,
                'bas_computerSoftwareEquip': req.body.cse2017,
                'bas_otherPPE': req.body.OtherPpe2017,
                'bas_accummulatedDepreciation': req.body.accumDep2017,
                'bas_intangibleAsset': req.body.intangibleAssets2017
            },

        },
        'cashflowStatement':{

            '2015':{
                'caf_deferredTax': req.body.deferredTax2015,
                'caf_investmentTaxCredit': req.body.investmentTaxCredits2015,
                'caf_capitalExpenditure':req.body.creditExpenditure2015
            },
            '2016':{
                'caf_deferredTax': req.body.deferredTax2016,
                'caf_investmentTaxCredit': req.body.investmentTaxCredits2016,
                'caf_capitalExpenditure':req.body.creditExpenditure2016
            },
            '2017':{
                'caf_deferredTax': req.body.deferredTax2017,
                'caf_investmentTaxCredit': req.body.investmentTaxCredits2017,
                'caf_capitalExpenditure':req.body.creditExpenditure2017
            }
        }
    }

    var userName = req.session.user.userName;
    var userEmail = req.session.user.email;

    // TODO
    if(SaveCompanyInfo(request, userName, userEmail)){
        res.redirect("/financialanalysis");
    }
    else{
        res.render("companyinfo",
            {errorMessage: "errorMessage", viewModel: request}
        );
    }
})
// POST method for financial analysis form to be developed

app.post('/post_financialanlysis', function (req, res) {

    var request = {
        'industryBenchmark': {
            'industry': req.body.industry,
            'subCategory': req.body.subCategory,
            'marketSize': req.body.marketSize,
            'marketRdExpense': req.body.marketRdExpense
        },
        'financialratio':{
            '2015':{
                'peratio': req.body.pe2015,
                'currentratio': req.body.currentRatio2015,
                'quickratio': req.body.quickRatio2015,
                'assetturnover': req.body.assetTurnover2015,
                'grossmargin': req.body.grossMargin2015,
                'operatingmargin': req.body.operatingMargin2015,
                'netmargin': req.body.netMargin2015
            },
            '2016':{
                'peratio': req.body.pe2016,
                'currentratio': req.body.currentRatio2016,
                'quickratio': req.body.quickRatio2016,
                'assetturnover': req.body.assetTurnover2016,
                'grossmargin': req.body.grossMargin2016,
                'operatingmargin': req.body.operatingMargin2016,
                'netmargin': req.body.netMargin2016
            },
            '2017':{
                'peratio': req.body.pe2017,
                'currentratio': req.body.currentRatio2017,
                'quickratio': req.body.quickRatio2017,
                'assetturnover': req.body.assetTurnover2017,
                'grossmargin': req.body.grossMargin2017,
                'operatingmargin': req.body.operatingMargin2017,
                'netmargin': req.body.netMargin2017
            }
        }
    }

    var userName = req.session.user.userName;
    var userEmail = req.session.user.email;

    // TODO
    if(SaveFinancialAnalysis(request, userName, userEmail)){
        res.redirect("/taxcredit");
    }
    else{
        res.render("financialanalysis",
            {errorMessage: "errorMessage", viewModel: request}
        );
    }
})

// POST method for tax credit form to be developed

app.post('/post_taxcredit', function (req, res) {

    var request = {
        "gsthstIssue":req.body.gsthstIssue,
        "employeeTaxIssue":req.body.employeeTaxIssue,
        "transferPricingTaxIssue":req.body.transferPricingTaxIssue
    };

    var userName = req.session.user.userName;
    var userEmail = req.session.user.email;

    // TODO
    if(SaveTaxCredit(request, userName, userEmail)){
        res.redirect("/taxexpense");
    }
    else{
        res.render("taxcredit",
            {errorMessage: "errorMessage", viewModel: request}
        );
    }
})

//*** POST methods end */

//*****************************************************/

// setup custom 404 page
app.use((req,res) => {
    res.status(404).send("Cannot find the page!!!");
});
  
// setup http server to listen on HTTP_PORT
dataServiceAuth.initialize()
.then(function(){
app.listen(HTTP_PORT, function(){
    console.log("app listening on: " + HTTP_PORT)
});
}).catch(function(err){
    console.log("unable to start server: " + err);
});
  