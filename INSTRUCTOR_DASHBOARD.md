# BioSim Lab - Instructor Dashboard Guide

## Quick Demo Guide for University Presentation

### Overview
The instructor dashboard allows professors to track student progress across lab simulations without requiring authentication (MVP).

---

## For Instructors

### 1. Create Your Class

**URL:** `/instructor/setup`

1. Visit the instructor setup page
2. Enter your information:
   - Your Name
   - Email Address
   - Class Name (e.g., "Molecular Biology 301")
3. Click "Generate Class Code"
4. You'll receive a unique code like: `MOLB-XY7Z`
5. Share this code with your students

### 2. View Your Dashboard

**URL:** `/instructor/[YOUR_CLASS_CODE]`

Example: `/instructor/MOLB-XY7Z`

The dashboard displays:

#### Quick Stats
- **Students:** Total number of students who have joined
- **Average Score:** Mean purity score across all students
- **Mastery Rate:** Percentage of students who achieved ≥0.75 score

#### Student Results Table
- **Student ID:** Anonymous identifier (e.g., "BioStudent-7b2a")
- **Best Score:** Highest score achieved by the student
- **Attempts:** Number of lab simulations completed
- **Status:**
  - ✅ Mastery (score ≥ 0.75)
  - 🔄 Practice (score < 0.75)

#### Export Data
Click "Export CSV" to download student results for grading or analysis.

---

## For Students

### Joining a Class

When students first visit BioSim Lab, they'll see a prompt:

**"Are you part of a university class?"**

- **Yes - I have a class code:** Enter the code provided by instructor
- **No - Practice on my own:** Continue anonymously without class tracking

Once a code is entered:
1. The code is validated against the database
2. If valid, the student's results are linked to that class
3. All future lab results are automatically associated with the class

### Student IDs

Students receive an anonymous ID like `BioStudent-7b2a`:
- Generated automatically on first use
- Stored in browser localStorage
- Used to track progress without requiring login

---

## How It Works (Technical)

### Database Schema

**classes table:**
- `id` (uuid)
- `instructor_name` (text)
- `instructor_email` (text)
- `class_name` (text)
- `class_code` (text, unique) - e.g., "MOLB-XY7Z"
- `created_at` (timestamp)

**lab_results table (updated):**
- `id` (uuid)
- `student_id` (text) - Anonymous student identifier
- `mission` (text)
- `purity_score` (numeric)
- `status` (text)
- `class_id` (uuid, nullable) - Links to classes table
- `created_at` (timestamp)

### Data Flow

1. **Student joins class:** Code validated → class_id stored in localStorage
2. **Student completes lab:** Results saved with student_id and class_id
3. **Instructor views dashboard:** Query filters results by class_id
4. **Dashboard calculates:**
   - Group results by student_id
   - Find best score per student
   - Calculate aggregate statistics
   - Determine mastery status (≥0.75 threshold)

---

## Demo Script

### Setup (Before Demo)
1. Visit `/instructor/setup`
2. Create a demo class
3. Note the class code
4. Open a few incognito windows
5. Join the class with different students
6. Complete some lab missions

### During Demo

**"Let me show you how BioSim Lab supports classroom learning..."**

1. **Show Instructor Setup**
   - "Creating a class takes 30 seconds"
   - Generate class code
   - "This code is shared with students"

2. **Show Student Experience**
   - Open new window
   - Show class code prompt
   - "Students can join with a code or practice independently"

3. **Show Dashboard**
   - Display student results
   - "At a glance, I can see who's mastering the technique"
   - Point out quick stats
   - "The mastery threshold is 0.75 purity score"

4. **Show CSV Export**
   - Click export button
   - "Results can be exported for grading or further analysis"

5. **Highlight Benefits**
   - No login required for MVP
   - Anonymous student tracking
   - Real-time progress monitoring
   - Easy data export

---

## Future Enhancements (Not in MVP)

- Instructor authentication
- Multiple classes per instructor
- Detailed student drill-down
- Performance visualizations
- Email notifications
- Individual student feedback
- Filtered views by technique
- Time-based analytics
- Comparative class statistics

---

## Support

For questions or issues, contact the BioSim Lab team.

**MVP Launch Date:** Demo Ready by Tuesday for Wednesday Presentation
**Target:** 200+ university students