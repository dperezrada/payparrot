# -*- coding: utf-8 -*-
import sys
import json

from urllib import urlencode
from httplib2 import Http

from payparrot_dal import Subscriptions, Notifications, Accounts
from payparrot_dal.mongodb import connect
from payparrot_dal.queue import Queue
from payparrot_scripts.crons.utils import log 

VALID_NOTIFICATIONS = [
    "payment_success",
    "payment_failed",
    "payment_failed",
    "subscription_activated",
    "subscription_deactivated"
]

def main():
    connection = None
    # TODO: change i
    i = 0
    log('cron3', 'Starting')
    try:
        connection, db = connect()
        message = Queue.get_message('notifications')
        while message is not None and i<20:
            notification_message = json.loads(message.get_body())
            notify(db, message, notification_message)
            message = Queue.get_message('notifications')
            i+=1
    finally:
        if connection:
            connection.close()
        log('cron3', 'Finishing')

def notify(db, notification_raw, notification_message):
    notification = Notifications.findOne(db, notification_message.get('notification_id'))
    account = Accounts.findOne(db, notification.account_id)
    if notification:
        log('cron3', 'Notifying remote customer', notification_message.get('subscription_id'))
        if not notification_message.get('type') in VALID_NOTIFICATIONS:
            log('cron3', 'ERROR: Unknown notification', notification_message.get('subscription_id'))
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
            log('cron3', 'Notification URL: %s' % notification.request_url, notification_message.get('subscription_id'))
            utf8_query_data = dict([(key,val.encode('utf-8')) for key, val in query_data.items() if isinstance(val, basestring)])
            delete_message = False
            try:
                if account.notification_active:
                    http_client = Http()
                    headers, body = http_client.request(uri = notification.request_url, body = urlencode(utf8_query_data), method = 'POST')
                    if int(headers.status) >= 200 and int(headers.status) < 300:
                        notification.update({
                            'response_status': headers.status,
                            'response_headers': headers,
                            'response_body': body,
                            'status': 'sent'
                        })
                        log('cron3', 'Remote notification succeded', notification_message.get('subscription_id'))
                    else:
                        log('cron3', "Failed. Notification response not 2XX (received %s) from url %s" % (
                            headers.status,
                            notification.request_url
                        ), notification_message.get('subscription_id'))
                else:
                    delete_message = True
                    notification.update({
                            'status': 'off'
                    })
                if delete_message:
                    Queue.delete_message('notifications', notification_raw)

            except Exception, e:
                log('cron3', "Failed. Exception %specified" % e)
        else:
            log('cron3', 'ERROR: No remote url specified', notification_message.get('subscription_id'))
    else:
        log('cron3', "Failed. No notification found in db with id %s" % notification_message.get('notification_id'), notification_message.get('subscription_id'))


if __name__ == '__main__':
    main()        