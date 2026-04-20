# SAP H2R Management System

A frontend HR workflow project that models the SAP Hire-to-Retire (H2R) lifecycle. The app is built as an interactive dashboard where you can add employees, process payroll, and complete offboarding actions in one place.

## Project Overview

This project is designed to demonstrate a practical end-to-end employee lifecycle flow:

1. Track workforce health from a single dashboard
2. Add and manage employee records
3. Run payroll for active employees
4. Complete employee termination and capture exit details

The current implementation is intentionally lightweight and runs fully on the client side, making it easy to understand, demo, and extend.

## Core Modules

### 1. Dashboard

- Shows total, active, and inactive employee counts
- Displays payroll processing summary
- Provides quick action shortcuts to major workflows

### 2. Employee Management

- Add new employees with ID, department, role, salary, and joining date
- Search employees by name or employee ID
- View all employees in a tabular format
- Remove employee records

### 3. Payroll Management

- Processes payroll for active employees only
- Generates payroll records by month
- Applies a fixed deduction rule:
	- Deductions = 15% of gross salary
	- Net salary = 85% of gross salary

### 4. Offboarding

- Lists active employees eligible for termination
- Captures last working day and termination reason
- Moves employee status from active to inactive
- Displays terminated employees with offboarding details

## Data Model (Current)

### Employee

- `id`
- `name`
- `empId`
- `department`
- `role`
- `salary`
- `joiningDate`
- `status` (`active` or `inactive`)
- Optional termination fields:
	- `terminationDate`
	- `terminationReason`

### Payroll Record

- `empId`
- `name`
- `grossSalary`
- `deductions`
- `netSalary`
- `month`

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI based component primitives

## Project Structure

```text
app/
	layout.tsx          # App metadata and root layout
	page.tsx            # Main H2R dashboard and all module logic
components/
	ui/                 # Reusable UI component library
public/
	h2r-app.html        # Static reference walkthrough page
styles/
	globals.css         # Global styles
```

## Getting Started

### Prerequisites

- Node.js LTS
- npm

### Install Dependencies

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Production Build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```


## Recommended Next Enhancements

1. Add persistent storage with an API and database
2. Add authentication and role permissions (HR, Finance, Admin)
3. Add validation and audit logs for critical actions
4. Add payslip export and reporting
5. Add SAP integration points for real enterprise workflows

## Purpose

This repository is a capstone-style implementation focused on clarity of flow and functionality, suitable for demos, learning, and as a base for a production-ready HR lifecycle system.
