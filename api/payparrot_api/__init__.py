# -*- coding: utf-8 -*-
import bottle

from payparrot_dal.mongodb import connect
from payparrot_api.middlewares.mongo_auth import MongoPlugin 
from payparrot_api.middlewares.error_handler import ErrorHandler

db = connect('payparrot_test')

# Import controllers
from controllers.accounts import *
from controllers.messages import *
from controllers.parrots import *
from controllers.notifications import *
    
bottle.debug(True)

application = bottle.default_app.pop()

plugin = MongoPlugin(uri="mongodb://localhost:27017/", db="payparrot_test", json_mongo=True, keyword='db')
application.install(plugin)

application.catchall = False
application = ErrorHandler(application)
