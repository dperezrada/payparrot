# -*- coding: utf-8 -*-

from webtest import TestApp
from pymongo import Connection

from payparrot_dal import Accounts

def get_app():
    from payparrot_api import application
    return TestApp(application)

def connect_to_mongo():
    connection = Connection()
    return connection['payparrot_test']

def tear_down(db, app=None):
	db.accounts.drop()
	db.messages.drop()
	db.accounts_sessions.drop()
	db.subscriptions.drop()
	db.sessions.drop()
	db.parrots.drop()
	db.notifications.drop()
	if app:
	    app.get('/logout')

def create_account_and_login(app, db, account_data):
    account = Accounts(db, account_data)
    account.insert()
    app.post_json('/login',
        {'email': account_data['email'], 'password': account_data['password']}
    )
    return account