from time import time
import datetime
from random import random
from hashlib import sha512

from payparrot_dal.base import BaseModel

class AccountsSessions(BaseModel):
    _meta = {
        'collection': 'accounts_sessions',
        'fields': {
            'session_id': {'readonly': True, 'default': sha512("salt session de payparrot"+repr(time())+str(random())).hexdigest()},
            'expires': {'readonly': True, 'default': (datetime.datetime.now() + datetime.timedelta(1*365/12))},
            'account_id': {'required': True}
        }
    }