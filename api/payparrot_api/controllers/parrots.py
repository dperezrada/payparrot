# -*- coding: utf-8 -*-
import json

from bottle import route, request, response, redirect

from payparrot_api.middlewares.auth import secure
from payparrot_api.libs.exceptions import UnauthorizeException
from payparrot_dal import Accounts, AccountsSessions, Sessions, Twitter, Parrots, Subscriptions, Notifications

@route('/accounts/:account_id/parrots/start', method="GET")
def parrots_start(account_id, db):
	# TODO: verificar el public_token
    account = Accounts.findOne(db,account_id)
    print request.query.lala
    if account:
        twitter = Twitter()
        client = twitter.create_session()
        tokens = twitter.get_request_token(client)
        session = Sessions(db, {'account_id': account.id, 'oauth_token': tokens['oauth_token'], 'oauth_token_secret': tokens['oauth_token_secret'], 'external_id': request.query.external_id})
        session.insert()
        redirect_url = twitter.redirect_url(tokens)
        redirect(redirect_url)
    else:
	    response.status = 404
	    return {}

@route('/parrots/finish', method="GET")
def parrots_finish(db):
	# TODO: verificar el public_token
	session = Sessions.findOne(db, {'oauth_token': request.query.oauth_token})
	if session:
		account = Accounts.findOne(db, session.account_id)
		twitter = Twitter()
		access_tokens = twitter.get_access_tokens(request.query.oauth_verifier,{'oauth_token': session.oauth_token, 'oauth_token_secret': session.oauth_token_secret})
		print access_tokens
		#Create twitter client
		twitter.create_client(access_tokens.get('oauth_token'),access_tokens.get('oauth_token_secret'))
		headers, body = twitter.get('https://api.twitter.com/1/account/verify_credentials.json')
		print headers
		if headers.status == '200':
			body = json.loads(body)
			parrot = Parrots.findOne(db, {'twitter_id': body.get('id')})
			if not parrot:
				new_parrot = Parrots({
					'twitter_info': body,
					'twitter_id': body.get('id'),
					'oauth_token': access_tokens.get('oauth_token'),
					'oauth_token_secret': access_tokens.get('oauth_token_secret')
				})
				new_parrot.insert()
				parrot = new_parrot
			Subscriptions = Subscriptions.findOne(db, {'account_id': account.id, 'parrot_id': parrot.id})
			Subscriptions_parameters = {
				'parrot_id': parrot.id,
				'account_id': account.id,
				'active': True,
				'external_id': session.external_id
			}
			if not Subscriptions:
				Subscriptions = Subscriptions(Subscriptions_parameters)
				Subscriptions.insert()
			else:
				Subscriptions.update(Subscriptions_parameters)
			created_notification = create_notification()

	else:
		response.status = 404
		return

def create_notification(account,parrot,Subscriptions):
	notification = Notifications({
		'account_id': account.id,
		'parrot_id': parrot.id,
		'type': 'suscription_activated',
		'suscription_id': Subscriptions.id,
		'external_id': Subscriptions.external_id,
		'request_url': account.notification_url
	})
	notification.insert()
