from rest_framework import serializers
from .models import Department, VisitorLog
from accounts.serializers import UserSerializer

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class VisitorLogSerializer(serializers.ModelSerializer):
    department_details = DepartmentSerializer(source='department', read_only=True)
    logged_by_details = UserSerializer(source='logged_by', read_only=True)
    logged_by = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = VisitorLog
        fields = ['id', 'visitor_name', 'department', 'department_details', 'query', 'logged_by', 'logged_by_details', 'created_at']
        read_only_fields = ['created_at']
