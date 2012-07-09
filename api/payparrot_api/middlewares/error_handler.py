# -*- coding: utf-8 -*-
import sys
import traceback

from payparrot_api.libs.exceptions import UnauthorizeException

# To Handle middleware exceptions
class ErrorHandler(object):
    def __init__(self, app, production=False):
        self.app = app

    def __call__(self, environ, start_response):
        try:
            return self.app(environ, start_response)
        except UnauthorizeException, e:
            start_response(
                '401 Unauthorized', 
                [
                    ('Cache-control', 'no-cache'),
                    ('Content-Type', 'application/json')
                ]
            )
            return ['{"error": "Unauthorized"}']
        except Exception, e:
            print >> sys.stderr, e
            traceback.print_exc(file=sys.stderr)
            start_response(
                '500 Internal Server Error', 
                [
                    ('Cache-control', 'no-cache'),
                    ('Content-Type', 'application/json')
                ]
            )
            return ['{"error": "Internal Server Error"}']
