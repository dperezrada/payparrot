# -*- coding: utf-8 -*-

from pymongo import Connection
def connect_to_mongo():
    connection = Connection()
    return connection['payparrot_test']