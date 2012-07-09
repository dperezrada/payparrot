from payparrot_dal.base import BaseModel

class Sessions(BaseModel):
    _meta = {
        'collection': 'sessions',
        'fields': {
            'account_id': {'required': True},
			'oauth_token': {'required': True},
			'oauth_token_secret': {'required': True},
            'external_id': {}
    	}
    }