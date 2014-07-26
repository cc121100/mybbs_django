import os
import sys
import django.core.handlers.wsgi
sys.path.append(r'D:/WorkSpace/DjangoProject')
os.environ['DJANGO_SETTINGS_MODULE'] = 'FirstProject.settings'
application = django.core.handlers.wsgi.WSGIHandler()