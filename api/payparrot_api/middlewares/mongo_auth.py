from bottle import PluginError, response
from pymongo.cursor import Cursor

import bson.json_util
from bottle import request
from json import dumps as json_dumps
import inspect

from payparrot_api.middlewares.auth import authorize
from payparrot_dal.mongodb import connect

class MongoPlugin(object):
	api  = 2
	
	connection = None
	mongo_db = None
	def get_mongo(self):
		"Retrieve the mongo instance from the environment"
		if self.mongo_db: 
			return self.mongo_db
		self.connection, self.mongo_db = connect()
		return self.mongo_db

	def __init__(self, keyword='db', json_mongo=False,  **kwargs):
		self.keyword = keyword
		self.json_mongo = json_mongo
		self.kwargs = kwargs

	## {{{ http://code.activestate.com/recipes/491272/ (r1)
	def get_arg_default(self, func, arg_name):
		try:
			import inspect
			args, varargs, varkwargs, defaults = inspect.getargspec(func)
			have_defaults = args[-len(defaults):]
		
			if arg_name not in args:
				raise ValueError("Function does not accept arg '%s'" % arg_name)
		
			if arg_name not in have_defaults:
				raise ValueError("Parameter '%s' doesn't have a default value" % arg_name)
		
			return defaults[list(have_defaults).index(arg_name)]
		except:
			return None
	## end of http://code.activestate.com/recipes/491272/ }}}


	def setup(self,app):	
		for other in app.plugins:
			if not isinstance(other,MongoPlugin): continue
			if other.keyword == self.keyword:
				raise PluginError("Found another mongo plugin with "\
						"conflicting settings (non-unique keyword).")

	def apply(self, callback, context):
		args = inspect.getargspec(context.callback)[0]
		secure = self.get_arg_default(context.callback, 'secure')
		def wrapper(*a, **ka):
			if self.keyword in args:
				ka[self.keyword] = self.get_mongo()
			if secure:
				authorize(self.get_mongo())
			return callback(*a, **ka)
		return wrapper