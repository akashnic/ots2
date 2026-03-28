from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, VisitorLogViewSet

router = DefaultRouter()
router.register('departments', DepartmentViewSet)
router.register('logs', VisitorLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
