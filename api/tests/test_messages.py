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
        self.account_id = self.response.json.get('id')
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
            self.responses.append(app.post_json('/accounts/'+str(self.account_id)+'/messages', message))
    def tearDown(self):
        Accounts.drop_collection()
        Messages.drop_collection()
        AccountsSessions.drop_collection()
        app.get('/logout')
        
    def test_create_status(self):
        self.assertEqual(201, self.responses[0].status_int)
     
    def test_get_object_id(self):
        message_id = self.responses[0].json.get('id')
        self.assertTrue(message_id)
    
    def test_get_message(self):
        message_id = self.responses[0].json.get('id')
        message = app.get('/accounts/%s/messages/%s' % (self.account_id, message_id)).json
        self.assertEqual(self.messages[0].get('url'), message.get('url'))
        self.assertEqual(self.messages[0].get('text'), message.get('text'))

    def test_update_message(self):
        message_id = self.responses[0].json.get('id')
        message_to_update = {
            'active': False
        }
        message = app.put_json('/accounts/%s/messages/%s' % (str(self.account_id), str(message_id)), message_to_update)
        self.assertEqual(204, message.status_int)





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