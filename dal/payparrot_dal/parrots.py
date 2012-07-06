from datetime import datetime
from payparrot_dal.base import BaseModel

class Parrots(BaseModel):
    _meta = {
        'collection': 'parrots',
        'fields': {
            'twitter_id': {'required': True},
			'oauth_token': {'required': True},
			'oauth_token_secret': {'required': True},
			'created_at': {'default': datetime.now, 'readonly': True, 'private': True},
			'twitter_info': {'default': {}},
			'payments': {'default': []},
    	}
    }