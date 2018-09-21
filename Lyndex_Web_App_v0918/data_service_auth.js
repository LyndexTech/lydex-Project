import { resolve } from "url";

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
                        {cti_FiscalYear: Number,
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
                                                cti_overhead: Number}}
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
			            {inb_3FYear: Number,
                        inb_industryBenchmark3: {inb_canadianRDexpenditure: Number,
                                                inb_SREDtaxCredit: Number,
                                                inb_industrySize: Number,
                                                inb_RDexpense: Number}},
			            {inb_3FYear: Number,
                        inb_industryBenchmark3: {inb_canadianRDexpenditure: Number,
                                                inb_SREDtaxCredit: Number,
                                                inb_industrySize: Number,
                                                inb_RDexpense: Number}
                        }],
	inb_5FiscalYears:[ {inb_5FYear: Number,
			            inb_industryBenchmark5: {inb_marketSize: Number},
			            inb_5FYear: Number,
			            inb_industryBenchmark5: {inb_marketSize: Number},
			            inb_5FYear: Number,
			            inb_industryBenchmark5: {inb_marketSize: Number},
			            inb_5FYear: Number,
			            inb_industryBenchmark5: {inb_marketSize: Number},
		                inb_5FYear: Number,
			            inb_industryBenchmark5: {inb_marketSize: Number}	
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
        if (userData.password != userData.password2) {
            reject("Passwords do not match");
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(userData.password, salt, (err, hash) => {
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
            bcrypt.compare(userData.password, users[0].password).then((res) => {
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

module.exports.updateClientData = (userName, updateData) => {
    Client.findOneAndUpdate({cli_loginName:userName},updateData)
    .exec()
    .then((newData) => {
        resolve();
    })
    .catch((err) => {
        reject("Error in updating client data" + err);
    })
};

module.exports.updatePublicFinancialData = (userName, updateData) => {
    PublicFinancial.findOneAndUpdate({cli_loginName:userName},updateData)
    .exec()
    .then((newData) => {
        resolve();
    })
    .catch((err) => {
        reject("Error in updating public financial data" + err);
    })
};

module.exports.updateCompanyTaxInfoData = (userName, updateData) => {
    CompanyTaxInfo.findOneAndUpdate({cli_loginName:userName},updateData)
    .exec()
    .then((newData) => {
        resolve();
    })
    .catch((err) => {
        reject("Error in updating company tax info data" + err);
    })
};