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
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

//*** Define to MongoDB collections ********************************************/
// client collection 
var clientSchema = new Schema({					
	cli_loginName: {type: String, unique: true},		
	cli_password : String,		
	cli_userLinkedInURL: String,
	cli_companyName: String,	
	cli_specialities: String,
	cli_employeeHeadcounts: Number,
    cli_employeeInformationTech:Number,
    cli_employeeEngineers:Number,
    cli_employeeSales:Number,
    cli_employeeQualityAssurance:Number,
    cli_employeeResearch:Number,
    cli_employeeOperation:Number,
    cli_employeeCommunitySocialServices:Number,
    cli_employeeHealthcareServices:Number,
	cli_progProjManagementHeadcount: Number,
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
                                    ins_grossProfitIncome:Number,
                                    ins_netIncome:Number,
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
                                bas_intangibleAsset: Number,
                                bas_machineryEquipment:Number,
                                bas_deferredTax:Number}],
               puf_cashFlow: [{ caf_changesWorkingCapital: Number,
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
        if (userData.cli_loginName != userData.cli_loginName2) {
            reject("User names do not match");
        }
        else if (userData.cli_password != userData.cli_password2) {
            reject("Passwords do not match");
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(userData.cli_password, salt, (err, hash) => {
                    if (err) {
                        reject("There was an error encrypting the password");
                    } else {
                        userData.cli_password = hash;
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
                        newCompanyTaxInfo.set({
                            cti_salaryWages:0, 
	                        cti_contractExpense:0, 
	                        cti_capitalExpenditure:0, 
	                        cti_GSThstTaxIssues: "Write a Text here...", 
	                        cti_employeeTaxIssue: "Write a Text here...",
	                        cti_transferPricingTaxIssue: "Write a Text here...", 
	                        cti_otherTaxIssue: "Write a Text here...",
	                        cti_3FiscalYears:[ {cti_FiscalYear: 2015,
                            cti_companyTaxInfo3: {  cti_gstHST: 0, 
                                                cti_investmentTaxCredit: 0, 
                                                cti_SREDtaxCredit: 0, 
                                                cti_salaryWages: 0, 
                                                cti_costMaterial: 0, 
                                                cti_contractExpense: 0, 
                                                cti_leaseExpenditure: 0, 
                                                cti_capitalExpenditure: 0, 
                                                cti_overhead: 0}},
			            {cti_FiscalYear: 2016,
                          cti_companyTaxInfo3: {  cti_gstHST: 0, 
                                                cti_investmentTaxCredit: 0, 
                                                cti_SREDtaxCredit: 0, 
                                                cti_salaryWages: 0, 
                                                cti_costMaterial: 0, 
                                                cti_contractExpense: 0, 
                                                cti_leaseExpenditure: 0, 
                                                cti_capitalExpenditure: 0, 
                                                cti_overhead: 0}},
			            {cti_FiscalYear: 2017,
                              cti_companyTaxInfo3: {cti_gstHST: 0, 
                                                    cti_investmentTaxCredit: 0, 
                                                    cti_SREDtaxCredit: 0,
                                                    cti_salaryWages: 0, 
                                                    cti_costMaterial: 0, 
                                                    cti_contractExpense: 0, 
                                                    cti_leaseExpenditure: 0, 
                                                    cti_capitalExpenditure: 0, 
                                                    cti_overhead: 0}}
                                    ]
                            }

                        );
                        newCompanyTaxInfo.save((err) => {
                            if (err) {
                                reject("There was an error creating the user: " + err);
                            } else {
                                resolve();
                            }
                        });
                        let newPublicFinancial = new PublicFinancial(userData);
                        newPublicFinancial.set({
                            puf_3FiscalYears:[
                                {puf_FiscalYear: 2015,
                                puf_incomeStatment3: [{ins_sales: 0,
                                                     ins_grossProfitIncome:0,
                                                     ins_netIncome:0,
                                                     ins_incomeTax: 0, 
                                                     ins_COGS: 0,
                                                     ins_depreciationAmortization: 0,
                                                     ins_SGAexpense: 0, 
                                                     ins_otherSGAexpense: 0, 
                                                     ins_EBIT: 0}],
                                puf_balanceSheet: [{bas_propertyPlantEquip: 0, 
                                                     bas_constructInProgress: 0,
                                                     bas_computerSoftwareEquip: 0, 
                                                     bas_otherPPE: 0,
                                                     bas_accummulatedDepreciation: 0, 
                                                     bas_intangibleAsset: 0,
                                                     bas_machineryEquipment: 0,
                                                     bas_deferredTax: 0}],
                                puf_cashFlow: [{caf_deferredTax: 0,
                                                 caf_changesWorkingCapital:0,
                                                 caf_capitalExpenditure: 0}],	
                                puf_financialRatio:[{fir_PEratio: 0, 
                                                     fir_currentRatio: 0, 
                                                     fir_quitckRatio: 0,
                                                     fir_assetTurnover: 0, 
                                                     fir_grossMargin: 0, 
                                                     fir_operatingMargin: 0,
                                                     fir_netMargin: 0}],
                                },
                                {puf_FiscalYear: 2016,
                                 puf_incomeStatment3: [{ins_sales: 0,
                                                        ins_grossProfitIncome:0,
                                                        ins_netIncome:0,
                                                        ins_incomeTax: 0, 
                                                        ins_COGS: 0,
                                                        ins_depreciationAmortization: 0,
                                                        ins_SGAexpense: 0, 
                                                        ins_otherSGAexpense: 0, 
                                                        ins_EBIT: 0}],
                                puf_balanceSheet: [{bas_propertyPlantEquip: 0, 
                                                    bas_constructInProgress: 0,
                                                    bas_computerSoftwareEquip: 0, 
                                                    bas_otherPPE: 0,
                                                    bas_accummulatedDepreciation: 0, 
                                                    bas_intangibleAsset: 0,
                                                    bas_machineryEquipment: 0,
                                                    bas_deferredTax: 0}],
                                puf_cashFlow: [{caf_deferredTax: 0,
                                                caf_changesWorkingCapital:0,
                                                caf_capitalExpenditure: 0}],	
                                                puf_financialRatio:[{fir_PEratio: 0, 
                                                fir_currentRatio: 0, 
                                                fir_quitckRatio: 0,
                                                fir_assetTurnover: 0, 
                                                fir_grossMargin: 0, 
                                                fir_operatingMargin: 0,
                                                fir_netMargin: 0},]
                                },
                               {puf_FiscalYear: 2017,
                                 puf_incomeStatment3: [{ins_sales: 0,
                                                        ins_grossProfitIncome:0,
                                                        ins_netIncome:0,
                                                        ins_incomeTax: 0, 
                                                        ins_COGS: 0,
                                                        ins_depreciationAmortization: 0,
                                                        ins_SGAexpense: 0, 
                                                        ins_otherSGAexpense: 0, 
                                                        ins_EBIT: 0}],
                                puf_balanceSheet: [{bas_propertyPlantEquip: 0, 
                                                    bas_constructInProgress: 0,
                                                    bas_computerSoftwareEquip: 0, 
                                                    bas_otherPPE: 0,
                                                    bas_accummulatedDepreciation: 0, 
                                                    bas_intangibleAsset: 0,
                                                    bas_machineryEquipment: 0,
                                                    bas_deferredTax: 0}],
                                puf_cashFlow: [{caf_deferredTax: 0,
                                                caf_changesWorkingCapital:0,
                                                caf_capitalExpenditure: 0}],	
                                                puf_financialRatio:[{fir_PEratio: 0, 
                                                fir_currentRatio: 0, 
                                                fir_quitckRatio: 0,
                                                fir_assetTurnover: 0, 
                                                fir_grossMargin: 0, 
                                                fir_operatingMargin: 0,
                                                fir_netMargin: 0},]                 
                            }],
                            puf_5FiscalYears:[{puf_FiscalYear: 2013,	
                                        puf_incomeStatment5: [{ins_researchDevelopment: 0}]
                                        },
                                        {puf_FiscalYear: 2014,	
                                        puf_incomeStatment5: [{ins_researchDevelopment: 0}]
                                        },
                                        {puf_FiscalYear: 2015,	
                                         puf_incomeStatment5: [{ins_researchDevelopment: 0}]
                                        },
                                        {puf_FiscalYear: 2016,	
                                        puf_incomeStatment5: [{ins_researchDevelopment: 0}]
                                        },
                                        {puf_FiscalYear: 2017,	
                                         puf_incomeStatment5: [{ins_researchDevelopment: 0}]
                                        }
                                        ]	
                        });
                        newPublicFinancial.save((err) => {
                            if (err) {
                                reject("There was an error creating the user: " + err);
                            } else {
                                resolve();
                            }
                        });
                        let newIndustryBenchmark = new IndustryBenchmark(userData)
                        newIndustryBenchmark.set({
                            inb_industry: "Write a Text here...",		
	                        inb_subClassification: "Write a Text here...",		
	                        inb_mainListedCompany: "Write a Text here...",		
	                        inb_marketSizeBillion: 10000,		
	                        inb_RDexpense: 10000,
	                        inb_3FiscalYears:[ {inb_3FYear: 2015,
                            inb_industryBenchmark3: {inb_canadianRDexpenditure: 10000,
                                                inb_SREDtaxCredit: 10000,
                                                inb_industrySize: 10000,
                                                inb_RDexpense: 10000}},
			                                    {inb_3FYear: 2016,
                            inb_industryBenchmark3: {inb_canadianRDexpenditure: 20000,
                                                inb_SREDtaxCredit: 10000,
                                                inb_industrySize: 10000,
                                                inb_RDexpense: 10000}},
			                                    {inb_3FYear: 2017,
                            inb_industryBenchmark3: {inb_canadianRDexpenditure: 30000,
                                                inb_SREDtaxCredit: 10000,
                                                inb_industrySize: 10000,
                                                inb_RDexpense: 10000}
                             }],
	                        inb_5FiscalYears:[ {inb_5FYear: 2013,
			                inb_industryBenchmark5: {inb_marketSize: 12000},
			                    inb_5FYear: 2014,
			                    inb_industryBenchmark5: {inb_marketSize: 13000},
			                     inb_5FYear: 2015,
			                    inb_industryBenchmark5: {inb_marketSize: 14000},
			                    inb_5FYear: 2016,
			                    inb_industryBenchmark5: {inb_marketSize: 15000},
		                        inb_5FYear: 2017,
			                    inb_industryBenchmark5: {inb_marketSize: 16000}	
			                    }]
                        }); 
                        newIndustryBenchmark.save((err) => {
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
    return new Promise((resolve, reject) => {
        Client.find({cli_loginName:userName})
            .exec()
            .then((clients) => {
                console.log("get client:" + clients[0]);
                resolve(clients[0]);
            });
    })
        .catch((err) => {
            reject("Unable to find user: " + userData.cli_loginName);
        });
};

module.exports.getPublicFinancialData = (userName) => {
    return new Promise((resolve, reject) => {
        PublicFinancial.find({cli_loginName:userName})
            .exec()
            .then((info) => {
                console.log("get info:" + info[0])
                resolve(info[0]);
            });
    })
        .catch((err) => {
            reject("Error in getting public financial data" + err);
        });


};

module.exports.getCompanyTaxInfoData = (userName) => {
    return new Promise((resolve, reject) => {
        CompanyTaxInfo.find({cli_loginName:userName})
            .exec()
            .then((info) => {
                resolve(info[0]);
            });
    })
        .catch((err) => {
            reject("Error in getting company tax info data" + err);
        });
};

module.exports.getIndustryBenchmarkData = (userName) => {

    return new Promise((resolve, reject) => {
        IndustryBenchmark.find({cli_loginName: userName})
            .exec()
            .then((info) => {
                resolve(info[0]);
            })
            .catch((err) => {
                reject("Error in getting client data" + err);
            });
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
        {$set:{"puf_3FiscalYears.0.puf_FiscalYear":year-3,
        "puf_3FiscalYears.1.puf_FiscalYear":year-2,
        "puf_3FiscalYears.2.puf_FiscalYear":year-1}},
        {new:true})
        .exec().then((res) => {
            resolve();
        }); 
    PublicFinancial.findOneAndUpdate({"cli_loginName":userName,"puf_3FiscalYears.puf_FiscalYear": year-1},
        {$set:{"puf_3FiscalYears.$.puf_incomeStatment3.0.ins_sales":data.sales2017,
        "puf_3FiscalYears.$.puf_cashFlow.0.caf_changesWorkingCapital":data.workingCapital2017,
       // "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_profitLoss":data.profit2017,
       // "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_operatingProfit":data.operatingProfit2017,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_incomeTax":data.incomeTax2017,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_COGS":data.cogs2017,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_depreciationAmortization":data.acc2017,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_grossProfitIncome":data.grossIncome2017,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_netIncome":data.netIncome2017,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_propertyPlantEquip":data.ppe2017,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_constructInProgress":data.construction2017,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_computerSoftwareEquip":data.cse2017,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_machineryEquipment":data.machinery2017,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_otherPPE":data.otherPpe2017,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_accummulatedDepreciation":data.accumDep2017,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_intangibleAsset":data.intangibleAssets2017,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_deferredTax":data.defferredTax2017,
        "puf_3FiscalYears.$.puf_cashFlow.0.caf_investmentTaxCredit":data.investmentTaxCredits2017,
        "puf_3FiscalYears.$.puf_cashFlow.0.caf_capitalExpenditure":data.creditExpenditure2017
        }},
        {new:true})
        .exec().then((res) => {
        resolve();
    }); 
    PublicFinancial.findOneAndUpdate({"cli_loginName":userName,"puf_3FiscalYears.puf_FiscalYear": year-2},
        {$set:{"puf_3FiscalYears.$.puf_incomeStatment3.0.ins_sales":data.sales2016,
        "puf_3FiscalYears.$.puf_cashFlow.0.caf_changesWorkingCapital":data.workingCapital2016,
        //"puf_3FiscalYears.$.puf_incomeStatment3.1.ins_profitLoss":data.profit2016,
       // "puf_3FiscalYears.$.puf_incomeStatment3.1.ins_operatingProfit":data.operatingProfit2016,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_incomeTax":data.incomeTax2016,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_COGS":data.cogs2016,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_depreciationAmortization":data.acc2016,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_grossProfitIncome":data.grossIncome2016,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_netIncome":data.netIncome2016,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_propertyPlantEquip":data.ppe2016,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_constructInProgress":data.construction2016,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_computerSoftwareEquip":data.cse2016,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_machineryEquipment":data.machinery2016,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_otherPPE":data.otherPpe2016,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_accummulatedDepreciation":data.accumDep2016,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_intangibleAsset":data.intangibleAssets2016,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_deferredTax":data.defferredTax2016,
        "puf_3FiscalYears.$.puf_cashFlow.0.caf_investmentTaxCredit":data.investmentTaxCredits2016,
        "puf_3FiscalYears.$.puf_cashFlow.0.caf_capitalExpenditure":data.creditExpenditure2016
        }},
        {new:true})
        .exec().then((res) => {
        resolve();
    }); 
    PublicFinancial.findOneAndUpdate({"cli_loginName":userName,"puf_3FiscalYears.puf_FiscalYear": year-3},
        {$set:{"puf_3FiscalYears.$.puf_incomeStatment3.0.ins_sales":data.sales2015,
        "puf_3FiscalYears.$.puf_cashFlow.0.caf_changesWorkingCapital":data.workingCapital2015,
        //"puf_3FiscalYears.$.puf_incomeStatment3.2.ins_profitLoss":data.profit2015,
        //"puf_3FiscalYears.$.puf_incomeStatment3.2.ins_operatingProfit":data.operatingProfit2015,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_incomeTax":data.incomeTax2015,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_COGS":data.cogs2015,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_depreciationAmortization":data.acc2015,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_grossProfitIncome":data.grossIncome2015,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_netIncome":data.netIncome2015,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_propertyPlantEquip":data.ppe2015,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_constructInProgress":data.construction2015,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_computerSoftwareEquip":data.cse2015,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_machineryEquipment":data.machinery2015,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_otherPPE":data.otherPpe2015,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_accummulatedDepreciation":data.accumDep2015,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_intangibleAsset":data.intangibleAssets2015,
        "puf_3FiscalYears.$.puf_balanceSheet.0.bas_deferredTax":data.defferredTax2015,
        "puf_3FiscalYears.$.puf_cashFlow.0.caf_investmentTaxCredit":data.investmentTaxCredits2015,
        "puf_3FiscalYears.$.puf_cashFlow.0.caf_capitalExpenditure":data.creditExpenditure2015
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
        {$set:{"puf_3FiscalYears.0.puf_FiscalYear":year-3,
        "puf_3FiscalYears.1.puf_FiscalYear":year-2,
        "puf_3FiscalYears.2.puf_FiscalYear":year-1}},
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
        {$set:{"puf_3FiscalYears.$.puf_financialRatio.0.fir_PEratio":data.pe2016,
        "puf_3FiscalYears.$.puf_financialRatio.0.fir_currentRatio":data.currentRatio2016,
        "puf_3FiscalYears.$.puf_financialRatio.0.fir_quitckRatio":data.quickRatio2016,
        "puf_3FiscalYears.$.puf_financialRatio.0.fir_assetTurnover":data.assetTurnover2016,
        "puf_3FiscalYears.$.puf_financialRatio.0.fir_grossMargin":data.grossMargin2016,
        "puf_3FiscalYears.$.puf_financialRatio.0.fir_operatingMargin":data.operatingMargin2016,
        "puf_3FiscalYears.$.puf_financialRatio.0.fir_netMargin":data.netMargin2016
        }},
        {new:true})
        .exec().then((res) => {
        resolve();
    }); 
    PublicFinancial.findOneAndUpdate({"cli_loginName":userName,"puf_3FiscalYears.puf_FiscalYear": year-3},
        {$set:{"puf_3FiscalYears.$.puf_financialRatio.0.fir_PEratio":data.pe2015,
        "puf_3FiscalYears.$.puf_financialRatio.0.fir_currentRatio":data.currentRatio2015,
        "puf_3FiscalYears.$.puf_financialRatio.0.fir_quitckRatio":data.quickRatio2015,
        "puf_3FiscalYears.$.puf_financialRatio.0.fir_assetTurnover":data.assetTurnover2015,
        "puf_3FiscalYears.$.puf_financialRatio.0.fir_grossMargin":data.grossMargin2015,
        "puf_3FiscalYears.$.puf_financialRatio.0.fir_operatingMargin":data.operatingMargin2015,
        "puf_3FiscalYears.$.puf_financialRatio.0.fir_netMargin":data.netMargin2015
        }},
        {new:true})
        .exec().then((res) => {
        resolve();
    }); 
};

module.exports.updateTaxExpense = (userName, data) => {
    let date = new Date();
    let year = date.getFullYear();
    PublicFinancial.findOneAndUpdate({cli_loginName:userName},
        {$set:{"puf_3FiscalYears.0.puf_FiscalYear":year-3,
        "puf_3FiscalYears.1.puf_FiscalYear":year-2,
        "puf_3FiscalYears.2.puf_FiscalYear":year-1}},
        {new:true})
        .exec().then((res) => {
            resolve();
        }); 
    CompanyTaxInfo.findOneAndUpdate({cli_loginName:userName},
        {$set:{"cti_3FiscalYears.0.cti_FiscalYear":year-3,
        "cti_3FiscalYears.1.cti_FiscalYear":year-2,
        "cti_3FiscalYears.2.cti_FiscalYear":year-1}},
        {new:true})
        .exec().then((res) => {
            resolve();
        }); 
    PublicFinancial.findOneAndUpdate({"cli_loginName":userName,"puf_3FiscalYears.puf_FiscalYear": year-1},
        {$set:{"puf_3FiscalYears.$.puf_incomeStatment3.0.ins_sales":data.sales2017,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_COGS":data.cogs2017,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_depreciationAmortization":data.depAmo2017,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_SGAexpense":data.sga2017,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_otherSGAexpense":data.osga2017,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_EBIT":data.ebit2017,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_incomeTax":data.incomeTax2017
        }},
        {new:true})
        .exec().then((res) => {
        resolve();
    }); 
    PublicFinancial.findOneAndUpdate({"cli_loginName":userName,"puf_3FiscalYears.puf_FiscalYear": year-2},
        {$set:{"puf_3FiscalYears.$.puf_incomeStatment3.0.ins_sales":data.sales2016,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_COGS":data.cogs2016,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_depreciationAmortization":data.depAmo2016,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_SGAexpense":data.sga2016,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_otherSGAexpense":data.osga2016,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_EBIT":data.ebit2016,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_incomeTax":data.incomeTax2016
    }},
        {new:true})
        .exec().then((res) => {
        resolve();
    }); 
    PublicFinancial.findOneAndUpdate({"cli_loginName":userName,"puf_3FiscalYears.puf_FiscalYear": year-3},
        {$set:{"puf_3FiscalYears.$.puf_incomeStatment3.0.ins_sales":data.sales2015,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_COGS":data.cogs2015,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_depreciationAmortization":data.depAmo2015,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_SGAexpense":data.sga2015,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_otherSGAexpense":data.osga2015,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_EBIT":data.ebit2015,
        "puf_3FiscalYears.$.puf_incomeStatment3.0.ins_incomeTax":data.incomeTax2015
    }},
        {new:true})
        .exec().then((res) => {
        resolve();
    }); 
    CompanyTaxInfo.findOneAndUpdate({"cli_loginName":userName,"cti_3FiscalYears.cti_FiscalYear": year-1},
        {$set:{"cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_salaryWages":data.salary2017,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_costMaterial":data.cost2017,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_contractExpense":data.con2017,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_leaseExpenditure":data.lea2017,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_overhead":data.over2017,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_capitalExpenditure":data.cap2017
        }},
        {new:true})
        .exec().then((res) => {
        resolve();
    });  
    CompanyTaxInfo.findOneAndUpdate({"cli_loginName":userName,"cti_3FiscalYears.cti_FiscalYear": year-2},
        {$set:{"cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_salaryWages":data.salary2016,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_costMaterial":data.cost2016,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_contractExpense":data.con2016,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_leaseExpenditure":data.lea2016,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_overhead":data.over2016,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_capitalExpenditure":data.cap2016
        }},
        {new:true})
        .exec().then((res) => {
        resolve();
    }); 
    CompanyTaxInfo.findOneAndUpdate({"cli_loginName":userName,"cti_3FiscalYears.cti_FiscalYear": year-3},
        {$set:{"cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_salaryWages":data.salary2015,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_costMaterial":data.cost2015,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_contractExpense":data.con2015,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_leaseExpenditure":data.lea2015,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_overhead":data.over2015,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_capitalExpenditure":data.cap2015
        }},
        {new:true})
        .exec().then((res) => {
        resolve();
    }); 

    // 2018 r&d expense to do: NO related database section for data storage!!
};

module.exports.updateCompanyTaxInfoData = (userName, data) => {
    let date = new Date();
    let year = date.getFullYear();
    CompanyTaxInfo.findOneAndUpdate({cli_loginName:userName},
        {$set:{"cti_3FiscalYears.0.cti_FiscalYear":year-3,
        "cti_3FiscalYears.1.cti_FiscalYear":year-2,
        "cti_3FiscalYears.2.cti_FiscalYear":year-1}},
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
        {$set:{"cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_gstHST":data.GST2016,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_investmentTaxCredit":data.investment2016,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_SREDtaxCredit":data.SRED2016
        }},
        {new:true})
        .exec().then((res) => {
        resolve();
    });  
    CompanyTaxInfo.findOneAndUpdate({"cli_loginName":userName,"cti_3FiscalYears.cti_FiscalYear": year-3},
        {$set:{"cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_gstHST":data.GST2015,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_investmentTaxCredit":data.investment2015,
        "cti_3FiscalYears.$.cti_companyTaxInfo3.0.cti_SREDtaxCredit":data.SRED2015
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

