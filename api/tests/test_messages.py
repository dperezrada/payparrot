# -*- coding: utf-8 -*-
import os
import json
import unittest

from server_test_app import app
from payparrot_dal import Accounts, AccountsSessions, Messages

class TestCreateMessages(unittest.TestCase):
    def setUp(self):
        from mongoengine import connect
        connect('payparrot_test')
        self.account_data = {
            'email': 'daniel@payparrot.com',
            'password': '123',
            'name': 'Daniel',
            'startup': 'Payparrot',
            'url': 'http://payparrot.com/',
            'callback_url': 'http://demo.payparrot.com',
            'notification_url': 'http://demo.payparrot.com/notifications'
        }
        self.response = app.post_json('/accounts', self.account_data)
        app.post_json('/login',
            {'email': self.account_data['email'], 'password': self.account_data['password']}
        )
        self.messages = [
            {
                'text': 'Este es el mensaje de prueba de dperezrada y gmedel',
                'url' : 'http://www.test.com'
            },
            {
                'text': 'Este es el mensaje de prueba de dperezrada y gmedel 2',
                'url' : 'http://www.test2.com'
            }
        ]
        self.responses = []
        for i, message in enumerate(self.messages):
            self.responses[i] = app.post_json('/accounts/'+str(self.response.json['id'])+'/messages', message)
            print message
        print self.responses
    def tearDown(self):
        Accounts.drop_collection()
        Messages.drop_collection()
        
    def test_create_status(self):
        self.assertEqual(201, self.responses[0].response.status_int)
     
    # def test_get_object_id(self):
    #     account_id = self.response.json.get('id')
    #     self.assertTrue(account_id)
    # 
    # def test_get_saved_account(self):
    #     account_id = self.response.json.get('id')
    #     expected_json = {
    #         'id': account_id,
    #         'email': 'daniel@payparrot.com',
    #         'name': 'Daniel',
    #         'startup': 'Payparrot',
    #         'url': 'http://payparrot.com/',
    #         'callback_url': 'http://demo.payparrot.com',
    #         'notification_url': 'http://demo.payparrot.com/notifications',
    #         'stats': {
    #           'parrots_total': 0,
    #           'parrots_today': 0,
    #           'payments_total': 0,
    #           'payments_today': 0
    #         },
    #     }
    #     accounts = Accounts.objects(id = account_id)
    #     self.assertEqual(expected_json, accounts[0].JSON())





# 
# 
# 
# 
# 
# var request = require('request'),
#   assert = require('assert'),
#   _ = require('underscore');
# 
# describe('POST /accounts/:id/messages', function(){
#   var self;
#   before(function(done){
#       self = this;
#       self.account = {
#           'email': 'daniel@payparrots.com',
#           'password': '123',
#           'name': 'Daniel',
#           'startup': 'Payparrot',
#           'url': 'http://payparrot.com/',
#       }
#       self.messages = [
#           {
#               'text': 'Este es el mensaje de prueba de dperezrada y gmedel',
#               'url' : 'http://www.test.com'
#           },
#           {
#               'text': 'Este es el mensaje de prueba de dperezrada y gmedel 2',
#               'url' : 'http://www.test2.com'
#           }               
#       ]
#       request.post({url: 'http://localhost:3000/accounts', json: self.account}, function (e, r, body) {
#           assert.equal(201, r.statusCode);
#           self.account.id = r.body.id;
#           delete self.account.password;
#           request.post(
#               {
#                   url: 'http://localhost:3000/login',
#                   json: {
#                       'email': 'daniel@payparrots.com',
#                       'password': '123'
#                   },
#                   followRedirect: false
#               },
#               function (e, r, body) {
#                   assert.equal(302, r.statusCode);
#                   assert.equal('http://localhost:3000/logged', r.headers.location);
#                   request.post(
#                       {
#                           url: 'http://localhost:3000/accounts/'+self.account.id+'/messages',
#                           json: self.messages[0]
#                       },
#                       function (e, r, body) {
#                           assert.equal(201, r.statusCode);
#                           self.messages[0].id = r.body.id;
#                           self.messages[0].status = true;
#                           self.messages[0].active = true;
#                           request.post(
#                           {
#                               url: 'http://localhost:3000/accounts/'+self.account.id+'/messages',
#                               json: self.messages[1]
#                           },
#                           function (e, r, body) {
#                               assert.equal(201, r.statusCode);
#                               self.messages[1].id = r.body.id;
#                               self.messages[1].status = true;
#                               self.messages[1].active = true;
#                               done();
#                           });
#                       }
#                   );
#               }
#           );
#       });
#   });
#   after(function(done){
#       require('../../../tear_down').remove_all(done);
#   });
#   it('should create a new message', function(done){
#       request.get({
#                       url: 'http://localhost:3000/accounts/'+self.account.id+'/messages/'+self.messages[0].id
#                   }, 
#                   function (e, r, body){
#                       assert.equal(200,r.statusCode);
#                       assert.deepEqual(self.messages[0], JSON.parse(r.body));
#                       done();
#                   }
#               );
#   });
#   it('should get the correct message', function(done){
#       request.get({
#                       url: 'http://localhost:3000/accounts/'+self.account.id+'/messages/'+self.messages[1].id
#                   }, 
#                   function (e, r, body){
#                       assert.equal(200,r.statusCode);
#                       assert.deepEqual(self.messages[1], JSON.parse(r.body));
#                       done();
#                   }
#               );
#   });
# });