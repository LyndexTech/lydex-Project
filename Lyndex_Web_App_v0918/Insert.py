# -*- coding: utf-8 -*-
"""
Created on Sat Sep 29 16:32:31 2018

@author: User
"""

import sys

import pymongo

import pandas as pd


data = pd.read_excel(sys.argv[1])



a = list(data['Data Name'])
b = list(data['Data entry'])

dataset = dict(zip(a,b))

connection = pymongo.MongoClient('mongodb+srv://Lyndex:Lyndex09@cluster0-ldnj9.mongodb.net/dblyndex?retryWrites=true')

table = connection.dblyndex
table.publicFinancial.insert({
		'cli_loginName': sys.argv[2],
		'puf_3FiscalYears':[{'puf_FiscalYear': 2015,
                       'puf_incomeStatment3': [{'ins_sales': dataset['Sales - 2015'],
                                                'ins_grossProfitIncome':dataset['Gross Profit/Income - 2015'],
                                                'ins_netIncome':dataset['Net Income - 2015'],
                                                'ins_incomeTax': dataset['Income Tax - 2015'],
                                                'ins_COGS': dataset['COGS - 2015'],
                                                'ins_depreciationAmortization': dataset['Depreciation & Amortization - 2015'],
                                                'ins_SGAexpense': dataset['SG&A Expense - 2015'],
                                                'ins_otherSGAexpense': dataset['Other SG&A Expense - 2015'],
                                                'ins_EBIT': dataset['EBIT - 2015']}],
                       'puf_balanceSheet': [{'bas_propertyPlantEquip': dataset['Property, plant & equipment - 2015'],
                                            'bas_constructInProgress': dataset['Construction in progress - 2015'],
                                            'bas_computerSoftwareEquip': dataset['Computer Software & Equipment - 2015'],
                                            'bas_otherPPE': dataset['Other PPE - 2015'],
                                            'bas_accummulatedDepreciation': dataset['Accummulated Depreciation - 2015'],
                                            'bas_intangibleAsset': dataset['Intangible Asset - 2015'],
                                            'bas_machineryEquipment': 3456,
                                            'bas_deferredTax': dataset['Deferred Tax & Investment Tax Credit- 2015']}],
                       'puf_cashFlow': [{'caf_deferredTax': dataset['Deferred Tax - 2015'],
                                       'caf_changesWorkingCapital':dataset['Changes in Working Capital - 2015'],
                                       'caf_capitalExpenditure': dataset['Capital Expenditure - 2015']}],
                       'puf_financialRatio':[{'fir_PEratio': dataset['P/E Ratio (including extraordinary items) - 2015'],
                                            'fir_currentRatio': dataset['Current ratio - 2015'],
                                            'fir_quitckRatio': dataset['Quick ratio - 2015'],
                                            'fir_assetTurnover': dataset['Asset turnover - 2015'],
                                            'fir_grossMargin': dataset['Gross margin - 2015'],
                                            'fir_operatingMargin': dataset['Operating margin - 2015'],
                                            'fir_netMargin': dataset['Net margin - 2015']}]
    		},
                            {'puf_FiscalYear': 2016,
                           'puf_incomeStatment3': [{'ins_sales': dataset['Sales - 2016'],
                                                    'ins_grossProfitIncome':dataset['Gross Profit/Income - 2016'],
                                                    'ins_netIncome':dataset['Net Income - 2016'],
                                                    'ins_incomeTax': dataset['Income Tax - 2016'],
                                                    'ins_COGS': dataset['COGS - 2016'],
                                                    'ins_depreciationAmortization': dataset['Depreciation & Amortization - 2016'],
                                                    'ins_SGAexpense': dataset['SG&A Expense - 2016'],
                                                    'ins_otherSGAexpense': dataset['Other SG&A Expense - 2016'],
                                                    'ins_EBIT': dataset['EBIT - 2016']}],
                           'puf_balanceSheet': [{'bas_propertyPlantEquip': dataset['Property, plant & equipment - 2016'],
                                                'bas_constructInProgress': dataset['Construction in progress - 2016'],
                                                'bas_computerSoftwareEquip': dataset['Computer Software & Equipment - 2016'],
                                                'bas_otherPPE': dataset['Other PPE - 2016'],
                                                'bas_accummulatedDepreciation': dataset['Accummulated Depreciation - 2016'],
                                                'bas_intangibleAsset': dataset['Intangible Asset - 2016'],
                                                'bas_machineryEquipment': 3456,
                                                'bas_deferredTax': dataset['Deferred Tax & Investment Tax Credit- 2016']}],
                           'puf_cashFlow': [{'caf_deferredTax': dataset['Deferred Tax - 2016'],
                                           'caf_changesWorkingCapital':dataset['Changes in Working Capital - 2016'],
                                           'caf_capitalExpenditure': dataset['Capital Expenditure - 2016']}],
                           'puf_financialRatio':[{'fir_PEratio': dataset['P/E Ratio (including extraordinary items) - 2016'],
                                                'fir_currentRatio': dataset['Current ratio - 2016'],
                                                'fir_quitckRatio': dataset['Quick ratio - 2016'],
                                                'fir_assetTurnover': dataset['Asset turnover - 2016'],
                                                'fir_grossMargin': dataset['Gross margin - 2016'],
                                                'fir_operatingMargin': dataset['Operating margin - 2016'],
                                                'fir_netMargin': dataset['Net margin - 2016']}]
        		},
                            {'puf_FiscalYear': 2017,
                       'puf_incomeStatment3': [{'ins_sales': dataset['Sales - 2017'],
                                                'ins_grossProfitIncome':dataset['Gross Profit/Income - 2017'],
                                                'ins_netIncome':dataset['Net Income - 2017'],
                                                'ins_incomeTax': dataset['Income Tax - 2017'],
                                                'ins_COGS': dataset['COGS - 2017'],
                                                'ins_depreciationAmortization': dataset['Depreciation & Amortization - 2017'],
                                                'ins_SGAexpense': dataset['SG&A Expense - 2017'],
                                                'ins_otherSGAexpense': dataset['Other SG&A Expense - 2017'],
                                                'ins_EBIT': dataset['EBIT - 2017']}],
                       'puf_balanceSheet': [{'bas_propertyPlantEquip': dataset['Property, plant & equipment - 2017'],
                                            'bas_constructInProgress': dataset['Construction in progress - 2017'],
                                            'bas_computerSoftwareEquip': dataset['Computer Software & Equipment - 2017'],
                                            'bas_otherPPE': dataset['Other PPE - 2017'],
                                            'bas_accummulatedDepreciation': dataset['Accummulated Depreciation - 2017'],
                                            'bas_intangibleAsset': dataset['Intangible Asset - 2017'],
                                            'bas_machineryEquipment': 3456,
                                            'bas_deferredTax': dataset['Deferred Tax & Investment Tax Credit- 2017']}],
                       'puf_cashFlow': [{'caf_deferredTax': dataset['Deferred Tax - 2017'],
                                       'caf_changesWorkingCapital':dataset['Changes in Working Capital - 2017'],
                                       'caf_capitalExpenditure': dataset['Capital Expenditure - 2017']}],
                       'puf_financialRatio':[{'fir_PEratio': dataset['P/E Ratio (including extraordinary items) - 2017'],
                                            'fir_currentRatio': dataset['Current ratio - 2017'],
                                            'fir_quitckRatio': dataset['Quick ratio - 2017'],
                                            'fir_assetTurnover': dataset['Asset turnover - 2017'],
                                            'fir_grossMargin': dataset['Gross margin - 2017'],
                                            'fir_operatingMargin': dataset['Operating margin - 2017'],
                                            'fir_netMargin': dataset['Net margin - 2017']}]
    		}],
		'puf_5FiscalYears':[{'puf_FiscalYear': 2013,
                     'atment5': [{'ins_researchDevelopment': dataset['Research & Development - 2013']}]
		},
        {'puf_FiscalYear': 2014,
                     'atment5': [{'ins_researchDevelopment': dataset['Research & Development - 2014']}]
		},
        {'puf_FiscalYear': 2015,
                     'atment5': [{'ins_researchDevelopment': dataset['Research & Development - 2015']}]
		},
        {'puf_FiscalYear': 2016,
                     'atment5': [{'ins_researchDevelopment': dataset['Research & Development - 2016']}]
		},
        {'puf_FiscalYear': 2017,
                     'atment5': [{'ins_researchDevelopment': dataset['Research & Development - 2017']}]
		}]

})


