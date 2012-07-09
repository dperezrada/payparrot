# -*- coding: utf-8 -*-
import os, sys
from bottle import route, request, response, static_file, SimpleTemplate, template, view, redirect

from payparrot_api.libs.exceptions import UnauthorizeException
from payparrot_dal import Accounts, AccountsSessions

#Move away from here

@route('/login')
def callback():
    return static_file('login.html', os.path.join(os.path.abspath(os.path.dirname(__file__)), '../../../public/'))    

@route('/signup', method="POST")
def callback(db):
    #params = {'company':request.forms.get("company"),'name':request.forms.get("name"),'email':request.forms.get("email"),'password':request.forms.get("password")}
    params = {'company':'','name':'','email':'','password':''}
    params.update(request.forms)
    account = Accounts.findOne(db, {'email': params.get("email","")})
    status = False
    if account:
        pass
    else:
        new_account = Accounts(db, {'name': 'lalala'})
        new_account.insert()
        new_account = Accounts(db, params)
        new_account.insert()
        status = True
    params['status'] = status
    return template('signedup',params)

@route('/accounts/setup', method="GET")
def callback(db, secure=True):
    return template('steps',{'account_id': request.account.id})    

@route('/accounts/subscriptions', method="GET")
def callback(db, secure=True):
    return template('subscriptions',{'account_id': request.account.id})    


#Accounts

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
def get_account(account_id, db, secure=True):
    account = Accounts.findOne(db, account_id)
    if account:
        account.update(request.json)
        return account.JSON()
    else:
        response.status = 404
        return {}

@route('/accounts/:account_id/credentials', method="GET")
def get_credentials(account_id, db, secure=True):
    account = Accounts.findOne(db, account_id)
    if account:
        return account.JSON()
    else:
        response.status = 404
        return {}

@route('/logged', method="GET")
def logged(db,secure = True):
    account = request.account
    if not account:
        redirect('/login')
        return
    if not account.setup:
        redirect('/accounts/setup')
        return
    if not account.subscriptions:
        redirect('/accounts/subscriptions')
        return
    redirect('/app.html')

@route('/login', method="POST")
def login(db):
    account = Accounts.findOne(db, {
        'email': request.forms.get('email'),
        'password': request.forms.get('password')
    })
    if account:
        account_session = AccountsSessions(db, {'account_id': account.id})
        account_session.insert()
        response.set_cookie('sid', account_session.session_id, path='/', expires = account_session.expires)
        redirect('/logged')
    else:
        raise UnauthorizeException()

@route('/logout', method="GET")
def logout():
    response.set_cookie('sid', '', path='/')
    response.status = 204
