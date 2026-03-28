# AI SYSTEM BUILD INSTRUCTION
# Project: Office Task Logging and Management System (OTLMS)

You are a senior full-stack software engineer responsible for generating a complete production-ready application.

Your task is to build a full stack internal office software used to log daily work tasks and manage assigned tasks within a government office.

This system will run on a local office network and will be accessed through a browser.

The system must be cleanly architected, modular, and production ready.

---

# 1 PROJECT GOAL

Develop a browser-based responsive system where office employees can:

- Log daily tasks
- Track assigned tasks
- Record time spent
- Generate summaries of work

Officers should be able to:

- Assign tasks
- Track employee work
- View dashboards and summaries

The system must support role-based access control.

---

# 2 TARGET USERS

The office structure:

DIO – District Informatics Officer (Head)  
ADIO – Additional District Informatics Officer  
NFE – Technical staff  
iRAD employee – support staff  

Total users: 5–10

Roles in system:

Admin  
Officer (DIO/ADIO)  
Employee (NFE/iRAD)

---

# 3 SYSTEM ARCHITECTURE

Use a modern full stack architecture.

Frontend:
React + Vite + TailwindCSS

Backend:
Python Django + Django REST Framework

Database:
PostgreSQL

Authentication:
JWT authentication

Architecture pattern:

Frontend (React SPA)
       |
       | REST API
       |
Backend (Django REST)
       |
PostgreSQL

---

# 4 PROJECT FOLDER STRUCTURE

Generate the following repository structure:

/office-task-system

/backend
/frontend
/database
/docs

Backend contains Django project.

Frontend contains React application.

Database folder contains SQL schema.

Docs folder contains architecture documentation.

---

# 5 BACKEND REQUIREMENTS

Framework:
Django + Django REST Framework

Modules to create:

accounts  
tasks  
assignments  
reports  
custom_fields  
audit_logs  

Follow modular Django architecture.

---

# 6 AUTHENTICATION

Use JWT authentication.

Use Django authentication system.

Implement:

Login API  
Token refresh  
Logout API  

Use secure password hashing.

Roles must be stored and enforced.

---

# 7 ROLE PERMISSIONS

Admin

- manage users
- manage task types
- manage custom fields

Officer

- assign tasks
- view team dashboard
- view employee summaries
- view reports

Employee

- log daily tasks
- view assigned tasks
- update task progress
- edit own tasks

Employees cannot see tasks of other employees.

---

# 8 TASK LOGGING SYSTEM

Employees must be able to log daily tasks.

Each task entry includes:

Task Type  
Description  
Time Spent (hours)  
Task Date  

Task date auto defaults to current date.

User may edit task date later.

Employees can log multiple tasks per day.

Self logged tasks must store:

task_date  
created_by  
created_at  
updated_at  

If task_date is earlier than created_at, treat as late entry.

---

# 9 ASSIGNED TASK SYSTEM

Officers can assign tasks to employees.

Assigned task fields:

title  
description  
assigned_by  
assigned_to  
status  
due_date  
created_at  
started_at  
completed_at  

Status lifecycle:

PENDING  
IN_PROGRESS  
COMPLETED  

Behavior rule:

When employee opens assigned task → automatically update status to IN_PROGRESS.

Employee can mark task completed.

Employees can add time logs to assigned tasks.

---

# 10 TASK TYPES

Admin can configure task types.

Examples:

Support  
eOffice  
Video Conferencing  
Event Support  

These should be stored in a database table.

---

# 11 VIDEO CONFERENCING FIELDS

When task type is Video Conferencing support additional fields:

VC title  
VC time  
VC platform

Fields must support extension via custom fields.

---

# 12 CUSTOM FIELD SYSTEM

Admin must be able to configure custom fields via UI.

Supported field types:

Text  
Date  
Dropdown  
Multi select  
File upload  
User picker  

Custom fields should work for tasks.

Store custom field values in relational tables.

---

# 13 DASHBOARDS

Employee dashboard shows:

today tasks  
assigned tasks  
recent activity  

Officer dashboard shows:

team task overview  
employee statistics  
monthly summaries  

Allow filters:

employee  
date  
task type  
status

---

# 14 SEARCH AND FILTER

Implement filtering and search for tasks.

Filters:

date range  
task type  
employee  
status  

Search by keyword in description.

---

# 15 REPORTS

Reports module should support:

Employee monthly summary

Example output:

Employee name  
total tasks  
total hours  

Officer should see team report.

---

# 16 DATABASE DESIGN

Design PostgreSQL schema with normalized tables.

Tables required:

users  
roles  
task_types  
task_logs  
assigned_tasks  
task_time_logs  
custom_fields  
custom_field_values  
activity_logs  

Include:

primary keys  
foreign keys  
indexes  

---

# 17 FRONTEND REQUIREMENTS

Use React with Vite.

Use TailwindCSS for styling.

Pages required:

Login page  

Employee Dashboard  

Task Logging Page  

Assigned Tasks Page  

Task Detail Page  

Officer Dashboard  

Reports Page  

Admin Settings Page  

Use reusable components.

Components should include:

TaskCard  
TaskForm  
DashboardWidget  
TableComponent  
FilterBar  

Use Axios for API communication.

Use React Router for navigation.

---

# 18 FRONTEND BEHAVIOR

Login using JWT.

Store token securely.

Use API interceptors for authentication headers.

Task logging page must allow adding multiple entries.

Assigned task detail page must:

auto update status to IN_PROGRESS when opened.

Allow employee to:

add time logs  
mark completed  

---

# 19 SECURITY

Implement:

JWT authentication  
role based permissions  
API protection  
input validation  

Prevent employees from accessing other employee data.

---

# 20 AUDIT LOGGING

Track important actions.

Examples:

task created  
task edited  
task completed  
task assigned  

Store audit logs with:

user  
action  
entity  
timestamp  

---

# 21 API DESIGN

Generate REST APIs for:

authentication  
users  
task logs  
assigned tasks  
task types  
custom fields  
reports  

Use:

Django REST viewsets  
serializers  
pagination  
filtering  

---

# 22 UI DESIGN

Application must be responsive.

Must work on:

desktop browsers  
mobile browsers  

Use modern dashboard layout.

---

# 23 CODE QUALITY

Code must be:

modular  
clean  
documented  

Avoid placeholder functions.

Generate working implementations.

Follow best practices.

---

# 24 FINAL OUTPUT

Generate the complete project with:

Backend Django project  
React frontend  
Database schema  
API endpoints  

Ensure frontend and backend integrate correctly.

The project must be runnable after installing dependencies and running migrations.