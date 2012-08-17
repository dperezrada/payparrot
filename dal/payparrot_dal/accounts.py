from datetime import datetime
from hashlib import sha256
from random import random
from time import time

from payparrot_dal.base import BaseModel
from payparrot_dal.accounts_sessions import AccountsSessions

class Accounts(BaseModel):
    _meta = {
        'collection': 'accounts',
        'fields': {
            'email': {'required': True},
            'name': {'required': True},
            'startup': {'required': True},
            'password': {'required': True, 'private': True},
            'salt': {'private': True, 'default': lambda: str(random())},
            'url': {'required': True},
            'callback_url': {},
            'notification_url': {},
            'notification_active': {'default': False},
            'credentials': {
                'readonly': True,
                'private': True,
                'default': lambda: {
                    'private_token': sha256(str(random())+'payparrot'+str(time())).hexdigest(),
                    'public_token': sha256(str(random())+'payparrot'+str(time())).hexdigest()
                }                
            },
            'created_at': {'readonly': True, 'private': True},
            'stats': {'default': {}},
            'setup': {'private': True, 'default': False},
            'subscriptions': {'private': True, 'default': False}
        }
    }
    @staticmethod
    def get_from_session(db, id):
        account_session = AccountsSessions.findOne(db, {'session_id': id})
        if account_session:
            account = Accounts.findOne(db, account_session.account_id)
            if account:
                return account
