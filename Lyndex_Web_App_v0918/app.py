from flask import Flask, render_template, request, send_file
import pandas
import datetime

app=Flask(__name__)

@app.route("/")
def index():
    return render_template("register.html")

if __name__=="__main__":
    app.run(debug=True)
