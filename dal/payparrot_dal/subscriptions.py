from datetime import datetime

from payparrot_dal.base import BaseModel

class Subscriptions(BaseModel):
    _meta = {
        'collection': 'subscriptions',
        'fields': {
            'account_id': {'required': True},
            'subscription_id': {'required': True},
			'parrot_id': {'required': True},
			'active': {'required': True},
            'notified': {'default': False, 'private': True},
            'first_tweet': {'private': True, 'default': False},
            'created_at': {'default': datetime.now},
            'external_id': {},
            'twitter_screen_name': {'default':'','required': True}
    	}
    }