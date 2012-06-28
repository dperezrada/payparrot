# -*- coding: utf-8 -*-
from bottle import route, run, default_app


@route('/accounts', method="POST")
def create_account():
    return '<b>Hello %s!</b>' % name

application = default_app.pop()
