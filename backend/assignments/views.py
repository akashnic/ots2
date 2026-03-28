from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from .models import AssignedTask, TaskTimeLog
from .serializers import AssignedTaskSerializer, TaskTimeLogSerializer

class AssignedTaskViewSet(viewsets.ModelViewSet):
    serializer_class = AssignedTaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = AssignedTask.objects.all().select_related('assigned_by', 'assigned_to').prefetch_related('time_logs')
        
        # Filter assigned_to or assigned_by depending on role. Example basic filtering:
        role = getattr(user, 'role', None)
        if role:
            if role.name == 'Employee':
                queryset = queryset.filter(assigned_to=user)
            elif role.name == 'Officer':
                # Officers see tasks they logically own or their team. For now, show those assigned by or to them.
                # Adjust depending on hierarchy if needed.
                pass
                
        # Optional basic query params filtering
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
            
        return queryset.order_by('-created_at')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Rule: When employee opens task detail, status automatically becomes IN_PROGRESS.
        if request.user == instance.assigned_to and instance.status == 'PENDING':
            instance.status = 'IN_PROGRESS'
            instance.started_at = timezone.now()
            instance.save()
            
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class TaskTimeLogViewSet(viewsets.ModelViewSet):
    serializer_class = TaskTimeLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = TaskTimeLog.objects.all().select_related('user', 'assigned_task')
        
        role = getattr(user, 'role', None)
        if role and role.name == 'Employee':
            queryset = queryset.filter(user=user)
            
        assigned_task_id = self.request.query_params.get('assigned_task_id')
        if assigned_task_id:
            queryset = queryset.filter(assigned_task_id=assigned_task_id)
            
        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
