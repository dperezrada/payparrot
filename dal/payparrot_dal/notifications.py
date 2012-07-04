from datetime import datetime

from boto.sqs.connection import SQSConnection
from boto.sqs.message import Message
from boto.sqs.queue import Queue

from payparrot_dal.base import BaseModel

class Notifications(BaseModel):
    _meta = {
        'collection': 'sessions',
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
            'created_at': {'default': datetime.now()}
    	}
    }

    def insert(self, safe = True):
        super(Notifications, self).insert(safe)
        conn = SQSConnection('AKIAJ3K3RPWKT6EPASFAv', 'NI24owBHKlFQKyBjZVKRw0SMnv4fXSLM8kPA8H')
        queue = Queue(conn, 'https://queue.amazonaws.com/229116634218/notifications_test')
        m = Message()
        m.set_body({'suscription_id': self.suscription_id, 'account_id': self.account_id, 'parrot_id': self.parrot_id, 'type': self.type, 'notification_id': self.id})
        status = queue.write(m)
        print "CREAMOS NOTIFICAIONs"
        print status