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
  duration: 20*60*1000,
  activeDuration: 10*60*1000
}));
app.use(function(req, res, next) {
  res.locals.session = req.session;
 next();
 });

 // user upload functions middleware
const storage = multer.diskStorage({
    destination: "./public/files/uploaded/",
    filename: function (req, file, cb) {
      //cb(null, Date.now() + path.extname(file.originalname));
      cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
app.post("/assessment/upload", upload.array("files", 12), (req, res) => {
    res.redirect("/assessment");
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
    fs.readdir("./public/files/uploaded", function(err, items) {
        res.render("assessment", {files:items});
      });
});

app.get("/upload", ensureLogin, (req, res) => {
    res.render("upload");
});

app.get("/report", ensureLogin, (req, res) => {
    res.render("report");
});

// setup a route to listen on /companyinfo

function objectToJson(object){
    var str = JSON.stringify(object);
    var js = JSON.parse(str);
    return js;
}

app.get("/companyinfo", (req, res) => {
    // Company info query from database need to be developed

    var userName = req.session.user.cli_loginName;
    //var userName="User1";
    dataServiceAuth.getclientData(userName).then((clientData) => {

        var companyTaxInfoData =dataServiceAuth.getPublicFinancialData(userName).then((info) => {

            if(!info) res.render('companyinfo');

            var info15 = info.puf_3FiscalYears[0].puf_incomeStatment3[0];
            var info16 = info.puf_3FiscalYears[1].puf_incomeStatment3[0];
            var info17 = info.puf_3FiscalYears[2].puf_incomeStatment3[0];

            var bs15=info.puf_3FiscalYears[0].puf_balanceSheet[0];
            var bs16=info.puf_3FiscalYears[1].puf_balanceSheet[0];
            var bs17=info.puf_3FiscalYears[2].puf_balanceSheet[0];

            var caf15 = info.puf_3FiscalYears[0].puf_cashFlow[0];
            var caf16 = info.puf_3FiscalYears[1].puf_cashFlow[0];
            var caf17 = info.puf_3FiscalYears[2].puf_cashFlow[0];

            console.log(caf15);
            console.log(caf15.caf_deferredTax);

            // var info16 = objectToJson(info.puf_3FiscalYears[1].puf_incomeStatment3[0])['0'];
            // var info17 = objectToJson(info.puf_3FiscalYears[2].puf_incomeStatment3[0])['0'];
            // var info15b = objectToJson(info.puf_3FiscalYears[2].puf_incomeStatment3[0])['2'];

            // var bs17=objectToJson(info.puf_3FiscalYears[0].puf_balanceSheet[0])['0'];
            // var bs16=objectToJson(info.puf_3FiscalYears[1].puf_balanceSheet[0])['0'];
            // var bs15=objectToJson(info.puf_3FiscalYears[2].puf_balanceSheet[0])['0'];
            //
            // var caf17 = objectToJson(info.puf_3FiscalYears[0].puf_cashFlow[0])['0'];
            // var caf16 = objectToJson(info.puf_3FiscalYears[1].puf_cashFlow[0])['0'];
            // var caf15 = objectToJson(info.puf_3FiscalYears[2].puf_cashFlow[0])['0'];

            var companyinfo = {
                'basicInfo': {
                    'companyName': clientData.cli_companyName,
                    'companyLocation': clientData.cli_officeLocation.cli_city,
                    'companyType': clientData.cli_LinkedInProfile.cli_companyType,
                    'fiscalYear': '2018'
                },
                'incomeStatement': {
                    '2015': {
                        'ins_sales': info15.ins_sales,
                        'ins_workingCapital': caf15.caf_changesWorkingCapital,
                        'ins_grossProfitIncome': info15.ins_grossProfitIncome,
                        'ins_accumulatedDepreciation': info15.ins_depreciationAmortization,
                        'ins_incomeTax': info15.ins_incomeTax,
                        'ins_COGS': info15.ins_COGS,
                        'ins_netIncome': info15.ins_netIncome
                    },
                    '2016': {
                        'ins_sales': info16.ins_sales,
                        'ins_workingCapital': caf16.caf_changesWorkingCapital,
                        'ins_grossProfitIncome': info16.ins_grossProfitIncome,
                        'ins_accumulatedDepreciation': info16.ins_depreciationAmortization,
                        'ins_incomeTax': info16.ins_incomeTax,
                        'ins_COGS': info16.ins_COGS,
                        'ins_netIncome': info16.ins_netIncome
                    },
                    '2017': {
                        'ins_sales': info17.ins_sales,
                        'ins_workingCapital': caf17.caf_changesWorkingCapital,
                        'ins_grossProfitIncome': info17.ins_grossProfitIncome,
                        'ins_accumulatedDepreciation': info17.ins_depreciationAmortization,
                        'ins_incomeTax': info17.ins_incomeTax,
                        'ins_COGS': info17.ins_COGS,
                        'ins_netIncome': info17.ins_netIncome
                    },
                },
                'balancesheet': {
                    '2015': {
                        'bas_propertyPlantEquip': bs15.bas_propertyPlantEquip,
                        'bas_constructInProgress': '',
                        'bas_computerSoftwareEquip': bs15.bas_computerSoftwareEquip,
                        'bas_otherPPE': bs15.bas_otherPPE,
                        'bas_accummulatedDepreciation': bs15.bas_accummulatedDepreciation,
                        'bas_intangibleAsset': bs15.bas_intangibleAsset
                    },
                    '2016': {
                        'bas_propertyPlantEquip': bs16.bas_propertyPlantEquip,
                        'bas_constructInProgress': '',
                        'bas_computerSoftwareEquip': bs16.bas_computerSoftwareEquip,
                        'bas_otherPPE': bs16.bas_otherPPE,
                        'bas_accummulatedDepreciation': bs16.bas_accummulatedDepreciation,
                        'bas_intangibleAsset': bs16.bas_intangibleAsset
                    },
                    '2017': {
                        'bas_propertyPlantEquip': bs17.bas_propertyPlantEquip,
                        'bas_constructInProgress': '',
                        'bas_computerSoftwareEquip': bs17.bas_computerSoftwareEquip,
                        'bas_otherPPE': bs17.bas_otherPPE,
                        'bas_accummulatedDepreciation': bs17.bas_accummulatedDepreciation,
                        'bas_intangibleAsset': bs17.bas_intangibleAsset
                    }
                },
                'cashflowStatement': {
                    '2015': {
                        'caf_deferredTax': caf15.caf_deferredTax,
                        'caf_investmentTaxCredit': caf15.caf_changesWorkingCapital,
                        'caf_capitalExpenditure': caf15.caf_capitalExpenditure
                    },
                    '2016': {
                        'caf_deferredTax': caf16.caf_deferredTax,
                        'caf_investmentTaxCredit': caf16.caf_changesWorkingCapital,
                        'caf_capitalExpenditure': caf16.caf_capitalExpenditure
                    },
                    '2017': {
                        'caf_deferredTax': caf17.caf_deferredTax,
                        'caf_investmentTaxCredit': caf17.caf_changesWorkingCapital,
                        'caf_capitalExpenditure': caf17.caf_capitalExpenditure
                    }
                }
            };

            res.render('companyinfo',{content:companyinfo});
        });

    });
});

// setup a route to listen on /financialanalysis
app.get("/financialanalysis", ensureLogin, (req, res) => {
    // financial analysis query from database need to be developed

    var userName = req.session.user.cli_loginName;
    //var userName="User1";
    dataServiceAuth.getPublicFinancialData(userName).then((info) => {
        dataServiceAuth.getIndustryBenchmarkData(userName).then((bm) => {

            var puf15 = info.puf_3FiscalYears[0].puf_financialRatio[0];
            var puf16 = info.puf_3FiscalYears[1].puf_financialRatio[0];
            var puf17 = info.puf_3FiscalYears[2].puf_financialRatio[0];

            var financialanlysis = {
                'industryBenchmark': {
                    'industry': bm.inb_industry,
                    'subCategory': bm.inb_subClassification,
                    'marketSize': bm.inb_marketSizeBillion,
                    'marketRdExpense': bm.inb_RDexpense,
                    'mainListedCompany':bm.inb_mainListedCompany
                },
                'financialratio': {
                    '2015': {
                        'peratio': puf15.fir_PEratio,
                        'currentratio': puf15.fir_currentRatio,
                        'quickratio': puf15.fir_quitckRatio,
                        'assetturnover': puf15.fir_assetTurnover,
                        'grossmargin': puf15.fir_grossMargin,
                        'operatingmargin': puf15.fir_operatingMargin,
                        'netmargin': puf15.fir_netMargin
                    },
                    '2016': {
                        'peratio': puf16.fir_PEratio,
                        'currentratio': puf16.fir_currentRatio,
                        'quickratio': puf16.fir_quitckRatio,
                        'assetturnover': puf16.fir_assetTurnover,
                        'grossmargin': puf16.fir_grossMargin,
                        'operatingmargin': puf16.fir_operatingMargin,
                        'netmargin': puf16.fir_netMargin
                    },
                    '2017': {
                        'peratio': puf17.fir_PEratio,
                        'currentratio': puf17.fir_currentRatio,
                        'quickratio': puf17.fir_quitckRatio,
                        'assetturnover': puf17.fir_assetTurnover,
                        'grossmargin': puf17.fir_grossMargin,
                        'operatingmargin': puf17.fir_operatingMargin,
                        'netmargin': puf17.fir_netMargin
                    }
                }
            };
            res.render('financialanalysis', {content: financialanlysis});
        });
    });
});

// setup a route to listen on /taxcredit
app.get("/taxcredit", ensureLogin, (req, res) => {
    // tax credit query from database need to be developed
    var userName = req.session.user.cli_loginName;
    //var userName="User1";
    dataServiceAuth.getCompanyTaxInfoData(userName).then((info) => {
        dataServiceAuth.getIndustryBenchmarkData(userName).then((bm) => {
            dataServiceAuth.getCompanyTaxInfoData(userName).then((tax) => {

                var bm15 = bm.inb_3FiscalYears[0].inb_industryBenchmark3;
                var bm16 = bm.inb_3FiscalYears[1].inb_industryBenchmark3;
                var bm17 = bm.inb_3FiscalYears[2].inb_industryBenchmark3;

                var tax15 = tax.cti_3FiscalYears[0].cti_companyTaxInfo3;
                var tax16 = tax.cti_3FiscalYears[1].cti_companyTaxInfo3;
                var tax17 = tax.cti_3FiscalYears[2].cti_companyTaxInfo3;

                var taxcredit = {
                    'IndustryBenchmark': {
                        'caRD2017': bm17.inb_canadianRDexpenditure,
                        'caRD2016': bm16.inb_canadianRDexpenditure,
                        'caRD2015': bm15.inb_canadianRDexpenditure,
                        'sredTaxCredits2017': bm17.inb_SREDtaxCredit,
                        'sredTaxCredits2016': bm16.inb_SREDtaxCredit,
                        'sredTaxCredits2015': bm15.inb_SREDtaxCredit,
                        'idustrySize2017': bm17.inb_industrySize,
                        'idustrySize2016': bm16.inb_industrySize,
                        'idustrySize2015': bm15.inb_industrySize,
                        'indRdExpense2017': bm17.inb_RDexpense,
                        'indRdExpense2016': bm16.inb_RDexpense,
                        'indRdExpense2015': bm15.inb_RDexpense,
                    },
                    'HistoryTaxCredit': {

                        'GST2017': tax17.cti_gstHST,
                        'GST2016': tax16.cti_gstHST,
                        'GST2015': tax15.cti_gstHST,
                        'investment2017': tax17.cti_investmentTaxCredit,
                        'investment2016': tax16.cti_investmentTaxCredit,
                        'investment2015': tax15.cti_investmentTaxCredit,
                        'SRED2017': tax17.cti_SREDtaxCredit,
                        'SRED2016': tax16.cti_SREDtaxCredit,
                        'SRED2015': tax15.cti_SREDtaxCredit
                    },
                    'HistoryTaxIssue': {
                        'gsthstIssue': info.cti_GSThstTaxIssues,
                        'employeeTaxIssue': info.cti_employeeTaxIssue,
                        'transferPricingTaxIssue': info.cti_transferPricingTaxIssue,
                        'othertransferPricingTaxIssue': info.cti_otherTaxIssue
                    }
                };
                res.render("taxcredit", {content: taxcredit});
            });
        });
    });
});

// setup a route to listen on /taxexpense
app.get("/taxexpense", ensureLogin, (req, res) => {
    // tax expense query from database need to be developed
    //var userName="User1";
    var userName = req.session.user.cli_loginName;
    dataServiceAuth.getPublicFinancialData(userName).then((info) => {
        dataServiceAuth.getCompanyTaxInfoData(userName).then((tax) => {
            var info15 = info.puf_3FiscalYears[0].puf_incomeStatment3[0];
            var info16 = info.puf_3FiscalYears[1].puf_incomeStatment3[0];
            var info17 = info.puf_3FiscalYears[2].puf_incomeStatment3[0];

            var tax15 = tax.cti_3FiscalYears[0].cti_companyTaxInfo3;
            var tax16 = tax.cti_3FiscalYears[1].cti_companyTaxInfo3;
            var tax17 = tax.cti_3FiscalYears[2].cti_companyTaxInfo3;

            console.log(tax15);
            var taxexpense ={
                'OperatingExpense':{
                    'sales2017':info17.ins_sales,
                    'sales2016':info16.ins_sales,
                    'sales2015':info15.ins_sales,
                    'cogs2017':info17.ins_COGS,
                    'cogs2016':info16.ins_COGS,
                    'cogs2015':info15.ins_COGS,
                    'depAmo2017':info17.ins_depreciationAmortization,
                    'depAmo2016':info16.ins_depreciationAmortization,
                    'depAmo2015':info15.ins_depreciationAmortization,
                    'sga2017':info17.ins_SGAexpense,
                    'sga2016':info16.ins_SGAexpense,
                    'sga2015':info15.ins_SGAexpense,
                    'osga2017':info17.ins_otherSGAexpense,
                    'osga2016':info16.ins_otherSGAexpense,
                    'osga2015':info15.ins_otherSGAexpense,
                    'ebit2017':info17.ins_EBIT,
                    'ebit2016':info16.ins_EBIT,
                    'ebit2015':info15.ins_EBIT,
                    'incomeTax2017':info17.ins_incomeTax,
                    'incomeTax2016':info16.ins_incomeTax,
                    'incomeTax2015':info15.ins_incomeTax
                },
                'SREDTaxCredit':{
                    'salary2017':tax17.cti_salaryWages,
                    'salary2016':tax16.cti_salaryWages,
                    'salary2015':tax15.cti_salaryWages,
                    'cost2017':tax17.cti_costMaterial,
                    'cost2016':tax16.cti_costMaterial,
                    'cost2015':tax15.cti_costMaterial,
                    'con2017':tax17.cti_contractExpense,
                    'con2016':tax16.cti_contractExpense,
                    'con2015':tax15.cti_contractExpense,
                    'lea2017':'',
                    'lea2016':'',
                    'lea2015':'',
                    'over2017':tax17.cti_overhead,
                    'over2016':tax16.cti_overhead,
                    'over2015':tax15.cti_overhead,
                    'cap2017':tax17.cti_capitalExpenditure,
                    'cap2016':tax16.cti_capitalExpenditure,
                    'cap2015':tax15.cti_capitalExpenditure
                },
                '2018RDExpense':{
                    'salarywages':tax.cti_salaryWages,
                    'contractexpense':tax.cti_contractExpense,
                    'capitalexpendture':tax.cti_capitalExpenditure
                }

            };
            res.render("taxexpense",{content:taxexpense});

        });
    });
});
/*
app.get("/companyinfo", ensureLogin, (req, res) => {
    var userName = req.session.user.cli_loginName;
    dataServiceAuth.getPublicFinancialData(userName).then((pubf) => {
        
            res.render("companyinfo",{pubf:pubf});
    
        
    })
});
*/
/*
app.get("/companyinfo", ensureLogin, (req, res) => {
    var userName = req.session.user.cli_loginName;
    dataServiceAuth.getclientData(userName).then((client) => {
        
            res.render("companyinfo",{client:client});
    
        
    })
});
/*
app.get("/companyinfo", ensureLogin, (req, res) => {
    // Company info query from database need to be developed

    var userName = req.session.user.cli_loginName;

    dataServiceAuth.getclientData(userName).then((clientData) => {

        var companyTaxInfoData =dataServiceAuth.getPublicFinancialData(userName).then((info) => {

            var info17 = objectToJson(info.puf_3FiscalYears[0].puf_incomeStatment3[0])['0'];
            var info16 = objectToJson(info.puf_3FiscalYears[1].puf_incomeStatment3[0])['1'];
            //var info15 = objectToJson(info.puf_3FiscalYears[2].puf_incomeStatment3[0])['0'];
            var info15 = objectToJson(info.puf_3FiscalYears[2].puf_incomeStatment3[0])['2'];

            var bs17=objectToJson(info.puf_3FiscalYears[0].puf_balanceSheet[0])['0'];
            var bs16=objectToJson(info.puf_3FiscalYears[1].puf_balanceSheet[0])['1'];
            var bs15=objectToJson(info.puf_3FiscalYears[2].puf_balanceSheet[0])['2'];

            var caf17 = objectToJson(info.puf_3FiscalYears[0].puf_cashFlow[0])['0'];
            var caf16 = objectToJson(info.puf_3FiscalYears[1].puf_cashFlow[0])['1'];
            var caf15 = objectToJson(info.puf_3FiscalYears[2].puf_cashFlow[0])['2'];

            var companyinfo = {
                'basicInfo': {
                    'companyName': clientData.cli_companyName,
                    'companyLocation': clientData.cli_officeLocation.cli_city,
                    'companyType': clientData.cli_LinkedInProfile.cli_companyType,
                    'fiscalYear': '2018'
                },
                'incomeStatement': {
                    '2015': {
                        'ins_sales': info15.ins_sales,
                        'ins_workingCapital': caf15.caf_changesWorkingCapital,
                        'ins_grossProfitIncome': info15.ins_grossProfitIncome,
                        'ins_accumulatedDepreciation': info15.ins_depreciationAmortization,
                        'ins_incomeTax': info15.ins_incomeTax,
                        'ins_COGS': info15.ins_COGS,
                        'ins_netIncome': info15.ins_netIncome
                    },
                    '2016': {
                        'ins_sales': info16.ins_sales,
                        'ins_workingCapital': caf16.caf_changesWorkingCapital,
                        'ins_grossProfitIncome': info16.ins_grossProfitIncome,
                        'ins_accumulatedDepreciation': info16.ins_depreciationAmortization,
                        'ins_incomeTax': info16.ins_incomeTax,
                        'ins_COGS': info16.ins_COGS,
                        'ins_netIncome': info16.ins_netIncome
                    },
                    '2017': {
                        'ins_sales': info17.ins_sales,
                        'ins_workingCapital': caf17.caf_changesWorkingCapital,
                        'ins_grossProfitIncome': info17.ins_grossProfitIncome,
                        'ins_accumulatedDepreciation': info17.ins_depreciationAmortization,
                        'ins_incomeTax': info17.ins_incomeTax,
                        'ins_COGS': info17.ins_COGS,
                        'ins_netIncome': info17.ins_netIncome
                    },
                },
                'balancesheet': {
                    '2015': {
                        'bas_propertyPlantEquip': bs15.bas_propertyPlantEquip,
                        'bas_constructInProgress': bs15.bas_constructInProgress,
                        'bas_computerSoftwareEquip': bs15.bas_computerSoftwareEquip,
                        'bas_otherPPE': bs15.bas_otherPPE,
                        'bas_accummulatedDepreciation': bs15.bas_accummulatedDepreciation,
                        'bas_intangibleAsset': bs15.bas_intangibleAsset
                    },
                    '2016': {
                        'bas_propertyPlantEquip': bs16.bas_propertyPlantEquip,
                        'bas_constructInProgress': bs16.bas_constructInProgress,
                        'bas_computerSoftwareEquip': bs16.bas_computerSoftwareEquip,
                        'bas_otherPPE': bs16.bas_otherPPE,
                        'bas_accummulatedDepreciation': bs16.bas_accummulatedDepreciation,
                        'bas_intangibleAsset': bs16.bas_intangibleAsset
                    },
                    '2017': {
                        'bas_propertyPlantEquip': bs17.bas_propertyPlantEquip,
                        'bas_constructInProgress': bs17.bas_constructInProgress,
                        'bas_computerSoftwareEquip': bs17.bas_computerSoftwareEquip,
                        'bas_otherPPE': bs17.bas_otherPPE,
                        'bas_accummulatedDepreciation': bs17.bas_accummulatedDepreciation,
                        'bas_intangibleAsset': bs17.bas_intangibleAsset
                    }
                },
                'cashflowStatement': {
                    '2015': {
                        'caf_deferredTax': bs15.bas_deferredTax,
                        'caf_investmentTaxCredit': caf15.caf_investmentTaxCredit,
                        'caf_capitalExpenditure': caf15.caf_capitalExpenditure
                    },
                    '2016': {
                        'caf_deferredTax': bs16.bas_deferredTax,
                        'caf_investmentTaxCredit': caf16.caf_investmentTaxCredit,
                        'caf_capitalExpenditure': caf16.caf_capitalExpenditure
                    },
                    '2017': {
                        'caf_deferredTax': bs17.bas_deferredTax,
                        'caf_investmentTaxCredit': caf17.caf_investmentTaxCredit,
                        'caf_capitalExpenditure': caf17.caf_capitalExpenditure
                    }
                }
            };
            res.render('companyinfo',{content: companyinfo});
        });
        
    });
    //res.render('companyinfo');
});
*/
/*
// setup a route to listen on /financialanalysis
app.get("/financialanalysis", ensureLogin, (req, res) => {
    // financial analysis query from database need to be developed

    var userName = req.session.user.cli_loginName;

    dataServiceAuth.getPublicFinancialData(userName).then((info) => {

        var puf17 = objectToJson(info.puf_3FiscalYears[0].puf_financialRatio[0])['0'];
        var puf16 = objectToJson(info.puf_3FiscalYears[1].puf_financialRatio[0])['1'];
        var puf15 = objectToJson(info.puf_3FiscalYears[2].puf_financialRatio[0])['2'];

        var financialanlysis = {
            'industryBenchmark': {
                'industry': '',
                'subCategory': '',
                'marketSize': '',
                'marketRdExpense': ''
            },
            'financialratio':{
                '2015':{
                    'peratio': puf15.fir_PEratio,
                    'currentratio': puf15.fir_currentRatio,
                    'quickratio': puf15.fir_quitckRatio,
                    'assetturnover': puf15.fir_assetTurnover,
                    'grossmargin': puf15.fir_grossMargin,
                    'operatingmargin': puf15.fir_operatingMargin,
                    'netmargin': puf15.fir_netMargin
                },
                '2016':{
                    'peratio': puf16.fir_PEratio,
                    'currentratio': puf16.fir_currentRatio,
                    'quickratio': puf16.fir_quitckRatio,
                    'assetturnover': puf16.fir_assetTurnover,
                    'grossmargin': puf16.fir_grossMargin,
                    'operatingmargin': puf16.fir_operatingMargin,
                    'netmargin': puf16.fir_netMargin
                },
                '2017':{
                    'peratio': puf17.fir_PEratio,
                    'currentratio': puf17.fir_currentRatio,
                    'quickratio': puf17.fir_quitckRatio,
                    'assetturnover': puf17.fir_assetTurnover,
                    'grossmargin': puf17.fir_grossMargin,
                    'operatingmargin': puf17.fir_operatingMargin,
                    'netmargin': puf17.fir_netMargin
                }
            }
        };
        res.render('financialanalysis', {content: financialanlysis});
    });
    res.render('financialanalysis');
});

// setup a route to listen on /taxcredit
app.get("/taxcredit", ensureLogin, (req, res) => {
    // tax credit query from database need to be developed
    
    var userName = req.session.user.cli_loginName;
    
    dataServiceAuth.getCompanyTaxInfoData(userName).then((info) => {

        var puf17 = objectToJson(info.cti_3FiscalYears[0].cti_companyTaxInfo3[0])['0'];
        var puf16 = objectToJson(info.cti_3FiscalYears[1].cti_companyTaxInfo3[0])['1'];
        var puf15 = objectToJson(info.cti_3FiscalYears[2].cti_companyTaxInfo3[0])['2'];

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

                'GST2017':puf17.cti_gstHST,
                'GST2016':puf16.cti_gstHST,
                'GST2015':puf15.cti_gstHST,
                'investment2017':puf17.cti_investmentTaxCredit,
                'investment2016':puf16.cti_investmentTaxCredit,
                'investment2015':puf15.cti_investmentTaxCredit,
                'SRED2017':puf17.cti_SREDtaxCredit,
                'SRED2016':puf16.cti_SREDtaxCredit,
                'SRED2015':puf15.cti_SREDtaxCredit
            },
            'HistoryTaxIssue':{
                'gsthstIssue':info.cti_GSThstTaxIssues,
                'employeeTaxIssue':info.cti_employeeTaxIssue,
                'transferPricingTaxIssue':info.cti_transferPricingTaxIssue,
                'othertransferPricingTaxIssue':info.cti_otherTaxIssue
            }
        };
        res.render("taxcredit",{content:taxcredit});
    });
        res.render("taxcredit");
});

// setup a route to listen on /taxexpense
app.get("/taxexpense", ensureLogin, (req, res) => {
    // tax expense query from database need to be developed

    var userName = req.session.user.cli_loginName;
    dataServiceAuth.getPublicFinancialData(userName).then((info) => {
        dataServiceAuth.getCompanyTaxInfoData(userName).then((tax) => {
            var info17 = objectToJson(info.puf_3FiscalYears[0].puf_incomeStatment3[0])['0'];
            var info16 = objectToJson(info.puf_3FiscalYears[1].puf_incomeStatment3[0])['1'];
            var info15 = objectToJson(info.puf_3FiscalYears[2].puf_incomeStatment3[0])['0'];
            var info15b = objectToJson(info.puf_3FiscalYears[2].puf_incomeStatment3[0])['2'];

            var taxexpense ={
                'OperatingExpense':{
                    'sales2017':info17.ins_sales,
                    'sales2016':info16.ins_sales,
                    'sales2015':info15b.ins_sales,
                    'cogs2017':info17.ins_COGS,
                    'cogs2016':info16.ins_COGS,
                    'cogs2015':info15b.ins_COGS,
                    'depAmo2017':info17.ins_depreciationAmortization,
                    'depAmo2016':info16.ins_depreciationAmortization,
                    'depAmo2015':info15b.ins_depreciationAmortization,
                    'sga2017':info17.ins_SGAexpense,
                    'sga2016':info16.ins_SGAexpense,
                    'sga2015':info15b.ins_SGAexpense,
                    'osga2017':info17.ins_otherSGAexpense,
                    'osga2016':info16.ins_otherSGAexpense,
                    'osga2015':info15b.ins_otherSGAexpense,
                    'ebit2017':info17.ins_EBIT,
                    'ebit2016':info16.ins_EBIT,
                    'ebit2015':info15b.ins_EBIT,
                    'incomeTax2017':info17.ins_incomeTax,
                    'incomeTax2016':info16.ins_incomeTax,
                    'incomeTax2015':info15b.ins_incomeTax
                },
                'SREDTaxCredit':{
                    'salary2017':info17.cti_salaryWages,
                    'salary2016':info16.cti_salaryWages,
                    'salary2015':info15b.cti_salaryWages,
                    'cost2017':info17.cti_costMaterial,
                    'cost2016':info16.cti_costMaterial,
                    'cost2015':info15b.cti_costMaterial,
                    'con2017':info17.cti_contractExpense,
                    'con2016':info16.cti_contractExpense,
                    'con2015':info15b.cti_contractExpense,
                    'lea2017':info17.cti_leaseExpenditure,
                    'lea2016':info16.cti_leaseExpenditure,
                    'lea2015':info15b.cti_leaseExpenditure,
                    'over2017':info17.cti_overhead,
                    'over2016':info16.cti_overhead,
                    'over2015':info15b.cti_overhead,
                    'cap2017':info17.cti_capitalExpenditure,
                    'cap2016':info16.cti_capitalExpenditure,
                    'cap2015':info15b.cti_capitalExpenditure
                },
                '2018RDExpense':{
                    'salarywages':'',
                    'contractexpense':'',
                    'capitalexpendture':''
                }

            };
        });
        res.render("taxexpense",{content:taxexpense});
    });
    res.render("taxexpense");
});
*/
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
      res.render("register", {errorMessage: err, cli_loginName: req.body.cli_loginName});
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
  