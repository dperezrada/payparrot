# -*- coding: utf-8 -*-

from bottle import route, request, response

from payparrot_api.middlewares.auth import secure
from payparrot_api.libs.exceptions import UnauthorizeException
from payparrot_dal import Accounts, AccountsSessions, Messages

@route('/accounts/:account_id/messages', method="POST")
@secure()
def create_message(account_id):
    # TODO: check mongo injection
    new_message = request.json
    new_message['account_id'] = account_id
    message = Messages(**new_message)
    message.save()
    response.status = 201
    return {'id': str(message.id)}

@route('/accounts/:account_id/messages/:message_id', method="GET")
def get_message(account_id, message_id):
    messages = Messages.objects(id = message_id, account_id = account_id)
    if len(messages) == 0:
        response.status = 404
    else:
        return messages[0].JSON()

@route('/accounts/:account_id/messages/:message_id', method="PUT")
def update_message(account_id, message_id):
    messages = Messages.objects(id = message_id, account_id = account_id)
    if len(messages) == 0:
        response.status = 404
    else:
        messages[0].update_with_data(request.json)
        response.status = 204