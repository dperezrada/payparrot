from datetime import datetime

from mongoengine import StringField, DateTimeField, DictField

from payparrot_dal.base import BaseDocument
from payparrot_dal.accounts_sessions import AccountsSessions

class Accounts(BaseDocument):
    email = StringField(required=True)
    name = StringField(required=True)
    startup = StringField(required=True)
    password = StringField()
    salt = StringField()
    url = StringField()
    callback_url = StringField()
    notification_url = StringField()
    credentials = DictField()
    created_at = DateTimeField(default=datetime.now)
    stats = DictField(default = {
		'parrots_total': 0,
		'parrots_today': 0,
		'payments_total': 0,
		'payments_today': 0
	})
    
    meta = {
        'private': ['created_at', 'password', 'salt', 'credentials']
    }
    
    @staticmethod
    def get_from_session(id):
        accounts_sessions = AccountsSessions.objects(session_id = id).limit(1)
        if len(accounts_sessions) > 0:
            accounts = Accounts.objects(id = accounts_sessions[0].account_id).limit(1)
            if len(accounts) > 0:
                return accounts[0]