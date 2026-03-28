from rest_framework import viewsets, permissions
from .models import Department, VisitorLog
from .serializers import DepartmentSerializer, VisitorLogSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class VisitorLogViewSet(viewsets.ModelViewSet):
    queryset = VisitorLog.objects.all()
    serializer_class = VisitorLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return super().get_queryset()
