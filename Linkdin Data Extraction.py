# -*- coding: utf-8 -*-
"""
Created on Sun Sep 16 23:07:28 2018

@author: User
"""
import selenium
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import pandas as pd
from bs4 import BeautifulSoup
import pymongo



l = []
l1 = []
#option = webdriver.ChromeOptions()
#option.add_argument("headless") #chrome_options=option
driver = webdriver.Chrome()
driver.get('https://www.linkedin.com/')
driver.find_element_by_id('login-email').send_keys('emailaddress')
driver.find_element_by_id('login-password').send_keys('passward')
driver.find_element_by_id('login-submit').click()
driver.get('https://www.linkedin.com/in/shengxue-chris-zhang-056aa986/')
pagesource = driver.page_source
soup = BeautifulSoup(pagesource,'lxml')
all = soup.find_all('div',{'class','pv-entity__summary-info pv-entity__summary-info--v2'})
for item in all:
    d = {}
    #d['firstname'] = firstname
    #d['lastname'] = lastname
    #d['email'] = email
    #d['linkdin'] = url
    #d['companyWebsite'] = companywebsite
    try:
        d['position'] = item.find('h3',{'class',"Sans-17px-black-85%-semibold"}).text
    except:
        d['position info'] = 'Missing'
    try:
        d['company'] = item.find('span',{'class','pv-entity__secondary-title'}).text
    except:
        d['company'] = 'Missing'
    try:
        d['year'] = item.find('h4',{'class','pv-entity__date-range Sans-15px-black-70%'}).text
    except:
        d['year'] = 'Missing'
    l.append(d)
driver.get('https://www.linkedin.com/company/lincoln-electric/')
a = driver.page_source
soup1 = BeautifulSoup(a,'lxml')
all1 = soup1.find_all('div',{'class','organization-outlet relative'})
for item in all1:
    d1 = {}
    #d1['firstname'] = firstname
    #d1['lastname'] = lastname
    try:
        d1['companyname'] = item.find('h1',{'class','org-top-card-module__name Sans-26px-black-85%-light'}).text
    except:
        d1['companyname'] = 'Missing'
    try:
        d1['type'] = item.find('span',{'class',"company-industries org-top-card-module__dot-separated-list"}).text
    except:
        d1['type'] = 'Missing'
    try:
        d1['location'] = item.find('span',{'org-top-card-module__location org-top-card-module__dot-separated-list'}).text
    except:
        d1['location'] = 'Missing'
    try:
        d1['description'] = item.find('p',{'class','org-about-us-organization-description__text description mb5 pre-wrap Sans-15px-black-70%'}).text
    except:
        d1['description'] = 'Missing'
    l1.append(d1)
connection = pymongo.MongoClient('mongodb+srv://Lyndex:Lyndex09@cluster0-ldnj9.mongodb.net/dblyndex?retryWrites=true')
table = connection.test
table.profile.insert(l[0])
table.companyinfo.insert(l1)
