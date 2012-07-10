# -*- coding: utf-8 -*-
import os

from pymongo import Connection

def connect():
	auth = ''
	if os.environ.get("PAYPARROT_DB_USER"):
		auth = "%(user)s:%(pass)s@"
	db_uri = "mongodb://%(auth)s%(host)s:%(port)s" % {
		'auth': auth,
		'host': os.environ.get("PAYPARROT_DB_HOST"),
		'port': os.environ.get("PAYPARROT_DB_PORT")
	}
	connection = Connection(host=db_uri)
	return connection[os.environ.get("PAYPARROT_DB_NAME")]