# -*- coding: utf-8 -*-

from bottle import route, request, response

from payparrot_api.libs.exceptions import UnauthorizeException
from payparrot_dal import Accounts, AccountsSessions, Messages

@route('/accounts/:account_id/messages', method="POST")
def create_message(account_id, db, secure=True):
    new_message = request.json
    new_message['account_id'] = account_id
    message = Messages(db, new_message)
    message.insert()
    response.status = 201
    return {'id': str(message.id)}

@route('/accounts/:account_id/messages/:message_id', method="GET")
def get_message(account_id, message_id, db, secure=True):
    message = Messages.findOne(db, message_id)
    if message:
        return message.JSON()
    else:
        response.status = 404
        return {}

@route('/accounts/:account_id/messages/:message_id', method="PUT")
def update_message(account_id, message_id, db, secure=True):
    message = Messages.findOne(db, message_id)
    if message:
    	message.update(request.json)
        response.status = 204
    else:
        response.status = 404