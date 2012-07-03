from datetime import datetime
from hashlib import sha256
from random import random
from time import time

from payparrot_dal.base import BaseModel
from payparrot_dal.utils import JSON, update_with_data
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
    # email = StringField(required=True)
    # name = StringField(required=True)
    # startup = StringField(required=True)
    # password = StringField()
    # salt = StringField()
    # url = StringField()
    # callback_url = StringField()
    # notification_url = StringField()
    # credentials = DictField()
    # created_at = DateTimeField(default=datetime.now)
    # stats = DictField(default = {
    # 	'parrots_total': 0,
    # 	'parrots_today': 0,
    # 	'payments_total': 0,
    # 	'payments_today': 0
    # })
    # roles = ListField()
    # meta = {
    #     'private': ['created_at', 'password', 'salt', 'credentials', 'roles']
    # }
    
#     @staticmethod
#     def get_from_session(id):
#         accounts_sessions = AccountsSessions.objects(session_id = id).limit(1)
#         if len(accounts_sessions) > 0:
#             accounts = Accounts.objects(id = accounts_sessions[0].account_id).limit(1)
#             if len(accounts) > 0:
#                 return accounts[0]

#     def save(self, *args, **kwargs):
#         if not self.id:
#             self.credentials = {
#                 'private_token': sha256(str(random())+'payparrot'+str(time())).hexdigest(),
#                 'public_token': sha256(str(random())+'payparrot'+str(time())).hexdigest()
#             }
#         super(Accounts, self).save(*args, **kwargs)

# Accounts.JSON = JSON
# Accounts.update_with_data = update_with_data
