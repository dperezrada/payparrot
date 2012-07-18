# -*- coding: utf-8 -*-
import os
import re

from pymongo import ReplicaSetConnection, Connection
from pymongo import ReadPreference

def get_dbs_keys():
    compiledRegex = re.compile(r'(PAYPARROT_DB[0-9]+)')
    return filter(compiledRegex.match, os.environ.keys())

def get_dbs_uris(dbs_keys):
    concat_dbs =""
    sep = ""
    for db_key in dbs_keys:
        db_uri = os.environ.get(db_key)
        if db_uri:
            concat_dbs += sep+db_uri
            sep = ","
    return "mongodb://%s" % concat_dbs

def connect():
    db_keys = get_dbs_keys()
    db_keys.sort()
    replica_set = os.environ.get('PAYPARROT_DB_REPLICA_SET')
    if replica_set:
        connection = ReplicaSetConnection(get_dbs_uris(db_keys), replicaSet = replica_set, read_preference = ReadPreference.SECONDARY)
    else:
        connection = Connection(host = get_dbs_uris(db_keys[0:1]))
    db = connection[os.environ.get("PAYPARROT_DB_NAME")]
    return db