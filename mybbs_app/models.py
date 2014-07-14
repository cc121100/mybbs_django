from django.db import models
from django.contrib import admin
from uuidfield import UUIDField
from compositekey import db

# Create your models here.

STATUS_CHOICES = (
        ('A', 'Active'),
        ('I', 'Inactive'),
)

PARAM_TYPE = (
    ('String', 'String'),
    ('Node', 'Node'),
)

SET_PARAM_METHOD_NAME = (
    ('Construct','Construct'),                     
)
SOURCE_PAGE_CATEGORY = (
    ('S','Sample URL'),                     
    ('T','Target URL'),                     
    ('N','Navigate URL'),                     
)



#base model
class BaseModel(models.Model):
    
    version = models.IntegerField(db_column = 'version',default= 0)
    created_by = models.CharField(max_length = 100, db_column = 'created_by', blank = True,default='Admin')
    created_dt = models.DateTimeField(db_column = 'created_dt',auto_now_add = True)
    updated_by = models.CharField(max_length = 100, db_column = 'updated_by', blank = True,default='Admin')
    updated_dt = models.DateTimeField(db_column = 'updated_dt',auto_now=True)
    
    class Meta:
        abstract = True
        
class Filter(BaseModel):
    id = UUIDField(primary_key=True,auto = True, db_column = 'id')
    filterName = models.CharField(max_length=255, db_column = 'filter_name')
    filterClassName = models.CharField(max_length=255, db_column = 'filter_class_name')
    filterClassParams  = models.CharField(max_length=255, db_column = 'filter_class_params')
    paramType = models.CharField(max_length=255, db_column = 'param_type',choices = PARAM_TYPE, default='String')
    paramNum = models.CharField(max_length=255, db_column = 'param_num',blank = True,null = True)
    setParamMethodName = models.CharField(max_length=255, db_column = 'set_param_method_name', choices = SET_PARAM_METHOD_NAME, default = 'Construct')
    
    class Meta:
        db_table = 'tbl_filter'
    
    def __unicode__(self):
        return self.filterName
    
class UserSetting(BaseModel):
    id = UUIDField(primary_key=True,auto = True, db_column = 'id')
    name = models.CharField(max_length=255, db_column = 'name')
    category = models.CharField(max_length=255, db_column = 'category')
    #sourcePages = models.ManyToManyField('SourcePage', db_table='tbl_setting_to_source_page',related_name='setting_id')
    
    class Meta:
        db_table = 'tbl_user_setting'
        
    def __unicode__(self):
        return self.name


class SourcePage(BaseModel):
    id = UUIDField(primary_key=True,auto = True, db_column = 'id')
    targetPageName = models.CharField(max_length=255, db_column = 'target_page_name')
    targetPageUrl = models.CharField(max_length=255, db_column = 'target_page_url')
    category = models.CharField(max_length=255, db_column = 'category', choices = SOURCE_PAGE_CATEGORY, default='S')
    status = models.CharField(max_length=1, db_column = 'status',choices=STATUS_CHOICES, default='A')
    domainName = models.CharField(max_length=255, db_column = 'domain_name')
    md5Code = models.CharField(max_length=255, db_column = 'md5_code', blank = True,null = True)
    sampleSourcePage = models.ForeignKey('SourcePage',db_column='sample_sp_id',blank = True,null = True)
    userSettings = models.ManyToManyField('UserSetting',through='UserSettingToSourcePage')
    
    class Meta:
        db_table = 'tbl_source_page'
        
    def __unicode__(self):
        return self.targetPageName
    
class SourcePageFilter(BaseModel):
    id = UUIDField(primary_key=True,auto = True, db_column = 'id')
    sourcePage = models.ForeignKey('SourcePage', db_column='source_page_id',blank = True,null = True)
    sourcePageFilterName = models.CharField(max_length=255,db_column='source_page_filter_name')
    seqNum = models.IntegerField(db_column='seq_num')
    
    class Meta:
        db_table = 'tbl_source_page_filter'
        
    def __unicode__(self):
        return self.sourcePageFilterName

class SourcePageFilterDetail(BaseModel):
    id = UUIDField(primary_key=True,auto = True, db_column = 'id')
    sourcePageFilter = models.ForeignKey('SourcePageFilter', db_column='page_filter_id')
    filter = models.ForeignKey('Filter', db_column='filter_id')
    paramValue1 = models.CharField(max_length = 255, db_column = 'param_value1', blank = True, null = True)
    paramValue2 = models.CharField(max_length = 255, db_column = 'param_value2', blank = True, null = True)
    parentNode = models.ForeignKey('SourcePageFilterDetail', db_column='parent_node_id',blank = True,null = True)
    subNum = models.IntegerField(db_column='sub_num')
    
    class Meta:
        db_table = 'tbl_source_page_filter_detail'
        
    def __unicode__(self):
        return '%s - %s - %s' % (self.sourcePageFilter.sourcePageFilterName, self.subNum, self.filter.filterName)

#manytomany    
class UserSettingToSourcePage(models.Model):
    #id=db.MultiFieldPK('userSettings', 'sourcePages')
    userSettings = models.ForeignKey(UserSetting,db_column='user_setting_id')
    sourcePages = models.ForeignKey(SourcePage,db_column='source_page_id')
    
    class Meta:
        db_table = 'tbl_setting_to_source_page'
        unique_together = (('userSettings', 'sourcePages'),)
    
#manytomany inline
class UserSettingInline(admin.TabularInline):
    model = UserSettingToSourcePage
    extra = 1
    
#admin    
class FilterAdmin(admin.ModelAdmin):
    list_display = ('filterName','filterClassName','filterClassParams','paramType','paramNum','setParamMethodName')
    search_fields = ('filterName',)
    fields  = ('filterName','filterClassName','filterClassParams','paramType','paramNum','setParamMethodName')
    
class UserSettingAdmin(admin.ModelAdmin):
    list_display = ('name','category')
    fields  = ('name','category')
    inlines = (UserSettingInline,)
    
class SourcePageAdmin(admin.ModelAdmin):
    list_display = ('targetPageName','targetPageUrl','category','status','domainName','md5Code')
    search_fields = ('targetPageName','targetPageUrl')
    fields  = ('targetPageName','targetPageUrl','category','status','domainName')
    inlines = (UserSettingInline,)
    #fields  = ('name','category')
    
class SourcePageFilterAdmin(admin.ModelAdmin):
    list_display = ('sourcePageFilterName','sourcePage','seqNum')
    search_fields = ('sourcePageFilterName','sourcePage','seqNum')
    fields = ('sourcePageFilterName','sourcePage','seqNum')

class SourcePageFilterDetailAdmin(admin.ModelAdmin):
    list_display = ('sourcePageFilter','filter','paramValue1','paramValue2','parentNode','subNum')
    search_fields = ('sourcePageFilter','parentNode')
    fields = ('sourcePageFilter','filter','paramValue1','paramValue2','parentNode','subNum')
    
#admin register
admin.site.register(Filter, FilterAdmin)
admin.site.register(UserSetting, UserSettingAdmin)
admin.site.register(SourcePage, SourcePageAdmin)
admin.site.register(SourcePageFilter, SourcePageFilterAdmin)
admin.site.register(SourcePageFilterDetail, SourcePageFilterDetailAdmin)