from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomFieldViewSet, CustomFieldValueViewSet

router = DefaultRouter()
router.register(r'fields', CustomFieldViewSet, basename='customfield')
router.register(r'values', CustomFieldValueViewSet, basename='customfieldvalue')

urlpatterns = [
    path('', include(router.urls)),
]
