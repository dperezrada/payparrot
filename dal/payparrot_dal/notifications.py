import json
from datetime import datetime
from bson.objectid import ObjectId

from payparrot_dal.queue import Queue
from payparrot_dal.base import BaseModel

class Notifications(BaseModel):
    _meta = {
        'collection': 'notifications',
        'fields': {
            'subscription_id': {'required': True, 'type': ObjectId},
            'account_id': {'required': True, 'type': ObjectId},
            'external_id': {},
            'parrot_id': {'required': True, 'type': ObjectId},
            'request_url': {'required': True},
            'response_status': {},
            'response_headers': {},
            'response_body': {},
            'status': {},
            'type': {},
            'queue_message_id': {},
            'created_at': {'default': datetime.now, 'private': True}
        }
    }

    def insert(self, safe = True):
        super(Notifications, self).insert(safe)
        created_message = Queue.insert(
            'notifications', 
            {
                'subscription_id': str(self.subscription_id),
                'account_id': str(self.account_id),
                'parrot_id': str(self.parrot_id),
                'type': self.type,
                'notification_id': str(self.id)
            }
        )
        self.update({'queue_message_id': created_message.id})