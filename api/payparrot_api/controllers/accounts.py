# -*- coding: utf-8 -*-
import os, sys
from bson.objectid import ObjectId
from datetime import date, datetime
from hashlib import sha1

from dateutil.relativedelta import relativedelta
from bottle import route, request, response, static_file, SimpleTemplate, template, view, redirect

from payparrot_api.libs.exceptions import UnauthorizeException
from payparrot_dal import Accounts, AccountsSessions, AccountsPlans

#Move away from here

@route('/notifications', method="POST")
def callback():
    print request.forms.__dict__
    print request.query.__dict__
    return {}

@route('/login')
def callback():
    return static_file('login.html', os.path.join(os.path.abspath(os.path.dirname(__file__)), '../../../public/'))    


@route('/signup', method="POST")
def callback(db):
    params = {'startup':'','name':'','email':'','password':''}
    params.update(request.forms)
    account = Accounts.findOne(db, {'email': params.get("email","")})
    status = False
    if not account:
        new_account = Accounts(db, params)
        new_account._data['password'] = sha1(new_account.salt+params.get('password')).hexdigest()
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
    params = request.json
    account = Accounts(db,request.json)
    account._data['password'] = sha1(account.salt+params.get('password')).hexdigest()
    account.insert()
    response.status = 201
    return {'id': str(account.id)}

@route('/accounts/:account_id', method="GET")
def get_account(account_id,db, secure = True):
    if account_id == 'me':
        account_id = request.account.id
    account = Accounts.findOne(db, account_id)
    filter_parrots = {'account_id': ObjectId(account_id), 'active': True}
    account._data['stats']['parrots_total'] = db.subscriptions.find(filter_parrots).count()
    from_ = datetime.today()
    from_ = datetime(from_.year, from_.month, from_.day)
    to_ = from_ + relativedelta(days=+1)
    filter_parrots['created_at'] = {'$gte': from_, '$lt': to_}
    account._data['stats']['parrots_today'] = db.subscriptions.find(filter_parrots).count()
    account._data['stats']['payments_total'] = db.payments.find({'account_id': ObjectId(account_id), 'success': True}).count()
    filter_payments = {'account_id': ObjectId(account_id), 'success': True}
    filter_payments['created_at'] = {'$gte': from_, '$lt': to_}
    account._data['stats']['payments_today'] = db.payments.find(filter_payments).count()
                    # 'payments_total': 0,
                    # 'payments_today': 0
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
        return account.credentials
    else:
        response.status = 404
        return {}

@route('/logged', method="GET")
def logged(db,secure = True):
    account = request.account
    account_plan = AccountsPlans.findOne(db, {'account_id': ObjectId(account.id)})
    if not account:
        redirect('/login')
        return
    if not account.setup:
        redirect('/accounts/setup')
        return
    # if not account_plan:
    #     redirect('/accounts/subscriptions')
    #     return
    redirect('/app.html')

@route('/login', method="POST")
def login(db):
    account_by_email = Accounts.findOne(db, {
        'email': request.forms.get('email'),
    })
    
    if account_by_email:
        account = Accounts.findOne(db, {
            'email': request.forms.get('email'),
            'password': sha1(account_by_email.salt+request.forms.get('password')).hexdigest()
        })
        if account:
            account_session = AccountsSessions(db, {'account_id': account.id})
            account_session.insert()
            response.set_cookie('sid', account_session.session_id, path='/', expires = account_session.expires)
            redirect('/logged')
            return
    raise UnauthorizeException()

@route('/logout', method="GET")
def logout():
    response.set_cookie('sid', '', path='/')
    redirect('/login')

@route('/apply', method="POST")
def apply(db):
    applicant = {
        'email': request.json.get("email",""),
        'name': request.json.get("name","")
    }
    if applicant['email'] and applicant['name']:
        user = db.potential_users.find_one({'email':applicant['email']})
        if not user:
            db.potential_users.insert(applicant)
    else:
        response.status = 404
        return {}