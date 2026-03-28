from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class AssignedTask(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'PENDING'),
        ('IN_PROGRESS', 'IN_PROGRESS'),
        ('COMPLETED', 'COMPLETED'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_tasks_given')
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_tasks_received')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PENDING')
    due_date = models.DateField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} - {self.assigned_to.email}"

    def save(self, *args, **kwargs):
        if self.status == 'IN_PROGRESS' and not self.started_at:
            self.started_at = timezone.now()
        elif self.status == 'COMPLETED' and not self.completed_at:
            self.completed_at = timezone.now()
            
        super().save(*args, **kwargs)

class TaskTimeLog(models.Model):
    assigned_task = models.ForeignKey(AssignedTask, on_delete=models.CASCADE, related_name='time_logs')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    time_spent_hours = models.DecimalField(max_digits=5, decimal_places=2)
    log_date = models.DateField(default=timezone.now)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.time_spent_hours} hrs on {self.assigned_task.title} by {self.user.email}"
