from django.contrib import admin
from .models import Department, VisitorLog

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)

@admin.register(VisitorLog)
class VisitorLogAdmin(admin.ModelAdmin):
    list_display = ('visitor_name', 'department', 'logged_by', 'created_at')
    list_filter = ('department', 'logged_by', 'created_at')
    search_fields = ('visitor_name', 'query')
