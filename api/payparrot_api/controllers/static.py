# -*- coding: utf-8 -*-
import os, sys
from bottle import route, request, response, static_file, SimpleTemplate, template, view, redirect

from payparrot_api.libs.exceptions import UnauthorizeException
from payparrot_dal import Accounts, AccountsSessions

@route('/<path:path>')
def callback(path, db):
    if not path:
        path = 'index.html'
    return static_file(path, os.path.join(os.path.abspath(os.path.dirname(__file__)), '../../../public/'))    