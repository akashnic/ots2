from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskTypeViewSet, TaskLogViewSet

router = DefaultRouter()
router.register(r'types', TaskTypeViewSet, basename='tasktype')
router.register(r'logs', TaskLogViewSet, basename='tasklog')

urlpatterns = [
    path('', include(router.urls)),
]
