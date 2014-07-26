import os
import sys
import django.core.handlers.wsgi
sys.path.append(r'D:/cc/study/py_workspace1/mybbs_django')
os.environ['DJANGO_SETTINGS_MODULE'] = 'mybbs_django.settings'
application = django.core.handlers.wsgi.WSGIHandler()