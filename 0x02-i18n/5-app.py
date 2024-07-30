#!/usr/bin/env python3
'''3. Basic Babel setup'''
from flask import Flask, render_template, request, g
from flask_babel import Babel


class Config:
    '''Config class'''
    DEBUG = True
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user():
    '''get user by id'''
    user_id = request.args.get('login_as')
    if user_id:
        return users.get(int(user_id))
    return None


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False

babel = Babel(app)


@app.before_request
def before_request():
    '''executed at the beginning'''
    g.user = get_user()


@babel.localeselector
def get_locale():
    '''get locale of a web page'''
    locale = request.args.get('locale')
    if locale in app.config['LANGUAGES']:
        return locale
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def home():
    '''home route'''
    return render_template('5-index.html')


if __name__ == '__main__':
    app.run()
