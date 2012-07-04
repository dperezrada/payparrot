# -*- coding: utf-8 -*-
import bottle

from payparrot_api.libs.mongodb import connect 
from bottle_mongo import MongoPlugin 
from payparrot_api.middlewares.error_handler import ErrorHandler

db = connect('payparrot_test')

# Import controllers
from controllers.accounts import *
from controllers.messages import *
    
bottle.debug(True)

application = bottle.default_app.pop()
plugin = MongoPlugin(uri="mongodb://localhost:27017/", db="payparrot_test", json_mongo=True, keyword='db')
application.install(plugin)
application.catchall = False
application = ErrorHandler(application)
