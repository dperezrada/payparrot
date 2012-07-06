# -*- coding: utf-8 -*-

from pymongo import Connection
def connect_to_mongo():
    connection = Connection()
    return connection['payparrot_test']

def tear_down(db, app):
	db.accounts.drop()
	db.messages.drop()
	db.accounts_sessions.drop()
	db.subscriptions.drop()
	db.sessions.drop()
	db.parrots.drop()
	db.notifications.drop()
	app.get('/logout')