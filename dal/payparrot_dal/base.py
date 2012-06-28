import json
from bson.objectid import ObjectId

from mongoengine import Document

class BaseDocument(Document):
    meta = {
        'allow_inheritance': True
    }
    def JSON(self):
        prepared_json = {}
        for key, value in self._fields.iteritems():
            if key not in self.meta.get('private', []):
                prepared_json[key] = self.__getattribute__(key)
                if type(prepared_json[key]) == ObjectId:
                    prepared_json[key] = str(prepared_json[key])
        return json.dumps(prepared_json)