from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Posts)
admin.site.register(Comment)
admin.site.register(PostReport)
admin.site.register(Notification)
admin.site.register(Follow)
