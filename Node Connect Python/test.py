import selenium
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import pandas as pd
from bs4 import BeautifulSoup
import pymongo


connection = pymongo.MongoClient('mongodb+srv://Lyndex:Lyndex09@cluster0-ldnj9.mongodb.net/dblyndex?retryWrites=true')
table = connection.dblyndex

p = []
l = []
for i in table.link.find():
    url = i['url']
    p.append(url)

driver = webdriver.Chrome()
driver.get('https://www.linkedin.com/')
driver.find_element_by_id('login-email').send_keys('minghaolyu@gmail.com')
driver.find_element_by_id('login-password').send_keys('150993Ml!')
driver.find_element_by_id('login-submit').click()

for i in range(0,len(p)):
    driver.get(p[i])
    a = driver.page_source
    soup = BeautifulSoup(a,'lxml')
    all = soup.find_all('div',{'class','pv-entity__summary-info pv-entity__summary-info--v2'})
    for item in all:
        d1 = {}
        try:
            d1['position info'] = item.find('h3',{'class','Sans-17px-black-85%-semibold'}).text
        except:
            d1['position info'] = None
        l.append(d1)

table.profile.insert(l)
