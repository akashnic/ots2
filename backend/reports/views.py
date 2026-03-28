from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsAdminOrOfficer
from tasks.models import TaskLog
from assignments.models import TaskTimeLog, AssignedTask
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta

class EmployeeSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Determine the user to get summary for
        employee_id = request.query_params.get('employee_id')
        if employee_id and hasattr(user, 'role') and user.role and user.role.name in ['Admin', 'Officer']:
            # Officers/Admins can view other employees' summaries
            pass
        else:
            employee_id = user.id
            
        now = timezone.now()
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Self logged tasks stats
        self_tasks = TaskLog.objects.filter(created_by_id=employee_id, task_date__gte=start_of_month)
        self_tasks_count = self_tasks.count()
        self_tasks_hours = self_tasks.aggregate(Sum('time_spent_hours'))['time_spent_hours__sum'] or 0

        # Assigned tasks stats
        assigned_time_logs = TaskTimeLog.objects.filter(user_id=employee_id, log_date__gte=start_of_month)
        assigned_hours = assigned_time_logs.aggregate(Sum('time_spent_hours'))['time_spent_hours__sum'] or 0
        
        assigned_tasks_completed = AssignedTask.objects.filter(assigned_to_id=employee_id, status='COMPLETED', completed_at__gte=start_of_month).count()

        return Response({
            'employee_id': employee_id,
            'month': start_of_month.strftime('%B %Y'),
            'self_logged_tasks_count': self_tasks_count,
            'self_logged_hours': self_tasks_hours,
            'assigned_tasks_hours': assigned_hours,
            'assigned_tasks_completed': assigned_tasks_completed,
            'total_hours': float(self_tasks_hours) + float(assigned_hours)
        })

class TeamReportView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrOfficer]

    def get(self, request):
        now = timezone.now()
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Aggregate across team (for simplicity, we pull all users the officer has assigned tasks to, or all if we don't have strict teams)
        # Let's get stats for all employees in a basic setup
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        employees = User.objects.filter(role__name='Employee')
        team_stats = []
        
        for emp in employees:
            self_hours = TaskLog.objects.filter(created_by=emp, task_date__gte=start_of_month).aggregate(Sum('time_spent_hours'))['time_spent_hours__sum'] or 0
            assigned_hours = TaskTimeLog.objects.filter(user=emp, log_date__gte=start_of_month).aggregate(Sum('time_spent_hours'))['time_spent_hours__sum'] or 0
            
            team_stats.append({
                'employee_id': emp.id,
                'employee_name': emp.full_name,
                'email': emp.email,
                'total_hours_this_month': float(self_hours) + float(assigned_hours)
            })

        # Overall tasks
        pending_tasks = AssignedTask.objects.filter(status='PENDING').count()
        in_progress_tasks = AssignedTask.objects.filter(status='IN_PROGRESS').count()
        
        return Response({
            'month': start_of_month.strftime('%B %Y'),
            'team_statistics': team_stats,
            'overall': {
                'pending_assigned_tasks': pending_tasks,
                'in_progress_assigned_tasks': in_progress_tasks
            }
        })
