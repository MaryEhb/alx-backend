#!/usr/bin/env python3
'''0. Basic Flask app'''
from flask import Flask

app = Flask(__name__)


@app.route('/')
def home():
    '''home route'''
    render_template('0-index.html')


if __name__ == '__main__':
    app.run(debug=True)
