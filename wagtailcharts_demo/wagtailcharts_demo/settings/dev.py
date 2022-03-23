from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-6q%1gy=hi+upm-yzxm-%1wo3x0*$77qfg#1gcn(g=7330q6+d&'

# SECURITY WARNING: define the correct hosts in production!
ALLOWED_HOSTS = ['*'] 

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

import dj_database_url
from wagtailcharts_demo.settings.dev import *  # noqa

# Override settings here
db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)


try:
    from .local import *
except ImportError:
    pass
