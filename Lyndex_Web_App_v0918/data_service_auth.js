/*********************************************************************************
* User data authentication with mongoDB database JavaScript file
*
* Developed by Steven Wang
*
* Version: 1.0.0
*
* Date: Sep.20.2018
*
********************************************************************************/ 
const bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//*** Define to MongoDB collections ********************************************/
// client collection 
var clientSchema = new Schema({					
	cli_loginName: {"type": String, "unique": true},		
	cli_password : String,		
	cli_userLinkedInURL: String,
	cli_companyName: String,	
	cli_engineeringHeadcount: String,
	cli_informationTechHeadcount: String,
	cli_specialities: String,
	cli_salesHeadcount: String,
	cli_progProjManagementHeadcount: String,
	cli_LinkedInProfile: {cli_website:String,
                        cli_headquarters:String,
                        cli_yearFounded:Number,
                        cli_companyType:String,
                        cli_companySize:String},
	cli_officeLocation: {cli_address_line1: String, 
                        cli_address_line2: String,
                        cli_city: String, 
                        cli_province: String, 
                        cli_country: String, 
                        cli_phone: String, 
                        cli_fax: String, 
                        cli_email: String}
    },
    {collection:"client"}
);

// publicFinancial collection
var publicFinancialSchema = new Schema({
    cli_loginName:{"type": String, "unique": true},
    puf_3FiscalYears:[{puf_FiscalYear: Number,
               puf_incomeStatment3: [{ins_sales: Number,
                                    ins_workingCapital: Number,
                                    ins_profitLoss: Number, 
                                    ins_operatingProfit: Number,
                                    ins_incomeTax: Number, 
                                    ins_COGS: Number,
                                    ins_depreciationAmortization: Number, 
                                    ins_SGAexpense: Number, 
                                    ins_otherSGAexpense: Number, 
                                    ins_EBIT: Number}],
               puf_balanceSheet: [{bas_propertyPlantEquip: Number, 
                                bas_constructInProgress: Number,
                                bas_computerSoftwareEquip: Number, 
                                bas_otherPPE: Number,
                                bas_accummulatedDepreciation: Number, 
                                bas_intangibleAsset: Number}],
               puf_cashFlow: [{caf_deferredTax: Number,
                                caf_investmentTaxCredit: Number, 
                                caf_capitalExpenditure: Number}],	
               puf_financialRatio: [{fir_PEratio: Number, 
                                fir_currentRatio: Number, 
                                fir_quitckRatio: Number,
                                fir_assetTurnover: Number, 
                                fir_grossMargin: Number, 
                                fir_operatingMargin: Number,
                                fir_netMargin: Number}]
    }],
    puf_5FiscalYears:[{puf_FiscalYear: Number,	
                      puf_incomeStatment5: [{ins_researchDevelopment: Number,
                                            ins_RDexpenditure: Number,}]
                    }]
    },
    {collection:"publicFinancial"}
);

// companyTaxInfo collection
var companyTaxInfoSchema = new Schema({
    cli_loginName:{"type": String, "unique": true}, 
    cti_currentSalaryWages:Number, 
    cti_currentContractExpense:Number, 
    cti_currentCapitalExpenditure:Number, 
    cti_GSThstTaxIssues: String, 
    cti_employeeTaxIssue: String,
    cti_transferPricingTaxIssue: String, 
    cti_otherTaxIssue: String,
    cti_3FiscalYears:[ {cti_FiscalYear: Number,
                        cti_companyTaxInfo3: {  cti_gstHST: Number, 
                                            cti_investmentTaxCredit: Number, 
                                            cti_SREDtaxCredit: Number, 
                                            cti_salaryWages: Number, 
                                            cti_costMaterial: Number, 
                                            cti_contractExpense: Number, 
                                            cti_leaseExpenditure: Number, 
                                            cti_capitalExpenditure: Number, 
                                            cti_overhead: Number}},
                        /*{cti_FiscalYear: Number,
                         cti_companyTaxInfo3: {  cti_gstHST: Number, 
                                            cti_investmentTaxCredit: Number, 
                                            cti_SREDtaxCredit: Number, 
                                            cti_salaryWages: Number, 
                                            cti_costMaterial: Number, 
                                            cti_contractExpense: Number, 
                                            cti_leaseExpenditure: Number, 
                                            cti_capitalExpenditure: Number, 
                                            cti_overhead: Number}},
                        {cti_FiscalYear: Number,
                         cti_companyTaxInfo3: {cti_gstHST: Number, 
                                                cti_investmentTaxCredit: Number, 
                                                cti_SREDtaxCredit: Number,
                                                cti_salaryWages: Number, 
                                                cti_costMaterial: Number, 
                                                cti_contractExpense: Number, 
                                                cti_leaseExpenditure: Number, 
                                                cti_capitalExpenditure: Number, 
                                                cti_overhead: Number}}*/
                     ]
},
    {collection:"companyTaxInfo"}
);

// industryBenchmark collection
var industryBenchmarkSchema = new Schema({			
	cli_loginName:{"type": String, "unique": true},		
	inb_industry: String,		
	inb_subClassification: String,		
	inb_mainListedCompany: String,		
	inb_marketSizeBillion: Number,		
	inb_RDexpense: Number,
	inb_3FiscalYears:[ {inb_3FYear: Number,
                        inb_industryBenchmark3: {inb_canadianRDexpenditure: Number,
                                                inb_SREDtaxCredit: Number,
                                                inb_industrySize: Number,
                                                inb_RDexpense: Number}},
			            /*{inb_3FYear: Number,
                        inb_industryBenchmark3: {inb_canadianRDexpenditure: Number,
                                                inb_SREDtaxCredit: Number,
                                                inb_industrySize: Number,
                                                inb_RDexpense: Number}},
			            {inb_3FYear: Number,
                        inb_industryBenchmark3: {inb_canadianRDexpenditure: Number,
                                                inb_SREDtaxCredit: Number,
                                                inb_industrySize: Number,
                                                inb_RDexpense: Number}
                        }*/],
	inb_5FiscalYears:[ {inb_5FYear: Number,
			            inb_industryBenchmark5: {inb_marketSize: Number},
			            /*inb_5FYear: Number,
			            inb_industryBenchmark5: {inb_marketSize: Number},
			            inb_5FYear: Number,
			            inb_industryBenchmark5: {inb_marketSize: Number},
			            inb_5FYear: Number,
			            inb_industryBenchmark5: {inb_marketSize: Number},
		                inb_5FYear: Number,
			            inb_industryBenchmark5: {inb_marketSize: Number}*/	
			        }]
},
    {collection:"industryBenchmark"}
);
//*** Define to MongoDB collections done ****************************************/

// to be defined on new connection model method
let Client, PublicFinancial, CompanyTaxInfo, IndustryBenchmark;

// set up new connection to mongoDB
module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection("mongodb+srv://Lyndex:Lyndex09@cluster0-ldnj9.mongodb.net/dblyndex?retryWrites=true");
        db.on("error", (err) => {
            reject(err);
        });
        db.once("open", () => {
            Client = db.model("Client", clientSchema);
            PublicFinancial = db.model("PublicFinancial", publicFinancialSchema);
            CompanyTaxInfo = db.model("CompanyTaxInfo", companyTaxInfoSchema);
            IndustryBenchmark = db.model("IndustryBenchmark", industryBenchmarkSchema);
            resolve();
        });
    });
};

//*** user authentication functions ***********************************/
// register user
module.exports.registerUser = (userData) => {

    return new Promise( (resolve, reject) => {
        if (userData.cli_password != userData.Password2) {
            reject("Passwords do not match");
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(userData.cli_password, salt, (err, hash) => {
                    if (err) {
                        reject("There was an error encrypting the password");
                    } else {
                        userData.password = hash;
                        let newClient = new Client(userData);
                        newClient.save((err) => {
                            if (err && err.code == 11000) {
                                reject( "User Name already taken");
                            } else if (err && err.code != 11000) {
                                reject("There was an error creating the user: " + err);
                            } else {
                            resolve();
                            }
                        });
                        let newCompanyTaxInfo = new CompanyTaxInfo(userData);
                        newCompanyTaxInfo.save((err) => {
                            if (err) {
                                reject("There was an error creating the user: " + err);
                            } else {
                                resolve();
                            }
                        });
                        let newPublicFinancial = new PublicFinancial(userData);
                        newPublicFinancial.save((err) => {
                            if (err) {
                                reject("There was an error creating the user: " + err);
                            } else {
                                resolve();
                            }
                        });
                    }
                });
            });
        }
    });
}; 

// check user login credentials 
module.exports.checkUser = (userData) => {
    return new Promise((resolve, reject) => {
        Client.find({cli_loginName:userData.cli_loginName}) // need to be configured with front end form name attr
        .exec()
        .then((users) => {
            bcrypt.compare(userData.cli_password, users[0].cli_password).then((res) => {
                res=true;
                if (users.length == 0) {
                    reject("Unable to find user: " + userData.cli_loginName);
                } else if (res === false) {
                    reject("Incorrect Password for User: " + userData.cli_loginName);
                } else {
                    resolve(users[0]);
                }
            });
        })
        .catch((err) => {
            reject("Unable to find user: " + userData.cli_loginName);
        });
    });
};
//*** user authentication functions done *********************************/

//*** data query functions **********************************************/

module.exports.getclientData = (userName) => {
    Client.find({cli_loginName:userName})
    .exec()
    .then((user) => {
        resolve();
    })
    .catch((err) => {
        reject("Error in getting client data" + err);
    });
};

module.exports.getPublicFinancialData = (userName) => {
    PublicFinancial.find({cli_loginName:userName})
    .exec()
    .then((user) => {
        resolve();
    })
    .catch((err) => {
        reject("Error in getting public financial data" + err);
    });
};

module.exports.getCompanyTaxInfoData = (userName) => {
    CompanyTaxInfo.find({cli_loginName:userName})
    .exec()
    .then((user) => {
        resolve();
    })
    .catch((err) => {
        reject("Error in getting company tax info data" + err);
    });
};

module.exports.getIndustryBenchmarkData = (userIndustry) => {
    IndustryBenchmark.find({inb_industry:userIndustry})
    .exec()
    .then((user) => {
        resolve();
    })
    .catch((err) => {
        reject("Error in getting client data" + err);
    });
};

module.exports.updateClientData = (userName, data) => {
    Client.findOneAndUpdate({cli_loginName:userName},
        {$set:{"cli_companyName": data.companyName, 
        "cli_officeLocation.cli_city":data.companyLocation,
	    "cli_LinkedInProfile.cli_companyType":data.companyType
        }},
        {new:true}).
        exec().then((res) => {
        resolve();
    });    
};

module.exports.updatePublicFinancialData_companyInfo = (userName, data) => {
    let date = new Date();
    let year = date.getFullYear();
    PublicFinancial.findOneAndUpdate({cli_loginName:userName},
        {$set:{"puf_3FiscalYears.0.puf_FiscalYear":year-1,
        "puf_3FiscalYears.1.puf_FiscalYear":year-2,
        "puf_3FiscalYears.2.puf_FiscalYear":year-3}},
        {new:true})
        .exec().then((res) => {
            resolve();
        }); 
    PublicFinancial.findOneAndUpdate({"cli_loginName":userName,"puf_3FiscalYears.puf_FiscalYear": year-1},
        {$set:{"puf_3FiscalYears.$.puf_incomeStatment3.0.ins_sales":data.sales2017,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_workingCapital":data.workingCapital2017,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_profitLoss":data.profit2017,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_operatingProfit":data.operatingProfit2017,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_incomeTax":data.incomeTax2017,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_COGS":data.cogs2017,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_depreciationAmortization":data.rd2017,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_propertyPlantEquip":data.ppe2017,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_constructInProgressp":data.construction2017,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_computerSoftwareEquip":data.cse2017,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_otherPPE":data.otherPpe2017,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_accummulatedDepreciation":data.accumDep2017,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_intangibleAsset":data.intangibleAssets2017,
        "puf_3FiscalYears.$.puf_cashFlow.0.caf_deferredTax":data.defferredTax2017,
        "puf_3FiscalYears.$.puf_cashFlow.0.caf_investmentTaxCredit":data.investmentTaxCredits2017,
        "puf_3FiscalYears.$.puf_cashFlow.0.caf_capitalExpenditure":data.creditExpenditure2017
        }},
        {new:true})
        .exec().then((res) => {
        resolve();
    }); 
    PublicFinancial.findOneAndUpdate({"cli_loginName":userName,"puf_3FiscalYears.puf_FiscalYear": year-2},
        {$set:{"puf_3FiscalYears.$.puf_incomeStatment3.1.ins_sales":data.sales2016,
        "puf_3FiscalYears.$.puf_incomeStatment3.1.ins_workingCapital":data.workingCapital2016,
        "puf_3FiscalYears.$.puf_incomeStatment3.1.ins_profitLoss":data.profit2016,
        "puf_3FiscalYears.$.puf_incomeStatment3.1.ins_operatingProfit":data.operatingProfit2016,
        "puf_3FiscalYears.$.puf_incomeStatment3.1.ins_incomeTax":data.incomeTax2016,
        "puf_3FiscalYears.$.puf_incomeStatment3.1.ins_COGS":data.cogs2016,
        "puf_3FiscalYears.$.puf_incomeStatment3.1.ins_depreciationAmortization":data.rd2016,
        "puf_3FiscalYears.$.puf_balanceSheet.1.bas_propertyPlantEquip":data.ppe2016,
        "puf_3FiscalYears.$.puf_balanceSheet.1.bas_constructInProgressp":data.construction2016,
        "puf_3FiscalYears.$.puf_balanceSheet.1.bas_computerSoftwareEquip":data.cse2016,
        "puf_3FiscalYears.$.puf_balanceSheet.1.bas_otherPPE":data.otherPpe2016,
        "puf_3FiscalYears.$.puf_balanceSheet.1.bas_accummulatedDepreciation":data.accumDep2016,
        "puf_3FiscalYears.$.puf_balanceSheet.1.bas_intangibleAsset":data.intangibleAssets2016,
        "puf_3FiscalYears.$.puf_cashFlow.1.caf_deferredTax":data.defferredTax2016,
        "puf_3FiscalYears.$.puf_cashFlow.1.caf_investmentTaxCredit":data.investmentTaxCredits2016,
        "puf_3FiscalYears.$.puf_cashFlow.1.caf_capitalExpenditure":data.creditExpenditure2016
        }},
        {new:true})
        .exec().then((res) => {
        resolve();
    }); 
    PublicFinancial.findOneAndUpdate({"cli_loginName":userName,"puf_3FiscalYears.puf_FiscalYear": year-3},
        {$set:{"puf_3FiscalYears.$.puf_incomeStatment3.2.ins_sales":data.sales2015,
        "puf_3FiscalYears.$.puf_incomeStatment3.2.ins_workingCapital":data.workingCapital2015,
        "puf_3FiscalYears.$.puf_incomeStatment3.2.ins_profitLoss":data.profit2015,
        "puf_3FiscalYears.$.puf_incomeStatment3.2.ins_operatingProfit":data.operatingProfit2015,
        "puf_3FiscalYears.$.puf_incomeStatment3.2.ins_incomeTax":data.incomeTax2015,
        "puf_3FiscalYears.$.puf_incomeStatment3.2.ins_COGS":data.cogs2015,
        "puf_3FiscalYears.$.puf_incomeStatment3.2.ins_depreciationAmortization":data.rd2015,
        "puf_3FiscalYears.$.puf_balanceSheet.2.bas_propertyPlantEquip":data.ppe2015,
        "puf_3FiscalYears.$.puf_balanceSheet.2.bas_constructInProgressp":data.construction2015,
        "puf_3FiscalYears.$.puf_balanceSheet.2.bas_computerSoftwareEquip":data.cse2015,
        "puf_3FiscalYears.$.puf_balanceSheet.2.bas_otherPPE":data.otherPpe2015,
        "puf_3FiscalYears.$.puf_balanceSheet.2.bas_accummulatedDepreciation":data.accumDep2015,
        "puf_3FiscalYears.$.puf_balanceSheet.2.bas_intangibleAsset":data.intangibleAssets2015,
        "puf_3FiscalYears.$.puf_cashFlow.2.caf_deferredTax":data.defferredTax2015,
        "puf_3FiscalYears.$.puf_cashFlow.2.caf_investmentTaxCredit":data.investmentTaxCredits2015,
        "puf_3FiscalYears.$.puf_cashFlow.2.caf_capitalExpenditure":data.creditExpenditure2015
        }},
        {new:true})
        .exec().then((res) => {
        resolve();
    });

};

module.exports.updatePublicFinancialData_financialAnalysis = (userName, data) => {
    let date = new Date();
    let year = date.getFullYear();
    PublicFinancial.findOneAndUpdate({cli_loginName:userName},
        {$set:{"puf_3FiscalYears.0.puf_FiscalYear":year-1,
        "puf_3FiscalYears.1.puf_FiscalYear":year-2,
        "puf_3FiscalYears.2.puf_FiscalYear":year-3}},
        {new:true})
        .exec().then((res) => {
            resolve();
        }); 
    PublicFinancial.findOneAndUpdate({"cli_loginName":userName,"puf_3FiscalYears.puf_FiscalYear": year-1},
        {$set:{"puf_3FiscalYears.$.puf_financialRatio.0.fir_PEratio":data.pe2017,
        "puf_3FiscalYears.$.puf_financialRatio.0.fir_currentRatio":data.currentRatio2017,
        "puf_3FiscalYears.$.puf_financialRatio.0.fir_quitckRatio":data.quickRatio2017,
        "puf_3FiscalYears.$.puf_financialRatio.0.fir_assetTurnover":data.assetTurnover2017,
        "puf_3FiscalYears.$.puf_financialRatio.0.fir_grossMargin":data.grossMargin2017,
        "puf_3FiscalYears.$.puf_financialRatio.0.fir_operatingMargin":data.operatingMargin2017,
        "puf_3FiscalYears.$.puf_financialRatio.0.fir_netMargin":data.netMargin2017
        }},
        {new:true})
        .exec().then((res) => {
        resolve();
    }); 
    PublicFinancial.findOneAndUpdate({"cli_loginName":userName,"puf_3FiscalYears.puf_FiscalYear": year-2},
        {$set:{"puf_3FiscalYears.$.puf_financialRatio.1.fir_PEratio":data.pe2016,
        "puf_3FiscalYears.$.puf_financialRatio.1.fir_currentRatio":data.currentRatio2016,
        "puf_3FiscalYears.$.puf_financialRatio.1.fir_quitckRatio":data.quickRatio2016,
        "puf_3FiscalYears.$.puf_financialRatio.1.fir_assetTurnover":data.assetTurnover2016,
        "puf_3FiscalYears.$.puf_financialRatio.1.fir_grossMargin":data.grossMargin2016,
        "puf_3FiscalYears.$.puf_financialRatio.1.fir_operatingMargin":data.operatingMargin2016,
        "puf_3FiscalYears.$.puf_financialRatio.1.fir_netMargin":data.netMargin2016
        }},
        {new:true})
        .exec().then((res) => {
        resolve();
    }); 
    PublicFinancial.findOneAndUpdate({"cli_loginName":userName,"puf_3FiscalYears.puf_FiscalYear": year-3},
        {$set:{"puf_3FiscalYears.$.puf_financialRatio.2.fir_PEratio":data.pe2015,
        "puf_3FiscalYears.$.puf_financialRatio.2.fir_currentRatio":data.currentRatio2015,
        "puf_3FiscalYears.$.puf_financialRatio.2.fir_quitckRatio":data.quickRatio2015,
        "puf_3FiscalYears.$.puf_financialRatio.2.fir_assetTurnover":data.assetTurnover2015,
        "puf_3FiscalYears.$.puf_financialRatio.2.fir_grossMargin":data.grossMargin2015,
        "puf_3FiscalYears.$.puf_financialRatio.2.fir_operatingMargin":data.operatingMargin2015,
        "puf_3FiscalYears.$.puf_financialRatio.2.fir_netMargin":data.netMargin2015
        }},
        {new:true})
        .exec().then((res) => {
        resolve();
    }); 
};

module.exports.updateCompanyTaxInfoData = (userName, data) => {
    let date = new Date();
    let year = date.getFullYear();
    CompanyTaxInfo.findOneAndUpdate({cli_loginName:userName},
        {$set:{"cti_3FiscalYears.0.cti_FiscalYear":year-1,
        "cti_3FiscalYears.1.cti_FiscalYear":year-2,
        "cti_3FiscalYears.2.cti_FiscalYear":year-3}},
        {new:true})
        .exec().then((res) => {
            resolve();
        }); 
    CompanyTaxInfo.findOneAndUpdate({"cli_loginName":userName,"cti_3FiscalYears.cti_FiscalYear": year-1},
        {$set:{"cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_gstHST":data.GST2017,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_investmentTaxCredit":data.investment2017,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_SREDtaxCredit":data.SRED2017
        }},
        {new:true})
        .exec().then((res) => {
        resolve();
    });  
    CompanyTaxInfo.findOneAndUpdate({"cli_loginName":userName,"cti_3FiscalYears.cti_FiscalYear": year-2},
        {$set:{"cti_3FiscalYears.$.cti_companyTaxInfo3.1.cti_gstHST":data.GST2016,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.1.cti_investmentTaxCredit":data.investment2016,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.1.cti_SREDtaxCredit":data.SRED2016
        }},
        {new:true})
        .exec().then((res) => {
        resolve();
    });  
    CompanyTaxInfo.findOneAndUpdate({"cli_loginName":userName,"cti_3FiscalYears.cti_FiscalYear": year-3},
        {$set:{"cti_3FiscalYears.$.cti_companyTaxInfo3.2.cti_gstHST":data.GST2015,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.2.cti_investmentTaxCredit":data.investment2015,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.2.cti_SREDtaxCredit":data.SRED2015
        }},
        {new:true})
        .exec().then((res) => {
        resolve();
    });  
    CompanyTaxInfo.findOneAndUpdate({"cli_loginName":userName},
    {$set:{"cti_GSThstTaxIssues":data.gstHstIssue, 
    "cti_employeeTaxIssue":data.employeeTaxIssue,
    "cti_transferPricingTaxIssue":data.transferPricingTaxIssue,
    "cti_otherTaxIssue":data.otherTaxIssue
    }},
    {new:true})
    .exec().then((res) =>{
        reslove();
    });
};
    
     
   // CompanyTaxInfo.update({cli_loginName:userName }, {updateData} , function (err, raw) {
     //   console.log(err);
      //  if(!err){
            //  INSERT()
       // }
       // if (err) return handleError(err);
       // console.log('The raw response from Mongo was ', raw);

   // });

