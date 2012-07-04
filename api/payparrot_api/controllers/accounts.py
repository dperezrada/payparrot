# -*- coding: utf-8 -*-

from bottle import route, request, response

from payparrot_api.middlewares.auth import secure
from payparrot_api.libs.exceptions import UnauthorizeException
from payparrot_dal import Accounts, AccountsSessions

@route('/accounts', method="POST")
def create_account(db):
    account = Accounts(db,request.json)
    account.insert()
    response.status = 201
    return {'id': str(account.id)}

@route('/accounts/:account_id', method="GET")
def get_account(account_id,db):
    account = Accounts.findOne(db, account_id)
    if account:
        return account.JSON()
    else:
        response.status = 404
        return {}

@route('/accounts/:account_id', method="PUT")
def get_account(account_id, db):
    account = Accounts.findOne(db, account_id)
    if account:
        return account.JSON()
        
    else:
        response.status = 404
        return {}

@route('/accounts/:account_id/credentials', method="GET")
def get_credentials(account_id, db):
    account = Accounts.findOne(db, account_id)
    if account:
        return account.JSON()
    else:
        response.status = 404
        return {}

@route('/logged', method="GET")
def logged():
    pass

@route('/admin', method="GET")
def admin():
    pass

@route('/login', method="POST")
def login(db):
    account = Accounts.findOne(db, {
        'email': request.json.get('email'),
        'password': request.json.get('password')
    })
    if account:
        account_session = AccountsSessions(db, {'account_id': account._id})
        account_session.insert()
        response.set_cookie('sid', account_session.session_id, path='/', expires = account_session.expires)
        response.status = 204
    else:
        raise UnauthorizeException()

@route('/logout', method="GET")
def logout():
    response.set_cookie('sid', '', path='/')
    response.status = 204