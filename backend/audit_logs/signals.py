from django.db.models.signals import post_save
from django.dispatch import receiver
from tasks.models import TaskLog
from assignments.models import AssignedTask
from .models import AuditLog

@receiver(post_save, sender=TaskLog)
def audit_task_log_save(sender, instance, created, **kwargs):
    action = "Task Log Created" if created else "Task Log Edited"
    AuditLog.objects.create(
        user=instance.created_by,
        action=action,
        entity_type="TaskLog",
        entity_id=instance.id
    )

@receiver(post_save, sender=AssignedTask)
def audit_assigned_task_save(sender, instance, created, **kwargs):
    if created:
        action = "Task Assigned"
    else:
        if instance.status == 'COMPLETED':
            action = "Task Completed"
        elif instance.status == 'IN_PROGRESS':
            action = "Task Started"
        else:
            action = "Task Edited"

    # The user executing the action could be the assigned_to or assigned_by.
    # Defaulting to assigned_to if it's completed/started, otherwise assigned_by.
    user = instance.assigned_to if instance.status in ['COMPLETED', 'IN_PROGRESS'] else instance.assigned_by
    
    AuditLog.objects.create(
        user=user,
        action=action,
        entity_type="AssignedTask",
        entity_id=instance.id
    )
