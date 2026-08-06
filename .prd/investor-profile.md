Modul 3
Investor Profiling
Questionnaire Builder
Risk Assessment
Scoring
Suitability
Financial Health
Goal Detection
Recommendation
Output
Risk Profile
Conservative
Moderate
Balanced
Growth
Aggressive


# Feature Request: User Role & Investment Profile Module

## Objective

Build the foundation of InvestaOS by introducing user roles and an Investment Profile onboarding flow.

The current dashboard is designed for administrators only.

Investor users should complete their Investment Profile before accessing their dashboard.

Do not implement any AI features at this stage.

---

# Phase 1 - User Role

Modify the users table.

Add:

- role

Available roles:

- admin
- investor

Default role:

- investor

Requirements:

- Existing dashboard becomes the Admin Dashboard.
- Admin can access all management modules.
- Investor cannot access admin pages.

---

# Phase 2 - Registration Flow

Current flow

Register
↓

Dashboard

New flow

Register
↓

Create User
↓

Role = Investor
↓

Redirect to Investment Profile

The investor should not enter the dashboard until onboarding is completed.

---

# Phase 3 - Investment Profile

Create a new module named:

Investment Profile

Relationship:

User
↓

Investment Profile

Each user has one investment profile.

---

# Phase 4 - Investment Profile Wizard

Create a multi-step onboarding wizard.

Progress should be saved after every step.

Users can continue later.

Display a progress indicator.

---

## Step 1 - Personal Information

Collect:

- Full Name
- Date of Birth
- Gender
- Occupation
- Company
- Annual Income
- Monthly Expenses
- Total Assets
- Total Liabilities

---

## Step 2 - Investor Profiling

Create a Questionnaire Builder.

Questions must come from the database.

Each question should contain:

- Title
- Description
- Category
- Order

Each question contains multiple answer options.

Each option has its own score.

Do not hardcode questions.

---

## Step 3 - Risk Assessment

Calculate the total score.

Generate one of the following risk profiles:

- Conservative
- Moderate
- Balanced
- Growth
- Aggressive

The scoring system should be configurable from the database.

---

## Step 4 - Financial Health

Collect:

- Income
- Expenses
- Assets
- Liabilities
- Emergency Fund

Display a financial summary.

No AI analysis is required.

---

## Step 5 - Investment Goals

Allow users to create one or more goals.

Example:

- Retirement
- Education
- House
- Emergency Fund
- Wealth Growth

Each goal contains:

- Target Amount
- Target Date
- Priority

---

## Step 6 - Summary

Display all collected information.

Show:

- Personal Information
- Risk Profile
- Risk Score
- Financial Summary
- Investment Goals

Users can review everything before submitting.

---

# Dashboard Logic

Admin

↓

Admin Dashboard

Investor

↓

If investment profile is incomplete

Redirect to Investment Profile Wizard

Else

↓

Investor Dashboard

---

# Database

Create relational tables.

Suggested tables:

users

investment_profiles

investment_questions

investment_question_options

investment_answers

investment_goals

risk_profiles

risk_assessments

financial_profiles

Avoid JSON columns for questionnaire data.

Use proper database relationships.

---
# Backend

Use Laravel best practices.

Separate:

- Models
- Controllers
- Form Requests
- Services

Keep business logic inside Service classes.

Avoid fat controllers.

---

# Frontend

Laravel + React + Inertia.

Requirements:

- Responsive
- Multi-step wizard
- Step validation
- Progress indicator
- Save progress automatically

---
# Future Consideration

Design the architecture so future features can be added without major changes.

Future modules may include:
- Portfolio Management
- Investment Recommendation
- AI Analysis
- Advisor Review
- Reporting
- PDF Export
Do not implement these features now.
Focus on building a clean and scalable foundation.