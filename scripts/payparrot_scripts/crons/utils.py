import sys
from datetime import datetime

def log(cron, message, id = ''):
	if id:
		id = ' - %s' % id
	print >> sys.stderr, "%s - %s%s - %s" % (datetime.now().isoformat(" ").split(".")[0], cron, id, message)