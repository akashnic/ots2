from rest_framework import serializers
from .models import AuditLog
from accounts.serializers import UserSerializer

class AuditLogSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = AuditLog
        fields = ['id', 'user', 'user_details', 'action', 'entity_type', 'entity_id', 'timestamp']
