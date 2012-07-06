# -*- coding: utf-8 -*-
import json
import re
from datetime import datetime

from bson.objectid import ObjectId
from bottle import route, request, response, redirect


from payparrot_api.libs.exceptions import UnauthorizeException
from payparrot_dal import Accounts, AccountsSessions, Sessions, Twitter, Parrots, Subscriptions, Notifications

@route('/accounts/:account_id/notifications/:notification_id', method="GET")
def get_notification(account_id, notification_id, db):
    notification = Notifications.findOne(db, {'_id': ObjectId(notification_id),'account_id': ObjectId(account_id)})
    if notification:
        # del notification.queue_message_id
        return notification.JSON()
    else:
        print "cagamos"
        response.status = 404
        return {}