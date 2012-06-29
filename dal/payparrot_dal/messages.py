from datetime import datetime

from mongoengine import Document, StringField, DateTimeField, DictField, ListField, ObjectIdField, BooleanField

from payparrot_dal.utils import JSON, update_with_data

class Messages(Document):
    text = StringField(required=True)
    url = StringField(required=True)
    id = StringField(required=True)
    account_id = ObjectIdField()
    status = BooleanField()
    active = BooleanField()

Messages.JSON = JSON
Messages.update_with_data = update_with_data
