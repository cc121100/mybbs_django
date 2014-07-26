"""
WSGI config for mybbs_django project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/howto/deployment/wsgi/
"""

import os,sys
sys.path.append('D:/cc/study/py_workspace1/mybbs_django')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mybbs_django.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
