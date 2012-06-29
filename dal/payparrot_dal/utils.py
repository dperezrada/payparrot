import json
from bson.objectid import ObjectId

def JSON(self):
    prepared_json = {}
    for key, value in self._fields.iteritems():
        if key not in self.meta.get('private', []):
            prepared_json[key] = self.__getattribute__(key)
            if type(prepared_json[key]) == ObjectId:
                prepared_json[key] = str(prepared_json[key])
    return prepared_json

def update_with_data(self, json):
    for key, value in json.iteritems():
        self.__setattr__(key, value)
    self.save()
        