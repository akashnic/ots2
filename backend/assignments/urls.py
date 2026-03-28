from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AssignedTaskViewSet, TaskTimeLogViewSet

router = DefaultRouter()
router.register(r'tasks', AssignedTaskViewSet, basename='assignedtask')
router.register(r'timelogs', TaskTimeLogViewSet, basename='tasktimelog')

urlpatterns = [
    path('', include(router.urls)),
]
