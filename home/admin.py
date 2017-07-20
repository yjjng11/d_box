from django.contrib import admin
from home.models import Box, Usage_Info

class BoxAdmin(admin.ModelAdmin):
    list_display = ('boxID','boxNumber', 'location','state','userID','microswitch','led','image','lock' )


class UsageAdmin(admin.ModelAdmin):
    list_display = ('userID','boxID','boxNumber','location','startDate','finishDate','price','paymentDate')

admin.site.register(Box, BoxAdmin)
admin.site.register(Usage_Info, UsageAdmin)
