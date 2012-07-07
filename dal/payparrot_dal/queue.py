# -*- coding: utf-8 -*-
import json

from boto.sqs.connection import SQSConnection
from boto.sqs.message import Message
from boto.sqs.queue import Queue

class Queue(object):
    """docstring for Queue"""
    aws_key = 'AKIAIN47MW5VQ4RBN7TQ'
    aws_secret = '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'
    
    @classmethod
    def insert(cls, queue_name, json_data):        
        conn = SQSConnection(cls.aws_key, cls.aws_secret)
        queue = conn.get_queue(queue_name)
        new_message = Message()
        new_message.set_body(json.dumps(json_data))
        return queue.write(new_message)