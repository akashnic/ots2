from django.contrib import admin
from .models import VisitorLog

@admin.register(VisitorLog)
class VisitorLogAdmin(admin.ModelAdmin):
    list_display = ('visitor_name', 'department', 'logged_by', 'created_at')
    list_filter = ('logged_by', 'created_at')
    search_fields = ('visitor_name', 'department', 'query')
