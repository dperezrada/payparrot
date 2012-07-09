import unittest

class TestCron4(unittest.TestCase):
    def test_cron4(self):
        from payparrot_scripts.crons.cron4 import main as cron4
        cron4()