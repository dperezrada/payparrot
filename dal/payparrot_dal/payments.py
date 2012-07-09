# -*- coding: utf-8 -*-
from datetime import datetime
from payparrot_dal.base import BaseModel

class Payments(BaseModel):
    _meta = {
        'collection': 'payments',
        'fields': {
            'success': {'required': True},
            'twitter_response': {'private': True},
            'account_id': {},
            'action_date': {},
            'created_at': {'default': datetime.now, 'readonly': True, 'private': True},
            'parrot_id': {},
            'message_id': {},
            'message_id_sqs': {},
            'callback_url': {}
        }
    }