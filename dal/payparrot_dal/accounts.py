from datetime import datetime

from mongoengine import StringField, DateTimeField, DictField

from payparrot_dal.base import BaseDocument

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
    stats = DictField()
    
    meta = {
        'private': ['created_at', 'password', 'salt']
    }