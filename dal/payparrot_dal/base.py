import json

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
        return json.dumps(prepared_json)