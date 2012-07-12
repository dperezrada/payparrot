# -*- coding: utf-8 -*-
from bson.objectid import ObjectId
import json 

from bottle import route, request, response, redirect

from payparrot_api.libs.exceptions import UnauthorizeException
from payparrot_dal import Accounts, AccountsSessions, Messages

@route('/accounts/:account_id/messages', method="POST")
def create_message(account_id, db, secure=True):
    new_message = request.json
    new_message['account_id'] = ObjectId(account_id)
    message = Messages(db, new_message)
    message.insert()
    response.status = 201
    return message.JSON()

@route('/accounts/:account_id/messages', method="GET")
def get_message(account_id, db, secure=True):
    messages = Messages.find(db, {'account_id':ObjectId(account_id)})
    if messages:
        return json.dumps(map(lambda x: Messages.toJSON(x), messages))
    else:
        response.status = 404
        return {}    

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

@route('/accounts/:account_id/messages/:message_id', method="PUT")
def update_message(account_id, message_id, db, secure=True):
    message = Messages.findOne(db, message_id)
    if message:
    	message.update(request.json)
        response.status = 204
    else:
        response.status = 404

@route('/r/:message_id', method="GET")
def redirect_from_message(message_id, db):
    message = Messages.findOne(db, message_id)
    if message:
        redirect(message.url)
    else:
        response.status = 404