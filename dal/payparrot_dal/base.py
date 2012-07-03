from bson.objectid import ObjectId

class BaseModel(object):
	def __init__(self, db, data):
		self.db = db
		self._data = data


	def __getattr__(self, key):
		if key != '_data':
			return self._data.get(key)

	# def __setattr__(self, key, value):
	# 	if key not in ['_data', '_meta']:
	# 		self._data[key] = value

	def insert(self):
		self.db[self._meta['collection']].insert(self._data)
		self._data['id'] = self._data['_id']
		del self._data['_id']

	def update(self, data):
		self.db[self._meta['collection']].update({'_id': ObjectId(self._data['id'])}, {'$set': data})
		for key, value in data.iteritems():
			self._data[key] = value