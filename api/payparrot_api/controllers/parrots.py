# -*- coding: utf-8 -*-
import json
import re
from datetime import datetime

from bson.objectid import ObjectId
from bottle import route, request, response, redirect


from payparrot_api.libs.exceptions import UnauthorizeException
from payparrot_dal import Accounts, AccountsSessions, Sessions, Twitter, Parrots, Subscriptions, Notifications

@route('/parrots/start', method="GET")
def parrots_start(db):
    account = Accounts.findOne(db,{'credentials.public_token': request.query.get("token")})
    if account:
        twitter = Twitter()
        client = twitter.create_session()
        tokens = twitter.get_request_token(client)
        session = Sessions(db, {'account_id': account.id, 'oauth_token': tokens['oauth_token'], 'oauth_token_secret': tokens['oauth_token_secret'], 'external_id': request.query.external_id})
        session.insert()
        redirect_url = twitter.redirect_url(tokens)
        redirect(redirect_url)
    else:
        print "Noooo ---"
        response.status = 404
        return {}

@route('/parrots/finish', method="GET")
def parrots_finish(db):
    # TODO: verificar el public_token
    session = Sessions.findOne(db, {'oauth_token': request.query.oauth_token})
    if session:
        account = Accounts.findOne(db, session.account_id)
        if not account:
            response.status = 404
            return {'error': 'Invalid token'}
        twitter = Twitter()
        access_tokens = twitter.get_access_tokens(request.query.oauth_verifier,{'oauth_token': session.oauth_token, 'oauth_token_secret': session.oauth_token_secret})
        #Create twitter client
        # TODO: Check access_tokens
        twitter.create_client(access_tokens.get('oauth_token'),access_tokens.get('oauth_token_secret'))
        headers, body = twitter.get('https://api.twitter.com/1/account/verify_credentials.json')
        if headers.status == 200:
            body = json.loads(body)
            parrot = Parrots.findOne(db, {'twitter_id': body.get('id')})
            if not parrot:
                new_parrot = Parrots(db, {
                    'twitter_info': body,
                    'twitter_id': body.get('id'),
                    'oauth_token': access_tokens.get('oauth_token'),
                    'oauth_token_secret': access_tokens.get('oauth_token_secret')
                })
                new_parrot.insert()
                parrot = new_parrot
            subscription = Subscriptions.findOne(db, {'account_id': account.id, 'parrot_id': parrot.id})
            subscription_parameters = {
                'parrot_id': parrot.id,
                'account_id': account.id,
                'active': True,
                'external_id': session.external_id,
                'twitter_screen_name': body.get("screen_name")
            }
            if not subscription:
                subscription = Subscriptions(db, subscription_parameters)
                subscription.insert()
            else:
                subscription.update(subscription_parameters)
            notification_id = _create_notification(db, account, parrot, subscription)
            if notification_id:
                redirect_url = generate_redirect_url(account.callback_url, session.external_id, subscription.id, notification_id)
                redirect(redirect_url)
    else:
        response.status = 404
        return {'error': 'Expired token'}

def generate_redirect_url(callback_url,session_external_id, subscription_id, notification_id):
    # TODO: Refactor
    parameters = "";
    sep = "?";
    if callback_url.find('?')>=0:
        sep = "&";
    if session_external_id:
        parameters = sep+"external_id="+session_external_id
    if subscription_id:
        parameters = parameters+"&subscription_id="+subscription_id
    parameters = parameters+"&notification_id="+notification_id;
    return callback_url+parameters

def _create_notification(db, account,parrot,subscription):
    notification = Notifications(db, {
        'account_id': account.id,
        'parrot_id': parrot.id,
        'type': 'subscription_activated',
        'subscription_id': subscription.id,
        'external_id': subscription.external_id,
        'request_url': account.notification_url
    })
    notification.insert()
    return notification.id


def get_valid_parrot(db, account_id, parrot_id):
    account = Accounts.findOne(db,account_id)
    if account:
        subscription = Subscriptions.findOne(db, {'parrot_id': ObjectId(parrot_id), 'account_id': ObjectId(account_id)})
        if subscription:
            parrot = Parrots.findOne(db, parrot_id)
            if parrot:
                return parrot

@route('/accounts/:account_id/parrots', method="GET")
def get_parrots(account_id, db, secure = True):
    querystring = request.query;
    from_ = querystring.get("from")
    to_ = querystring.get("to")
    skip = querystring.get('skip', 0)
    limit = querystring.get('limit', 0)
    query_subscriptions = {'account_id': ObjectId(account_id), 'active': True}
    # import nose; nose.tools.set_trace()
    if from_ or to_:
        query_subscriptions['created_at'] = {}
    if from_:
        query_subscriptions['created_at']['$gte'] = datetime.strptime(from_, '%Y-%m-%d')
    if to_:
        query_subscriptions['created_at']['$lte'] = datetime.strptime(to_, '%Y-%m-%d')
    if querystring.screen_name:
        screen_name_regex = re.compile(querystring.screen_name,re.IGNORECASE)
        query_subscriptions['twitter_screen_name'] = screen_name_regex
    parrots_from_subscriptions = Subscriptions.find(db, query_subscriptions, {'parrot_id': True, '_id': False}).skip(skip).limit(limit).sort([('_id', -1)])
    parrots_id = map(lambda x: x.get('parrot_id'), parrots_from_subscriptions)
    parrots = Parrots.find(db, {'_id': {'$in': parrots_id}})
    # TODO: fix this
    response.headers['Content-type'] = 'application/json'
    return json.dumps(map(lambda x: Parrots.toJSON(x), parrots))


@route('/accounts/:account_id/parrots/:parrot_id', method="GET")
def get_parrot(account_id, parrot_id, db, secure = True):
    parrot = get_valid_parrot(db, account_id, parrot_id)
    if parrot:
        return parrot.JSON()
    response.status = 404
    return {}

@route('/accounts/:account_id/parrots/:parrot_id', method="DELETE")
def delete_parrot(account_id, parrot_id, db, secure = True):
    parrot = get_valid_parrot(db,account_id,parrot_id)
    if parrot:
        db.subscriptions.remove({'parrot_id': ObjectId(parrot_id), 'account_id': ObjectId(account_id)})
        response.status = 204
        return
    response.status = 404
    return {}
