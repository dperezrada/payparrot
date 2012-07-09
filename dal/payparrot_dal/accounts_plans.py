from datetime import datetime
from hashlib import sha256
from random import random
from time import time

from payparrot_dal.base import BaseModel

class AccountsPlans(BaseModel):
    _meta = {
        'collection': 'accounts_plans',
        'fields': {
            'name': {'required': True},
            'price': {},
            'parrots': {},
            'account_id': {},
            'active': {'default': True, 'private': True},
            'created_at': {'private': True, 'default':datetime.now}
        }
    }

    def disable(self):
        self.update({'active': False})

    @classmethod 
    def create_from_plan(self,db,account,new_plan):
        if new_plan['id']:
            del new_plan['id']
        new_plan['active'] = True
        new_plan['account_id'] = account.get("id")
        new_account_plan = AccountsPlans(db, new_plan)
        new_account_plan.insert()
        return new_account_plan
