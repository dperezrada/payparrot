# -*- coding: utf-8 -*-
import json

from boto import config
from boto.sqs.connection import SQSConnection
from boto.sqs.message import Message
from boto.sqs.queue import Queue

if not config.has_section('Boto'):
    config.add_section('Boto')
    config.set('Boto', 'debug', '0')

class Queue(object):
    """docstring for Queue"""
    aws_key = 'AKIAIN47MW5VQ4RBN7TQ'
    aws_secret = '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'
    
    import logging
    logging.basicConfig(level=logging.ERROR)


    @classmethod
    def get_queue(cls, queue_name):
        conn = SQSConnection(cls.aws_key, cls.aws_secret)
        return conn.get_queue(queue_name)

    @classmethod
    def insert(cls, queue_name, json_data):        
        queue = cls.get_queue(queue_name)
        new_message = Message()
        new_message.set_body(json.dumps(json_data))
        return queue.write(new_message)

    @classmethod
    def get_message(cls, queue_name):
        queue = cls.get_queue(queue_name)
        messages = queue.get_messages()
        if len(messages) > 0:
            return messages[0]
    
    @classmethod
    def delete_message(cls, queue_name, message):
        queue = cls.get_queue(queue_name)
        return queue.delete_message(message)