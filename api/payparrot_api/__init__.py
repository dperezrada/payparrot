# -*- coding: utf-8 -*-
import bottle
from bottle import route, request, response

from mongoengine import connect

from payparrot_dal import Accounts

connect('payparrot_test')

@route('/accounts', method="POST")
def create_account():
    account = Accounts(**request.json)
    account.save()
    response.status = 201
    return {'id': str(account.id)}

bottle.debug(True)

application = bottle.default_app.pop()
