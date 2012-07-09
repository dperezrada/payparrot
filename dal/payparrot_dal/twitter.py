import urlparse
import oauth2 as oauth
from urllib import urlencode

class Twitter():
	consumer_key = 'lFkPrTmvjcSUD5JtrOvg'
	consumer_secret = 'sCxLuVAd1HnGIjdolKUqAjZaSOO7BGhViD1a7w'
	request_token_url = 'https://api.twitter.com/oauth/request_token?oauth_callback='
	access_token_url = 'https://api.twitter.com/oauth/access_token'
	authorize_url = 'https://api.twitter.com/oauth/authorize'
	oauth_callback = 'http://localhost:8080/parrots/finish'

	def __init__(self):
		self.consumer = oauth.Consumer(self.consumer_key, self.consumer_secret)

	def create_session(self):
		client = oauth.Client(self.consumer)
		return client

	def get_request_token(self,client):
		resp, content = client.request(self.request_token_url+self.oauth_callback, "GET");
		if resp['status'] != '200':
			raise Exception("Invalid response %s." % resp['status'])
		request_token = dict(urlparse.parse_qsl(content))
		return request_token

	def redirect_url(self,request_token):
		return "%s?oauth_token=%s" % (self.authorize_url, request_token['oauth_token'])

	def get_access_tokens(self,oauth_verifier, request_token):
		token = oauth.Token(request_token['oauth_token'],request_token['oauth_token_secret'])
		token.set_verifier(oauth_verifier)
		client = oauth.Client(self.consumer, token)

		resp, content = client.request(self.access_token_url, "POST")
		access_token = dict(urlparse.parse_qsl(content))
		return access_token

	def create_client(self,oauth_token, oauth_token_secret):
		token = oauth.Token(oauth_token, oauth_token_secret)
		self.client = oauth.Client(self.consumer, token)
		return True

	def get(self, url):
		return self.client.request(url)
	
	def post(self, url, body):
		return self.client.request(url, method = 'POST', body=urlencode(body))