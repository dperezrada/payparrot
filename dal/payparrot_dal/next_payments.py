# -*- coding: utf-8 -*-
from datetime import datetime
from bson.objectid import ObjectId

from payparrot_dal.base import BaseModel

class NextPayments(BaseModel):
    _meta = {
        'collection': 'next_payments',
        'fields': {
            'parrot_id': {'required': True, 'type': ObjectId},
            'account_id': {'required': True, 'type': ObjectId},
            'action_date': {'required': True, 'type': ObjectId}
        }
    }