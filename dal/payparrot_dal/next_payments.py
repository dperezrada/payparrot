# -*- coding: utf-8 -*-
from datetime import datetime
from payparrot_dal.base import BaseModel

class NextPayments(BaseModel):
    _meta = {
        'collection': 'next_payments',
        'fields': {
            'parrot_id': {'required': True},
            'account_id': {'required': True},
            'action_date': {'required': True}
        }
    }