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


# 
# meta = {
#     'private': ['created_at', 'password', 'salt', 'credentials']
# }
# 
# # If new session
# if not string_cookie:
#    # The sid will be a hash of the server time
#    sid = sha.new(repr(time.time())).hexdigest()
#    # Set the sid in the cookie
#    cookie['sid'] = sid
#    # Will expire in a year
#    cookie['sid']['expires'] = 12 * 30 * 24 * 60 * 60
# # If already existent session
# else:
#    cookie.load(string_cookie)
#    sid = cookie['sid'].value
# 
# 
#   "_id" : "qnEpBvprFsS5YCIEJGHvMNm8.QXebgOWwpKrzxQvMgtxoSqfRgjIk/3L+8lwhyNPp9S4",
#   "session" : "{\"lastAccess\":1339185650828,\"cookie\":{\"originalMaxAge\":14400000,\"expires\":\"2012-06-09T00:00:50.856Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{}}",
#   "expires" : ISODate("2012-06-09T00:00:50.856Z")
# }
# 
# 
# 