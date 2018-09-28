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
                           layoutsDir:__dirname + '/views/layouts',
                           partialsDir:__dirname + '/views/partials',
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

    //STEVEN FILE - > DB

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

app.get("/assessment", ensureLogin, (req, res) => {
    res.render("assessment");
});
// setup a route to listen on /companyinfo
app.get("/companyinfo", ensureLogin, (req, res) => {
    // Company info query from database need to be developed

    var userName = req.session.user.email;
    var companyTaxInfoData =dataServiceAuth.getCompanyTaxInfoData(userName);
    var clientData = dataServiceAuth.getCompanyTaxInfoData(userName);

    if(clientData && companyTaxInfoData){
        var companyinfo = {
            'basicInfo': {
                'companyName': clientData.cli_companyName,
                'companyLocation': clientData.cli_officeLocation.cli_province,
                'companyType': clientData.cli_LinkedInProfile.cli_companyType,
                'fiscalYear': '2018'
            },
            'incomeStatement':{
                '2015':{
                    'ins_sales': '',
                    'ins_workingCapital': '',
                    'ins_profitLoss': '',
                    'ins_operatingProfit': '',
                    'ins_incomeTax': '',
                    'ins_COGS': '',
                    'ins_rd': ''
                },
                '2016':{
                    'ins_sales': '',
                    'ins_workingCapital': '',
                    'ins_profitLoss': '',
                    'ins_operatingProfit': '',
                    'ins_incomeTax': '',
                    'ins_COGS': '',
                    'ins_rd': ''
                },
                '2017':{
                    'ins_sales': '',
                    'ins_workingCapital': '',
                    'ins_profitLoss': '',
                    'ins_operatingProfit': '',
                    'ins_incomeTax': '',
                    'ins_COGS': '',
                    'ins_rd': ''
                }
            },
            'balancesheet':{

                '2015':{
                    'bas_propertyPlantEquip': '',
                    'bas_constructInProgress': '',
                    'bas_computerSoftwareEquip': '',
                    'bas_otherPPE': '',
                    'bas_accummulatedDepreciation': '',
                    'bas_intangibleAsset': ''
                },
                '2016':{
                    'bas_propertyPlantEquip': '',
                    'bas_constructInProgress': '',
                    'bas_computerSoftwareEquip': '',
                    'bas_otherPPE': '',
                    'bas_accummulatedDepreciation': '',
                    'bas_intangibleAsset': ''
                },
                '2017':{
                    'bas_propertyPlantEquip': '',
                    'bas_constructInProgress': '',
                    'bas_computerSoftwareEquip': '',
                    'bas_otherPPE': '',
                    'bas_accummulatedDepreciation': '',
                    'bas_intangibleAsset': ''
                }

            },
            'cashflowStatement':{

                '2015':{
                    'caf_deferredTax': '',
                    'caf_investmentTaxCredit': '',
                    'caf_capitalExpenditure':''
                },
                '2016':{
                    'caf_deferredTax': '',
                    'caf_investmentTaxCredit': '',
                    'caf_capitalExpenditure':''
                },
                '2017':{
                    'caf_deferredTax': '',
                    'caf_investmentTaxCredit': '',
                    'caf_capitalExpenditure':''
                }
            }
        }
    }
    res.render('companyinfo', {content: companyinfo});
});

// setup a route to listen on /financialanalysis
app.get("/financialanalysis", ensureLogin, (req, res) => {
    // financial analysis query from database need to be developed
    var financialanlysis = {
        'industryBenchmark': {
            'industry': '',
            'subCategory': '',
            'marketSize': '',
            'marketRdExpense': ''
        },
        'financialratio':{
            '2015':{
                'peratio': '',
                'currentratio': '',
                'quickratio': '',
                'assetturnover': '',
                'grossmargin': '',
                'operatingmargin': '',
                'netmargin': ''
            },
            '2016':{
                'peratio': '',
                'currentratio': '',
                'quickratio': '',
                'assetturnover': '',
                'grossmargin': '',
                'operatingmargin': '',
                'netmargin': ''
            },
            '2017':{
                'peratio': '',
                'currentratio': '',
                'quickratio': '',
                'assetturnover': '',
                'grossmargin': '',
                'operatingmargin': '',
                'netmargin': ''
            }
        }
    };
    res.render('financialanalysis', {content: financialanlysis});
});

// setup a route to listen on /taxcredit
app.get("/taxcredit", ensureLogin, (req, res) => {
    // tax credit query from database need to be developed

       var taxcredit = {
        'IndustryBenchmark':{
            'caRD2017':'',
            'caRD2016':'',
            'caRD2015':'',
            'sredTaxCredits2017':'',
            'sredTaxCredits2016':'',
            'sredTaxCredits2015':'',
            'idustrySize2017':'',
            'idustrySize2016':'',
            'idustrySize2015':'',
            'indRdExpense2017':'',
            'indRdExpense2016':'',
            'indRdExpense2015':'',
        },
        'HistoryTaxCredit':{

            'GST2017':'',
            'GST2016':'',
            'GST2015':'',
            'investment2017':'',
            'investment2016':'',
            'investment2015':'',
            'SRED2017':'',
            'SRED2016':'',
            'SRED2015':''
        },
        'HistoryTaxIssue':{
            'gsthstIssue':'',
            'employeeTaxIssue':'',
            'transferPricingTaxIssue':'',
            'othertransferPricingTaxIssue':''
        }
    };

    res.render("taxcredit",{content:taxcredit});
});

// setup a route to listen on /taxexpense
app.get("/taxexpense", ensureLogin, (req, res) => {
    // tax expense query from database need to be developed

    var taxexpense ={
        'OperatingExpense':{
            'sales2017':'',
            'sales2016':'',
            'sales2015':'',
            'cogs2017':'',
            'cogs2016':'',
            'cogs2015':'',
            'depAmo2017':'',
            'depAmo2016':'',
            'depAmo2015':'',
            'sga2017':'',
            'sga2016':'',
            'sga2015':'',
            'osga2017':'',
            'osga2016':'',
            'osga2015':'',
            'ebit2017':'',
            'ebit2016':'',
            'ebit2015':'',
            'incomeTax2017':'',
            'incomeTax2016':'',
            'incomeTax2015':'',
        },
        'SREDTaxCredit':{
            'salary2017':'',
            'salary2016':'',
            'salary2015':'',
            'cost2017':'',
            'cost2016':'',
            'cost2015':'',
            'con2017':'',
            'con2016':'',
            'con2015':'',
            'lea2017':'',
            'lea2016':'',
            'lea2015':'',
            'over2017':'',
            'over2016':'',
            'over2015':'',
            'cap2017':'',
            'cap2016':'',
            'cap2015':''
        },
        '2018RDExpense':{
            'salarywages':'',
            'contractexpense':'',
            'capitalexpendture':''
        }

    };
    res.render("taxexpense",{content:taxexpense});
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
      res.redirect("/assessment");
     })
    .catch((err) => {
      res.render("signin", {errorMessage: err, cli_loginName: req.body.cli_loginName});
    });
});

// POST method for company info form to be developed

app.post('/post_companyinfo', function (req, res) {
/*
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
*/
    var request = req.body;  
    var userName = req.session.user.cli_loginName;
    console.log(userName);

    if(SaveCompanyInfo(userName, request)){
        res.redirect("/financialanalysis");
    }
    else{
        res.render("companyinfo",
            {errorMessage: "errorMessage", viewModel: request}
        );
    }
})

function SaveCompanyInfo(userName,request){
    //TODO format the data
    console.log(request);
    dataServiceAuth.updateClientData(userName, request);
    dataServiceAuth.updatePublicFinancialData_companyInfo(userName, request);
    return true;
}

// POST method for financial analysis form to be developed

app.post('/post_financialanlysis', function (req, res) {
/*
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
*/
    var userName = req.session.user.cli_loginName;
    var request = req.body;
    console.log(request);
    // TODO
    if(SaveFinancialAnalysis(userName, request)){
        res.redirect("/taxcredit");
    }
    else{
        res.render("financialanalysis",
            {errorMessage: "errorMessage", viewModel: request}
        );
    }
})

function SaveFinancialAnalysis(userName, request){
    //TODO format the data
    dataServiceAuth.updatePublicFinancialData_financialAnalysis(userName,request);
    return true;
}

// POST method for tax credit form to be developed

app.post('/post_taxcredit', function (req, res) {

// [financial_radio] should can be parsed as json data, listing all three years records
 /*   var request = {
        'Industry Benchmark':{
            'caRD2017':req.body.caRD2017,
            'caRD2016':req.body.caRD2016,
            'caRD2015':req.body.caRD2015,
            'sredTaxCredits2017':req.body.sredTaxCredits2017,
            'sredTaxCredits2016':req.body.sredTaxCredits2016,
            'sredTaxCredits2015':req.body.sredTaxCredits2015,
            'idustrySize2017':req.body.idustrySize2017,
            'idustrySize2016':req.body.idustrySize2016,
            'idustrySize2015':req.body.idustrySize2015,
            'indRdExpense2017':req.body.indRdExpense2017,
            'indRdExpense2016':req.body.indRdExpense2016,
            'indRdExpense2015':req.body.indRdExpense2015,
        },
        'HistoryTaxCredit':{

            'GST2017':req.body.GST2017,
            'GST2016':req.body.GST2016,
            'GST2015':req.body.GST2015,
            'investment2017':req.body.investment2017,
            'investment2016':req.body.investment2016,
            'investment2015':req.body.investment2015,
            'SRED2017':req.body.SRED2017,
            'SRED2016':req.body.SRED2016,
            'SRED2015':req.body.SRED2015
        },
        'HistoryTaxIssue':{
            'gsthstIssue':req.body.gsthstIssue,
            'employeeTaxIssue':req.body.employeeTaxIssue,
            'transferPricingTaxIssue':req.body.transferPricingTaxIssue,
            'othertransferPricingTaxIssue':req.body.othertransferPricingTaxIssue
        }
    };
*/
    var userName = req.session.user.cli_loginName;
    var request = req.body;
    // TODO
    if(SaveTaxCredit(userName, request)){
        res.redirect("/taxexpense");
    }
    else{
        res.render("taxcredit",
            {errorMessage: "errorMessage", viewModel: request}
        );
    }
})


// POST method for tax expense form to be developed

function SaveTaxCredit(userName,request){
    //TODO format the data
    dataServiceAuth.updateCompanyTaxInfoData(userName,request);
    return true;
}


app.post('/post_taxexpense', function (req, res) {
/*
    var req ={
        'OperatingExpense':{
            'sales2017':req.body.sales2017,
            'sales2016':req.body.sales2016,
            'sales2015':req.body.sales2015,
            'cogs2017':req.body.cogs2017,
            'cogs2016':req.body.cogs2016,
            'cogs2015':req.body.cogs2015,
            'depAmo2017':req.body.depAmo2017,
            'depAmo2016':req.body.depAmo2016,
            'depAmo2015':req.body.depAmo2015,
            'sga2017':req.body.sga2017,
            'sga2016':req.body.sga2016,
            'sga2015':req.body.sga2015,
            'osga2017':req.body.osga2017,
            'osga2016':req.body.osga2016,
            'osga2015':req.body.osga2015,
            'ebit2017':req.body.ebit2017,
            'ebit2016':req.body.ebit2016,
            'ebit2015':req.body.ebit2015,
            'incomeTax2017':req.body.incomeTax2017,
            'incomeTax2016':req.body.incomeTax2016,
            'incomeTax2015':req.body.incomeTax2015,
        },
        'SREDTaxCredit':{
            'salary2017':req.body.salary2017,
            'salary2016':req.body.salary2016,
            'salary2015':req.body.salary2015,
            'cost2017':req.body.cost2017,
            'cost2016':req.body.cost2016,
            'cost2015':req.body.cost2015,
            'con2017':req.body.con2017,
            'con2016':req.body.con2016,
            'con2015':req.body.con2015,
            'lea2017':req.body.lea2017,
            'lea2016':req.body.lea2016,
            'lea2015':req.body.lea2015,
            'over2017':req.body.over2017,
            'over2016':req.body.over2016,
            'over2015':req.body.over2015,
            'cap2017':req.body.cap2017,
            'cap2016':req.body.cap2016,
            'cap2015':req.body.cap2015
        },
        '2018RDExpense':{
            'salarywages':req.body.salarywages,
            'contractexpense':req.body.contractexpense,
            'capitalexpendture':req.body.capitalexpendture
        }

    };
*/
    var userName = req.session.user.cli_loginName;
    var request = req.body;

    // TODO
    if(SaveTaxExpense(userName, request)){
        res.redirect("/product");
    }
    else{
        res.render("taxcredit",
            {errorMessage: "errorMessage", viewModel: request}
        );
    }

    function SaveTaxExpense(userName,request){
        //TODO format the data
        dataServiceAuth.updateTaxExpense(userName,request);
        return true;
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
  