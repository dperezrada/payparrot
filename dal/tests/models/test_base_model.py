# -*- coding: utf-8 -*-
import unittest
import json

import utils
from payparrot_dal.base import BaseModel
from payparrot_dal import Accounts

class Movies(BaseModel):
    _meta = {
        'collection': 'movies',
        'fields': {
            'title': {'required': True},
            'rating': {},
            'date_added': {'readonly': True, 'default': 123}
        }
    }

class TestBase(unittest.TestCase):
    def setUp(self):
        self.db = utils.connect_to_mongo()

        self.movie_data = {
            'title': 'The Matrix',
            'rating': '9.5'
        }
        self.movie = Movies(self.db, self.movie_data)
    
    def tearDown(self):
        self.db.accounts.drop()

    def test_default_value(self):
        self.movie.insert()
        self.assertEqual(123, self.movie.date_added)

    def test_readonly(self):
        self.movie.insert()
        self.movie.update({'date_added': 456})
        self.assertEqual(123, self.movie.date_added)