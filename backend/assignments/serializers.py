from rest_framework import serializers
from .models import AssignedTask, TaskTimeLog
from accounts.serializers import UserSerializer

class TaskTimeLogSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = TaskTimeLog
        fields = ['id', 'assigned_task', 'user', 'user_details', 'time_spent_hours', 'log_date', 'description', 'created_at']
        read_only_fields = ['created_at']

class AssignedTaskSerializer(serializers.ModelSerializer):
    assigned_by_details = UserSerializer(source='assigned_by', read_only=True)
    assigned_to_details = UserSerializer(source='assigned_to', read_only=True)
    assigned_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    time_logs = TaskTimeLogSerializer(many=True, read_only=True)

    class Meta:
        model = AssignedTask
        fields = ['id', 'title', 'description', 'assigned_by', 'assigned_by_details', 'assigned_to', 'assigned_to_details', 'status', 'due_date', 'created_at', 'started_at', 'completed_at', 'time_logs']
        read_only_fields = ['created_at', 'started_at', 'completed_at']
