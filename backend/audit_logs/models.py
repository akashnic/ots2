from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=100) # e.g. "task created", "task completed"
    entity_type = models.CharField(max_length=100) # e.g. "TaskLog", "AssignedTask"
    entity_id = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.action} on {self.entity_type} {self.entity_id} by {self.user.email if self.user else 'System'}"
