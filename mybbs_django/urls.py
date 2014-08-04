from django.conf.urls import patterns, include, url
from mybbs_app.views import *
from django.contrib import admin
admin.autodiscover()

from django.conf.urls.static import static
from django.conf import settings
from mybbs_app.initapp import *



urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'mybbs_django.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^index$', index_view),
    url(r'^list$', default_list_view),
    url(r'^cateSP$', category_sp_view),
    url(r'^us$', update_us_view),
)


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

loadSPCategory()
