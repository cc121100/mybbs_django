# -*- coding: UTF-8 -*-
import sys
from django.shortcuts import render
from django.template import loader,Context
from django.http import HttpResponse
from mybbs_app.models import *
import initapp
from django.utils import simplejson 

# Create your views here.  
reload(sys)
sys.setdefaultencoding('utf-8')

URL_FILE_PREFIX = 'D:/mybbs/urls/'
URL_FILE_SUFFIX = '.urls'


def index_view(request):
    t = loader.get_template('bbslist.html')
    c = Context({'persons':'aa'})
    return HttpResponse(t.render(c))

def default_list_view(request):
    
    #aip = request.GET['aip']
    #print'aip %s' % aip
    try:
        ip = getIpAddr(request)
        print'ip %s' % ip
        
        # get usersetting by ip addr
        # if not exsited return default sp
        # if exsited return user serrting sp
        us = None
        us = UserSetting.objects.get(ipAddr = ip)
        if us is None:
            us = UserSetting.objects.get(category='D')
        
        sourcePages = us.sourcePages.all()
        jsons = []
        for sp in sourcePages:
            #print 'sp id is %s' % sp.id
            url = URL_FILE_PREFIX + str(sp.id) + URL_FILE_SUFFIX
            linkStr = ''
            json = {}
            #print 'logo is %s' %sp.sampleSourcePage.logo
            
            with open(url , 'r') as f:
                for line in f.readlines():
                    linkStr = linkStr + line.strip() + '|_|'
            
            json['id'] = str(sp.id)
            json['name'] = str(sp.targetPageName)
            json['url'] = sp.targetPageUrl
            json['logo'] = str(sp.sampleSourcePage.logo)
            json['links'] = linkStr
            jsons.append(json)
            
        result = simplejson.dumps(jsons, ensure_ascii=False)
    except:
        info=sys.exc_info()
        print info[0],":",info[1]
        #TODO log

    return HttpResponse(result)

def user_list_view(request):
    pass

def category_sp_view(request):
    #json = {}
    #json['spCateJsons',initapp.SPCategoryJsons]
    
    result = simplejson.dumps(initapp.SPCategoryJsons, ensure_ascii=False)
    return HttpResponse(result)

def update_us_view(request):
    if request.method == 'GET':
        pass
    elif request.method == 'POST':
        newsps = request.POST['newsps']
        
        ip = getIpAddr(request)
        
        us = UserSetting.objects.get(ipAddr = ip)
        if us is None:
            # add all
            pass
        else:
            # delete old and add new
            pass
        
def getIpAddr(request):
    if request.META.has_key('HTTP_X_FORWARDED_FOR'):  
        return request.META['HTTP_X_FORWARDED_FOR']  
    else:  
        return request.META['REMOTE_ADDR'] 