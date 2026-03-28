from rest_framework import serializers
from .models import TaskType, TaskLog
from accounts.serializers import UserSerializer

class TaskTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskType
        fields = '__all__'

class TaskLogSerializer(serializers.ModelSerializer):
    task_type_details = TaskTypeSerializer(source='task_type', read_only=True)
    created_by_details = UserSerializer(source='created_by', read_only=True)
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = TaskLog
        fields = ['id', 'task_type', 'task_type_details', 'description', 'time_spent_hours', 'task_date', 'created_by', 'created_by_details', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
