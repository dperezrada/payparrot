import json
from datetime import datetime

from boto.sqs.connection import SQSConnection
from boto.sqs.message import Message
from boto.sqs.queue import Queue

from payparrot_dal.base import BaseModel

class Notifications(BaseModel):
    _meta = {
        'collection': 'notifications',
        'fields': {
            'subscription_id': {'required': True},
			'account_id': {'required': True},
            'external_id': {},
			'parrot_id': {'required': True},
            'request_url': {'required': True},
            'response_status': {},
            'response_headers': {},
            'response_body': {},
            'status': {},
            'type': {},
            'queue_message_id': {},
            'created_at': {'default': datetime.now}
    	}
    }

    def insert(self, safe = True):
        conn = SQSConnection('AKIAIN47MW5VQ4RBN7TQ', 'SThKjV6E8RMKNLdkHaeq4bj7QiDTu6NWGMSUOTCx')
        queue = conn.get_queue('notifications_test')
        m = Message()
        m.set_body(json.dumps({'suscription_id': str(self.suscription_id), 'account_id': str(self.account_id), 'parrot_id': str(self.parrot_id), 'type': self.type, 'notification_id': str(self.id)}))
        created_message = queue.write(m)
        print "CREAMOS NOTIFICAIONS"
        self._data['queue_message_id'] = created_message.id
        super(Notifications, self).insert(safe)