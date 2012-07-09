import Cookie

from bottle import request, response

from payparrot_dal import Accounts
from payparrot_api.libs.exceptions import UnauthorizeException

def get_session_id():
    cookies = request.headers.get('Cookie', '')
    cookies = Cookie.SimpleCookie(cookies)
    key = 'sid'
    if key in cookies:
        return cookies[key].value
    return ''

def get_account(db):
    session_id = get_session_id()
    request.account = None
    if session_id:
        request.account = Accounts.get_from_session(db, session_id)
    

def authorize(db, *allowed_roles):
    allow = False
    get_account(db)
    if request.account:
        if len(allowed_roles) > 0:
            if len(set(request.account.roles).intersection(set(allowed_roles))) > 0:
                allow = True
        else:
            allow = True
    if not allow:
       raise UnauthorizeException()
          
# def secure(*allowed_roles):
#     def decorator(func):
#         def wrapper(*a, **ka):
#             authorize(*allowed_roles)
#             return func(*a, **ka)
#         return wrapper
#     return decorator