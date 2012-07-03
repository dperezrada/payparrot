import mongoengine
mongoengine.connect('prueba1')
class MyDocument(object):
	def save(self, *args, **kwargs):
		print "hola"
		super(MyDocument, self).save(*args, **kwargs)

class SomeModel(mongoengine.Document, MyDocument):
	meta = {
		'collection': 'otra'
	}
	def save(self, *args, **kwargs):
		print "chao"
		super(SomeModel, self).save(*args, **kwargs)

a = SomeModel()
a.save()