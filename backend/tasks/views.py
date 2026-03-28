from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import TaskType, TaskLog
from .serializers import TaskTypeSerializer, TaskLogSerializer
from accounts.permissions import IsAdminUser
from accounts.models import Role

class TaskTypeViewSet(viewsets.ModelViewSet):
    queryset = TaskType.objects.all()
    serializer_class = TaskTypeSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

class TaskLogViewSet(viewsets.ModelViewSet):
    serializer_class = TaskLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = TaskLog.objects.all().select_related('task_type', 'created_by', 'created_by__role')
        # Add filtering
        employee_id = self.request.query_params.get('employee_id')
        
        # Filter by employee (Officer can see their team, Employee only themselves)
        if hasattr(user, 'role') and user.role:
            if user.role.name == Role.EMPLOYEE:
                queryset = queryset.filter(created_by=user)
            elif user.role.name == Role.OFFICER:
                # If an officer doesn't specify an employee_id, they see their own logs
                if not employee_id:
                    queryset = queryset.filter(created_by=user)

        if employee_id:
            queryset = queryset.filter(created_by_id=employee_id)
            
        task_type_id = self.request.query_params.get('task_type_id')
        if task_type_id:
            queryset = queryset.filter(task_type_id=task_type_id)
            
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        date = self.request.query_params.get('date')
        
        if date:
            queryset = queryset.filter(task_date=date)
        elif start_date and end_date:
            queryset = queryset.filter(task_date__range=[start_date, end_date])
            
        return queryset.order_by('-task_date', '-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
