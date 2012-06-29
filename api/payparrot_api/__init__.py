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

@route('/accounts/:account_id', method="GET")
def get_account(account_id):
    accounts = Accounts.objects(id = account_id)
    if len(accounts) == 0:
        response.status = 404
    else:
        return accounts[0].JSON()


@route('/accounts/:account_id/credentials', method="GET")
def get_credentials(account_id):
    accounts = Accounts.objects(id = account_id).only('credentials')
    if len(accounts) == 0:
        response.status = 404
    else:
        return accounts[0].credentials

bottle.debug(True)

application = bottle.default_app.pop()
