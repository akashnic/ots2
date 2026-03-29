from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class VisitorLog(models.Model):
    visitor_name = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    query = models.TextField()
    logged_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='logged_visitors')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.visitor_name} - {self.department} - {self.created_at}"

    class Meta:
        ordering = ['-created_at']
