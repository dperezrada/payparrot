from bson.objectid import ObjectId

def update_id(data):
    if data.get('id'):
        data['id'] = ObjectId(data['id'])
    if data.get('_id'):
        data['id'] = ObjectId(data['_id'])
        del data['_id']

class BaseModel(object):
    def __init__(self, db, data):
        self.db = db
        update_id(data)
        self._data = data
        self._meta['private'] = []
        self._meta['required'] = []
        self._meta['readonly'] = []
        for key, value in self._meta['fields'].iteritems():
            if value.get('private'):
                self._meta['private'].append(key)
            if value.get('required'):
                self._meta['required'].append(key)
            if value.get('readonly'):
                self._meta['readonly'].append(key)
            if value.get('default'):
                self._data[key] = value.get('default')

    def __getattr__(self, key):
        if key != '_data' and key != '_meta':
            return self._data.get(key)

    # def __setattr__(self, key, value):
    #     if key not in ['_data', '_meta']:
    #         self._data[key] = value

    def insert(self, safe = True):
        self.db[self._meta['collection']].insert(self._data, safe = safe)
        update_id(self._data)

    def update(self, data, safe = True):
        to_update_data = {}
        self._remove_readonly(data)
        self.db[self._meta['collection']].update({'_id': ObjectId(self._data['id'])}, {'$set': data}, safe = safe)
        self._data.update(data)
    
    def _remove_readonly(self, data):
        for key in data.keys():
            if key in self._meta['readonly']:
                del data[key]
    
    @classmethod
    def find(cls, db, *args, **kwargs):
        return db[cls._meta['collection']].find(*args, **kwargs)

    @classmethod
    def findOne(cls, db, *args, **kwargs):
        return db[cls._meta['collection']].find_one(*args, **kwargs)
        