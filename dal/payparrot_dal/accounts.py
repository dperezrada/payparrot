# from datetime import datetime
# from hashlib import sha256
# from random import random
# from time import time
# 

from payparrot_dal.base import BaseModel
from payparrot_dal.accounts_sessions import AccountsSessions

class Accounts(BaseModel):
    _meta = {
        'collection': 'accounts',
        'fields': {
            'email': {'required': True},
            'name': {'required': True},
            'startup': {'required': True},
            'password': {'required': True},
            'salt': {},
            'url': {'required': True},
            'callback_url': {},
            'notification_url': {},
            'credentials': {'readonly': True},
            'created_at': {'readonly': True, 'private': True},
            'stats': {}
        }
    }
    @staticmethod
    def get_from_session(db, id):
        account_session_dict = AccountsSessions.findOne(db, {'session_id': id})
        if account_session_dict:
            account_dict = Accounts.findOne(db, {'_id': account_session_dict['account_id']})
            if account_dict:
                return Accounts(db, account_dict)

#     def save(self, *args, **kwargs):
#         if not self.id:
#             self.credentials = {
#                 'private_token': sha256(str(random())+'payparrot'+str(time())).hexdigest(),
#                 'public_token': sha256(str(random())+'payparrot'+str(time())).hexdigest()
#             }
#         super(Accounts, self).save(*args, **kwargs)

# Accounts.JSON = JSON
# Accounts.update_with_data = update_with_data
