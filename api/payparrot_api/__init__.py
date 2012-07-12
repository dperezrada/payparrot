# -*- coding: utf-8 -*-
import os, sys

import bottle

from payparrot_api.middlewares.mongo_auth import MongoPlugin 
from payparrot_api.middlewares.error_handler import ErrorHandler

# Import controllers
from controllers.accounts import *
from controllers.messages import *
from controllers.parrots import *
from controllers.notifications import *
from controllers.plans import *
from controllers.static import *

if os.environ.get('PAYPARROT_ENV','') != "PRODUCTION":
	bottle.debug(True)
bottle.TEMPLATE_PATH = [os.path.join(os.path.abspath(os.path.dirname(__file__)), './views')]
application = bottle.default_app()

plugin = MongoPlugin()
try:
    application.install(plugin)
except:
    pass

application.catchall = False
application = ErrorHandler(application)

if __name__ == '__main__':
    bottle.TEMPLATE_PATH = [os.path.join(os.path.abspath(os.path.dirname(__file__)), './views')]
    bottle.run(application, host='0.0.0.0', port=os.environ.get('PAYPARROT_API_PORT'), reloader = os.environ.get('PAYPARROT_API_RELOADER'))