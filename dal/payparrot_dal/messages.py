from time import time
import datetime
from random import random
from hashlib import sha512
from bson.objectid import ObjectId

from payparrot_dal.base import BaseModel

class Messages(BaseModel):
    _meta = {
        'collection': 'messages',
        'fields': {
            'account_id': {'required': True, 'type': ObjectId},
			'text': {'required': True},
			'url': {'required': True},
			'status': {'required': True, 'default':True},
			'active': {'default': True}
    	}
    }