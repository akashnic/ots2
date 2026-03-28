# AI CODING RULES
# Office Task Logging and Management System

You are an AI software engineer working on a production-grade full stack application.

You must strictly follow the rules below when generating code.

---

# 1 GENERAL DEVELOPMENT RULES

Always generate complete working code.

Do not generate placeholder functions.

Do not generate TODO comments instead of implementation.

Every function must contain working logic.

All APIs must be fully implemented.

Code must be clean, modular, and readable.

---

# 2 TECHNOLOGY STACK

The project stack is fixed.

Frontend

React
Vite
TailwindCSS
Axios
React Router

Backend

Python
Django
Django REST Framework

Database

PostgreSQL

Authentication

JWT authentication

Do not introduce alternative frameworks.

---

# 3 PROJECT STRUCTURE

Follow this repository structure exactly.


/backend
/frontend
/database
/docs

Backend contains Django project.

Frontend contains React application.

Database folder contains schema documentation.

---

# 4 BACKEND RULES

Backend must follow Django best practices.

Use Django REST Framework.

Organize backend into modules:

accounts  
tasks  
assignments  
reports  
custom_fields  
audit_logs  

Each module must contain:

models.py  
serializers.py  
views.py  
urls.py  

Register routes in central API router.

---

# 5 API DESIGN RULES

Use RESTful API design.

Use ViewSets instead of raw views when possible.

Each resource must support:

create  
retrieve  
update  
delete  
list  

Use pagination for list APIs.

Use filtering and search.

Use serializers for validation.

Return consistent JSON responses.

---

# 6 AUTHENTICATION RULES

Use JWT authentication.

Use Django authentication model.

Implement APIs for:

login  
token refresh  
logout  

Secure all endpoints using authentication.

Use role-based permission classes.

---

# 7 PERMISSION RULES

Roles:

Admin  
Officer  
Employee  

Employees:

can only access their own tasks

Officers:

can view tasks of employees under them

Admin:

can manage users and configuration

Implement permissions at API level.

Never rely only on frontend restrictions.

---

# 8 DATABASE RULES

Use PostgreSQL compatible schema.

Use proper foreign keys.

Ensure database normalization.

Tables must include audit fields where needed.

Important tables:

users  
task_logs  
assigned_tasks  
task_time_logs  
task_types  
custom_fields  
custom_field_values  
activity_logs  

Add indexes to frequently queried fields.

---

# 9 TASK LOGGING LOGIC

Employees log daily work.

Fields:

task type  
description  
time spent  
task date  

Task date defaults to current date.

User may edit task date.

Multiple tasks allowed per day.

Store audit fields:

created_by  
created_at  
updated_at  

---

# 10 ASSIGNED TASK LOGIC

Officers assign tasks.

Task statuses:

PENDING  
IN_PROGRESS  
COMPLETED  

Rule:

When employee opens task detail

status automatically becomes IN_PROGRESS.

Employee can add time logs.

Employee can mark task completed.

---

# 11 FRONTEND RULES

Use React functional components.

Use React hooks.

Use clean component architecture.

Project structure:
/frontend/src

components
pages
services
hooks
layouts
utils

---

# 12 FRONTEND API INTEGRATION

Use Axios for API requests.

Create central API service.

Example structure:

services/api.js  
services/authService.js  
services/taskService.js  

Implement JWT interceptor for authentication headers.

Handle API errors gracefully.

---

# 13 UI COMPONENT RULES

Build reusable components.

Important components:

TaskCard  
TaskForm  
DashboardWidget  
TableComponent  
FilterBar  

Avoid duplicating UI logic.

---

# 14 DASHBOARD RULES

Employee dashboard shows:

today tasks  
assigned tasks  
recent activity  

Officer dashboard shows:

team task overview  
employee summaries  
monthly statistics  

---

# 15 SECURITY RULES

Never expose sensitive data.

Validate all API inputs.

Prevent employees from viewing other employees' data.

Protect endpoints with authentication and permission checks.

---

# 16 CODE QUALITY

Code must follow best practices.

Use clear variable names.

Write modular functions.

Avoid duplicate code.

Follow separation of concerns.

---

# 17 ERROR HANDLING

APIs must return meaningful error responses.

Frontend must display user-friendly error messages.

Handle network errors and validation errors.

---

# 18 INTEGRATION RULES

Ensure frontend API calls match backend endpoints.

Do not invent APIs that do not exist.

Always verify integration between frontend and backend.

---

# 19 TESTING

Ensure application runs after:

installing dependencies  
running migrations  
starting backend server  
starting frontend server

---

# 20 FINAL REQUIREMENT

The generated project must be runnable locally.

Backend should start with:

python manage.py runserver

Frontend should start with:

npm install
npm run dev

Application should work end-to-end.

Login → dashboard → task logging → assigned tasks → reports.