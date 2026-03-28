from django.urls import path
from .views import EmployeeSummaryView, TeamReportView

urlpatterns = [
    path('employee-summary/', EmployeeSummaryView.as_view(), name='employee_summary'),
    path('team-report/', TeamReportView.as_view(), name='team_report'),
]
