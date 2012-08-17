from __future__ import absolute_import

from celery import Celery

HOST = 'mongodb://localhost';

celery = Celery(broker = HOST,
                backend = HOST,
                include=['payparrot_scripts.create_messages'])

# Optional configuration, see the application user guide.
celery.conf.update(
    CELERY_TASK_RESULT_EXPIRES=3600,
)
