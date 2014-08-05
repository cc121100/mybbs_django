# -*- coding: UTF-8 -*-
import sys
from django.shortcuts import render
from django.template import loader,Context
from django.http import HttpResponse
from mybbs_app.models import UserSetting,SourcePage,UserSettingToSourcePage
import initapp
from django.utils import simplejson 
from django.views.decorators.csrf import csrf_exempt

# Create your views here.  
reload(sys)
sys.setdefaultencoding('utf-8')

URL_FILE_PREFIX = 'D:/mybbs/urls/'
URL_FILE_SUFFIX = '.urls'


def index_view(request):
    t = loader.get_template('bbslist.html')
    c = Context({'persons':'aa'})
    return HttpResponse(t.render(c))

def list_view(request):
    
    #aip = request.GET['aip']
    #print'aip %s' % aip
    try:
        ip = getIpAddr(request)
        print'ip %s' % ip
        
        # get usersetting by ip addr
        # if not exsited return default sp
        # if exsited return user serrting sp
        uss = None
        uss = UserSetting.objects.filter(ipAddr = ip)
        if uss is None or len(uss) < 1:
            us = UserSetting.objects.get(category='D')
        else:
            us = uss[0]
        
        sourcePages = us.sourcePages.all()
        jsonObj = {}
        jsons = []
        jsonObj['c'] = us.category
        
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
        
        jsonObj['list'] = jsons
        result = simplejson.dumps(jsonObj, ensure_ascii=False)
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

@csrf_exempt
def update_us_view(request):
    try:
        if request.method == 'GET':
            return HttpResponse('')
        elif request.method == 'POST':
            newspIds = request.POST.getlist('newsps[]')
            if newspIds is not None:
                for newsp in newspIds:
                    print('sp id is %s') % newsp
                
            ip = getIpAddr(request)
            
            uss = UserSetting.objects.filter(ipAddr = ip)
            if uss is None or len(uss) < 1:
                # add us 
                # add all sp for us
                newUS = UserSetting(name= ip + ' us', category='U', ipAddr=ip)
                #newUS.sourcePages = getSPByIds(newsps)
                newUS.save()
                
                addUSToSP(newUS, newspIds)
            else:
                us = uss[0]
                sps = us.sourcePages.all()
                if sps is None or len(sps) < 1:
                    # add all sp for us
                    addUSToSP(us, newspIds)
                else:
                    # delete old and add new
                    UserSettingToSourcePage.objects.filter(userSettings=us).delete()
                    addUSToSP(us, newspIds)
            return HttpResponse('')
    except:
        info=sys.exc_info()
        print info[0],":",info[1]
        
def getIpAddr(request):
    if request.META.has_key('HTTP_X_FORWARDED_FOR'):  
        return request.META['HTTP_X_FORWARDED_FOR']  
    else:  
        return request.META['REMOTE_ADDR'] 
    
def addUSToSP(us,spIds):
    sps = SourcePage.objects.filter(id__in=spIds)
    for sp in sps:
        us_sp = UserSettingToSourcePage(userSettings = us,sourcePages = sp)
        us_sp.save()
    #return SourcePage.objects.filter(id__in=ids)
    