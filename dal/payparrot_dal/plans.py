from datetime import datetime
from hashlib import sha256
from random import random
from time import time

from payparrot_dal.base import BaseModel

class Plans(BaseModel):
    _meta = {
        'collection': 'plans',
        'fields': {
            'name': {'required': True},
            'price': {},
            'parrots': {},
            'product_url': {},
            'product_path': {},
            'created_at': {'private': True, 'default': datetime.now}
        }
    }