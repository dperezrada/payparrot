# -*- coding: utf-8 -*-
from time import sleep

from webtest import TestApp

from payparrot_dal import Accounts
from payparrot_dal.mongodb import connect
from payparrot_dal.queue import Queue


def get_app():
    from payparrot_api import application
    return TestApp(application)

def connect_to_mongo():
    return connect()

def tear_down(db, app=None, queue = False):
    db.accounts.drop()
    db.messages.drop()
    db.accounts_sessions.drop()
    db.subscriptions.drop()
    db.sessions.drop()
    db.parrots.drop()
    db.notifications.drop()
    db.payments.drop()
    if app:
        app.get('/logout')
    if queue:
        sleep(1)
        for queue_name in ['notifications', 'payments']:
            queue = Queue.get_queue(queue_name)
            while queue.count():
                for message in queue.get_messages(num_messages=10, visibility_timeout=60):
                    Queue.delete_message(queue_name, message)

def create_account_and_login(app, db, account_data):
    response = app.post_json('/accounts',
        account_data
    )
    app.post('/login',
        {'email': account_data['email'], 'password': account_data['password']}
    )
    account = Accounts.findOne(db, response.json.get('id'))
    return account