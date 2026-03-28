from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class TaskType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class TaskLog(models.Model):
    task_type = models.ForeignKey(TaskType, on_delete=models.CASCADE)
    description = models.TextField()
    time_spent_hours = models.DecimalField(max_digits=5, decimal_places=2)
    task_date = models.DateField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.created_by.email} - {self.task_type.name} - {self.task_date}"
