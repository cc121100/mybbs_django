from mybbs_app.models import *

SPCategoryJsons = []

def loadSPCategory():
    print '.............load when init............'
    spcs = SourcePageCategory.objects.all()
    for spc in spcs:
        spSams = SourcePageSample.objects.filter(spCategoryId = str(spc.id))
        SPCategoryJson = {}
        subJsonList = []
        
        for spSam in spSams:
            
            sps =SourcePage.objects.filter(sampleSourcePage = str(spSam.id),status='A')
            
            for sp in sps:
            
                subJson = {}
                subJson['id'] = str(sp.id)
                subJson['spName'] = sp.uniqueLabel
                
                subJsonList.append(subJson)
                
        SPCategoryJson['id'] = str(spc.id)
        SPCategoryJson['name'] = spc.name
        SPCategoryJson['subs'] = subJsonList
        SPCategoryJsons.append(SPCategoryJson)
        
    print SPCategoryJsons
    
        
            
    
    #[{id:XXX;name:XXX;subs:[{id:XXX;name:XXX}...]}...]