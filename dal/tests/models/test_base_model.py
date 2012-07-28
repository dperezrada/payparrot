# -*- coding: utf-8 -*-
import unittest
import json
from bson.objectid import ObjectId
from datetime import datetime

import payparrot_tests as pp_tests
from payparrot_dal.base import BaseModel
from payparrot_dal import Accounts

class Movies(BaseModel):
    _meta = {
        'collection': 'movies',
        'fields': {
            'title': {'required': True},
            'account_id': {'type': ObjectId},
            'rating': {},
            'date_added': {'readonly': True, 'default': 123},
            'dates': {}
        }
    }

class TestBase(unittest.TestCase):
    def setUp(self):
        self.connection, self.db = pp_tests.connect_to_mongo()

        self.movie_data = {
            'title': 'The Matrix',
            'rating': '9.5',
            'dates':[
                {
                    'release': datetime.now(),
                    'data_id': ObjectId()
                }
            ]
        }
        self.movie = Movies(self.db, self.movie_data)
    
    def tearDown(self):
        self.db.movies.drop()
        self.connection.close()

    def test_default_value(self):
        self.movie.insert()
        self.assertEqual(123, self.movie.date_added)

    def test_readonly(self):
        self.movie.insert()
        self.movie.update({'date_added': 456})
        self.assertEqual(123, self.movie.date_added)
    
    def test_type(self):
        self.movie.insert()
        account_id = ObjectId()
        self.movie.update({'account_id': str(account_id)})
        self.movie.refresh()
        self.assertEqual(account_id, self.movie.account_id)
        
    def test_update_doesnt_store_id(self):
        self.movie.insert()
        account_id = ObjectId()
        self.movie.update({'account_id': str(account_id), 'id': 'hola'})
        movie_from_db = self.db.movies.find_one({'_id': self.movie.id})
        self.assertEqual(None, movie_from_db.get('id'))

    def test_shouldnt_store_not_defined_attributes(self):
        self.movie.insert()
        account_id = ObjectId()
        self.movie.update({'account_id': str(account_id), 'another_thing': 'hola'})
        movie_from_db = self.db.movies.find_one({'_id': self.movie.id})
        self.assertEqual(None, movie_from_db.get('another_thing'))
        
    def test_to_json(self):
        self.movie.insert()
        expected = {
            'id': str(self.movie.id),
            'title': 'The Matrix',
            'rating': '9.5',
            'account_id': None,
            'date_added': 123,
            'dates':[
                {
                    'release': self.movie_data.get('dates', [{}])[0].get('release').isoformat(" ").split(".")[0],
                    'data_id': str(self.movie_data.get('dates', [{}])[0].get('data_id'))
                }
            ]
        }
        received = self.movie.JSON()
        self.assertEqual(expected, received)
        
