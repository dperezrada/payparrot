# -*- coding: utf-8 -*-

from pymongo import Connection
def connect(database):
    connection = Connection()
    return connection[database]