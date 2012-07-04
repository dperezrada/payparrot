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
            if self._data.get(key) is None and value.get('default') is not None:
                self._data[key] = value.get('default')

    def __getattr__(self, key):
        if key != '_data' and key != '_meta':
            return self._data.get(key)

    # def __setattr__(self, key, value):
    #     if key not in ['_data', '_meta']:
    #         self._data[key] = value

    def insert(self, safe = True):
        self._remove_readonly(self._data)
        for key, value in self._meta['fields'].iteritems():
            if self._data.get(key) is None and value.get('default') is not None:
                self._data[key] = value.get('default')
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

    def JSON(self):
        prepared_json = {}
        private = []
        if hasattr(self, '_meta'):
            private = self._meta.get('private', [])
        for key, value in self._meta.get('fields',{}).iteritems():
            if key not in private:
                prepared_json[key] = self._data.get(key)
                if type(prepared_json[key]) == ObjectId:
                    prepared_json[key] = str(prepared_json[key])
        if self._data.get('id'):
            prepared_json['id'] = str(self._data.get('id'))
        return prepared_json
    
    @classmethod
    def find(cls, db, *args, **kwargs):
        return db[cls._meta['collection']].find(*args, **kwargs)

    @classmethod
    def findOne(cls, db, *args, **kwargs):
        if type(args[0]) == str:
            args = list(args);
            args[0] = ObjectId(args[0])
        result = db[cls._meta['collection']].find_one(*args, **kwargs)
        if result:
            return cls(db, result)

    def refresh(self):
        data = db[cls._meta['collection']].find_one({'_id': self.id})
        if data:
            self._data = data