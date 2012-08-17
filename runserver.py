# -*- coding: utf-8 -*-

from tasklist import app, database
from tasklist.settings import SECRET_KEY

import os

if __name__ == '__main__':
    database.init_db()
    port = int(os.environ.get('PORT', 5000))
    app.secret_key = SECRET_KEY
    app.run(debug=True, port=port, host='0.0.0.0')