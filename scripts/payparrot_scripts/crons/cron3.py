# -*- coding: utf-8 -*-
import sys
import json

from urllib import urlencode
from httplib2 import Http

from payparrot_dal import Subscriptions, Notifications
from payparrot_dal.mongodb import connect
from payparrot_dal.queue import Queue

VALID_NOTIFICATIONS = [
    "payment_success",
    "payment_failed",
    "payment_failed",
    "subscription_activated",
    "subscription_deactivated"
]

def main():
    db = connect()
    message = Queue.get_message('notifications')
    while message:
        notify(db, message)
        message = Queue.get_message('notifications')

def notify(db, notification_raw):
    notification_message = json.loads(notification_raw.get_body())
    notification = Notifications.findOne(db, notification_message.get('notification_id'))
    if notification:
        print "Trying to Notify..."
        if not notification_message.get('type') in VALID_NOTIFICATIONS:
            print >> sys.stderr, "Not know notification"
            # TODO: Check what to do in this case
            return
        if notification.request_url:
            query_data = {
                'subscription_id': str(notification.subscription_id),
                'account_id': str(notification.account_id),
                'parrot_id': str(notification.parrot_id),
                'type': notification_message.get('type'),
                'external_id': str(notification.external_id),
                'notification_id': str(notification.id),
            }
            http_client = Http()
            headers, body = http_client.request(uri = notification.request_url, body = urlencode(query_data), method = 'POST')
            if int(headers.status) >= 200 and int(headers.status) < 300:
                notification.update({
                    'response_status': headers.status,
                    'response_headers': headers,
                    'response_body': body,
                    'status': 'sent'
                })
                Queue.delete_message('notifications', notification_raw)
            else:
                print sys.stderr, "Failed. Notification response not 2XX (received %s) from url %s" % (
                    headers.status,
                    notification.request_url
                )
        else:
            print >> sys.stderr, "Failed. No request URL"
    else:
        print >> sys.stderr, "Failed. No notification found in db with id %s" % notification_message.get('notification_id')


if __name__ == '__main__':
    main()        