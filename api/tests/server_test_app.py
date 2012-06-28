import os
import sys

from webtest import TestApp
from payparrot_api import application

app = TestApp(application)