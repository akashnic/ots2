from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .models import Role
from .serializers import UserSerializer, RoleSerializer, CustomTokenObtainPairSerializer
from .permissions import IsAdminUser

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RoleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().select_related('role')
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create', 'update', 'partial_update', 'destroy']:
            # For simplicity, Admin manages all users. 
            # Note: Users can view their own profile via /me/ endpoint
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()

    def get_queryset(self):
        # Admin sees all. Others only see themselves
        if self.request.user.role and self.request.user.role.name == Role.ADMIN:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)
        
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
