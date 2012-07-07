from time import time
import datetime
from random import random
from hashlib import sha512

from payparrot_dal.base import BaseModel

class Messages(BaseModel):
    _meta = {
        'collection': 'messages',
        'fields': {
            'account_id': {'required': True},
			'text': {'required': True},
			'url': {'required': True},
			'status': {'required': True},
			'active': {'default': True}
    	}
    }