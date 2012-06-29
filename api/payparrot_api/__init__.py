# -*- coding: utf-8 -*-
import bottle

from mongoengine import connect

from payparrot_api.middlewares.error_handler import ErrorHandler 

connect('payparrot_test')

# Import controllers
from controllers.accounts import *
    
bottle.debug(True)

application = bottle.default_app.pop()
application.catchall = False
application = ErrorHandler(application)
