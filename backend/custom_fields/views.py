from rest_framework import viewsets, permissions
from .models import CustomField, CustomFieldValue
from .serializers import CustomFieldSerializer, CustomFieldValueSerializer
from accounts.permissions import IsAdminUser

class CustomFieldViewSet(viewsets.ModelViewSet):
    queryset = CustomField.objects.all()
    serializer_class = CustomFieldSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [permissions.IsAuthenticated()]
        
    def get_queryset(self):
        queryset = super().get_queryset()
        task_type_id = self.request.query_params.get('task_type_id')
        if task_type_id:
            queryset = queryset.filter(task_type__id=task_type_id)
        return queryset

class CustomFieldValueViewSet(viewsets.ModelViewSet):
    queryset = CustomFieldValue.objects.all()
    serializer_class = CustomFieldValueSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        entity_type = self.request.query_params.get('entity_type')
        entity_id = self.request.query_params.get('entity_id')
        
        if entity_type:
            queryset = queryset.filter(entity_type=entity_type)
        if entity_id:
            queryset = queryset.filter(entity_id=entity_id)
            
        return queryset
