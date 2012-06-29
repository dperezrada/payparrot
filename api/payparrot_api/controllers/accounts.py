# -*- coding: utf-8 -*-

from bottle import route, request, response

from payparrot_api.middlewares.auth import secure
from payparrot_api.libs.exceptions import UnauthorizeException
from payparrot_dal import Accounts, AccountsSessions

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

@route('/accounts/:account_id', method="PUT")
def get_account(account_id):
    accounts = Accounts.objects(id = account_id)
    if len(accounts) == 0:
        response.status = 404
    else:
        accounts[0].update_with_data(request.json)
        response.status = 204

@route('/accounts/:account_id/credentials', method="GET")
def get_credentials(account_id):
    accounts = Accounts.objects(id = account_id).only('credentials')
    if len(accounts) == 0:
        response.status = 404
    else:
        return accounts[0].credentials

@route('/logged', method="GET")
@secure()
def logged():
    pass

@route('/admin', method="GET")
@secure('admin')
def admin():
    pass

@route('/login', method="POST")
def login():
    accounts = Accounts.objects(**{
        'email': request.json.get('email'),
        'password': request.json.get('password')
    })
    if accounts:
        account_session = AccountsSessions(account_id = accounts[0].id)
        account_session.save()
        response.set_cookie('sid', account_session.session_id, path='/', expires = account_session.expires)
        response.status = 204
    else:
        raise UnauthorizeException()