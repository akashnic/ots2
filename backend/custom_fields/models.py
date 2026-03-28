from django.db import models
from tasks.models import TaskType

class CustomField(models.Model):
    FIELD_TYPES = [
        ('Text', 'Text'),
        ('Date', 'Date'),
        ('Dropdown', 'Dropdown'),
        ('Multi select', 'Multi select'),
        ('File upload', 'File upload'),
        ('User picker', 'User picker'),
    ]

    name = models.CharField(max_length=100)
    field_type = models.CharField(max_length=50, choices=FIELD_TYPES)
    task_type = models.ForeignKey(TaskType, on_delete=models.CASCADE, related_name='custom_fields', null=True, blank=True)
    options = models.JSONField(blank=True, null=True) # For Dropdown choices e.g., ["Zoom", "Google Meet"]
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.field_type})"

class CustomFieldValue(models.Model):
    custom_field = models.ForeignKey(CustomField, on_delete=models.CASCADE)
    entity_type = models.CharField(max_length=50) # 'task' or 'assigned_task'
    entity_id = models.IntegerField()
    value = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.custom_field.name} - {self.entity_type} {self.entity_id}"
