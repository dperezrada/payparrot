import datetime
import time
import random
from hashlib import sha512

from mongoengine import StringField, DateTimeField, DictField, ObjectIdField

from mongoengine import Document

class AccountsSessions(Document):
    session_id = StringField(required=True, default= sha512("salt session de payparrot"+repr(time.time())+str(random.random())).hexdigest())
    expires = DateTimeField(default=(datetime.datetime.now() + datetime.timedelta(1*365/12)))
    account_id = ObjectIdField()