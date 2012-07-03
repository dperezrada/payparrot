import json
from bson.objectid import ObjectId

def JSON(self):
    prepared_json = {}
    private = []
    if hasattr(self, 'meta'):
        private = self.meta.get('private', [])
    for key, value in self._fields.iteritems():
        if key not in private:
            prepared_json[key] = self.__getattribute__(key)
            if type(prepared_json[key]) == ObjectId:
                prepared_json[key] = str(prepared_json[key])
    return prepared_json

def update_with_data(self, json):
    readonly = []
    class_keys = self._fields.keys()
    if hasattr(self, 'meta'):
        readonly = self.meta.get('readonly', [])
    for key, value in json.iteritems():
        if key not in readonly and key in class_keys:
            self.__setattr__(key, value)
    self.save()