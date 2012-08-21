# -*- coding: utf-8 -*-
import json
import os

from boto import config
from boto.sqs.connection import SQSConnection
from boto.sqs.message import Message
from boto.sqs.queue import Queue as AwsQueue

if not config.has_section('Boto'):
    config.add_section('Boto')
config.set('Boto', 'debug', '0')

class Queue(object):
    """docstring for Queue"""
    aws_key = os.environ.get('PAYPARROT_AWS_SQS_KEY')
    aws_secret = os.environ.get('PAYPARROT_AWS_SQS_SECRET')

    
    import logging
    logging.basicConfig(level=logging.ERROR)

    @classmethod
    def get_queue(cls, queue_name):
        queue_url = os.environ.get('PAYPARROT_AWS_SQS_QUEUE_%s' % queue_name.upper())
        if queue_url:
            conn = SQSConnection(cls.aws_key, cls.aws_secret)
            return AwsQueue(connection = conn, url = queue_url)
        else:
            return None

    @classmethod
    def insert(cls, queue_name, json_data):        
        queue = cls.get_queue(queue_name)
        new_message = Message()
        new_message.set_body(json.dumps(json_data))
        return queue.write(new_message)

    @classmethod
    def get_message(cls, queue_name, visibility_timeout = None):
        queue = cls.get_queue(queue_name)
        if visibility_timeout:
            messages = queue.get_messages(visibility_timeout=visibility_timeout)
        else:
            messages = queue.get_messages()
        if len(messages) > 0:
            return messages[0]
        else:
            return None
    
    @classmethod
    def delete_message(cls, queue_name, message):
        queue = cls.get_queue(queue_name)
        return queue.delete_message(message)