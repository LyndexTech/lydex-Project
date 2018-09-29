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

print("12345")
sys.stdout.flush()
table.publicFinancial.remove({
'cli_loginName': sys.argv[2]
});