# -*- coding: utf-8 -*-

import os

SECRET_KEY = "\x87\xcaO\xbf.o\xe4\xc4\xd9\x18C\x8cc}4Z\xaf:b\t\xbf\xb0I{"
DB_URL = os.environ.get('HEROKU_POSTGRESQL_GRAY_URL')

if not DB_URL:
    DB_URL = 'sqlite:////tmp/test.db'
