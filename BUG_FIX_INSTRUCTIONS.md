# BUG FIX AND FEATURE CORRECTION INSTRUCTIONS
# Office Task Logging and Management System (OTLMS)

You are an AI software engineer responsible for auditing and fixing an existing full stack application.

The project has already been generated but contains bugs, missing features, and incomplete modules.

Your task is to:

1. Analyze the current codebase
2. Identify issues related to the problems listed below
3. Fix the code
4. Ensure the system works end-to-end

Do NOT regenerate the entire project.

Only modify or extend the existing code.

Follow the architecture and coding rules already defined in:

MASTER_PROMPT.md  
AGENT_RULES.md  


---

# GENERAL FIXING RULES

When fixing bugs:

- Identify the root cause before modifying code
- Fix both frontend and backend if necessary
- Ensure APIs match frontend usage
- Maintain modular architecture
- Ensure no regression in working features

After implementing fixes ensure:

Login works
Task logging works
Assigned task workflow works
Reports work
All UI navigation works

---

# ISSUE 1 LOGIN SCREEN BUG

Problem:

When entering a wrong password and clicking Sign In, the screen refreshes immediately.

Expected behavior:

The page must NOT refresh.

Instead:

- Prevent form default submit behavior
- Call login API using Axios
- Show an error message such as:

"Invalid username or password"

Frontend fixes required:

- Use event.preventDefault()
- Handle authentication errors properly
- Display error feedback on UI

Backend fixes required:

- Ensure login API returns proper error response (HTTP 401)

---

# EMPLOYEE LOGIN FIXES

## Sidebar Feature

Add a new sidebar option:

"Logged Tasks"

When clicked:

Display a list of tasks logged by the employee.

Main screen must show:

task type  
description  
time spent  
task date  

Include a calendar date selector.

Selecting a date should show tasks for that date.

API requirement:

GET /tasks/my-tasks?date=

---

## Log Task Screen Improvements

Current problem:

User can only log one task at a time.

Required behavior:

Add a "+" button to allow adding multiple task entries in the same screen.

When clicking "+" a new task input section should appear below the existing one.

User can submit both individual and all tasks together. having a save button for each task and at end of the form a submit button to save all tasks.

Example UI:

Task Entry 1  
Task Entry 2  
Task Entry 3

Submit → all entries saved.

---

## User Profile Access

At the bottom-left corner where the employee name is displayed:

Make the username clickable.

Clicking should open:

User Profile Page

Display:

Name  
Email  
Role  
Profile information

Add a backend API if needed:

GET /users/me

---

# ASSIGNED TASK MODULE FIX

The assigned task module is currently broken.

Required behavior:

Assigned tasks page should list all tasks assigned to the logged-in employee.

Each task card should show:

title  
description  
status  
due date  

Each task should have:

Open button

When opening the task:

- If status is PENDING
- Automatically change to IN_PROGRESS

API must update:

status = IN_PROGRESS  
started_at timestamp

---

## Assigned Task Detail Screen

Employee must be able to:

Log time spent on that task.

Fields:

time spent  
notes  

Multiple time logs should be allowed.

Add button:

"Mark Task Completed"

On click:

status = COMPLETED  
completed_at timestamp

---

# EMPLOYEE REPORTS

Add a "Reports" section for employee login.

Reports must show:

self task logs  
self assigned tasks  

Provide filtering by:

date range

Use a calendar date picker.

Example report table:

Task Type  
Description  
Date  
Time Spent

Assigned task report should include:

task title  
status  
time logged

---

# OFFICER LOGIN FIXES

Officers must have all employee features plus additional management features.

---

## Task Logging

Officers must also be able to log daily tasks just like employees.

Reuse the same task logging interface.

---

## Officer Reports

Reports must show tasks of employees.

Officer should be able to:

Select employee from dropdown
Add all the filters available to employee reports
Filter by:

date  
task type  
status

Calendar date picker required.

Example report:

Employee Name  
Task Description  
Date  
Time Spent

---

## Assign Task Module

Add a separate sidebar option:

"Assign Task"

This page must allow officers to:

Create a new task

Fields:
task type
title  
description  
Assign to employee  
due date(optional)

Employees available in dropdown must be only subordinates.

---

## Assigned Task Screen (Officer)

Current problem:

Assigned tasks page shows blank screen.

Fix required:

If no tasks exist show message:

"No tasks assigned yet."

If tasks exist display them in list.

Officer should see:

title  
assigned employee  
status  
due date

---

## Officer Profile

The officer username in the bottom-left corner must be clickable.

Clicking should show:

Profile page

Display:

Name  
Email  
Role  
Hierarchy details

---

# ADMIN LOGIN FIXES

Admin interface must be simplified.

---

## Remove Reports

Remove the reports option from the admin sidebar.

Admin should not have reports.

---

## User Management Settings

Add a "User Settings" page.

Admin must be able to perform CRUD operations on users.

Required operations:

Create user  
Edit user  
Delete user  
Update profile details

Fields:

name  
email  
role  
designation

Ensure proper API support.

---

# FINAL REQUIREMENT

After implementing fixes ensure:

Login works without refresh issues.

Employees can:

log multiple tasks  
view logged tasks  
view assigned tasks  
generate reports  

Officers can:

assign tasks  
view employee reports  
log tasks  

Admin can:

manage users

Assigned task lifecycle must work:

PENDING → IN_PROGRESS → COMPLETED

Ensure the system works end-to-end.


Ensure frontend and backend APIs integrate correctly.