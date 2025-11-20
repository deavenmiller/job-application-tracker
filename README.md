# Job Search Organization

A Next.js application for tracking job applications with automatic information extraction from job descriptions.

## Features

- **Automatic Information Extraction**: Paste job descriptions and the system automatically extracts:
  - Company name
  - Job title
  - Pay range
  - Benefits
  - Employment type (Full-time, Part-time, Contract, Internship)
  - Job listing URL
  
- **Status Tracking**: Track your progress through the interview process with statuses:
  - Applied
  - Take-Home Assessment
  - Objective Assessment
  - Technical Interview
  - Behavioral Interview
  - Final Interview
  - Rejected
  - Waitlisted
  - Ghosted
  - Accepted

- **Full CRUD Operations**: 
  - Add new job applications
  - View all applications in a table
  - Edit any field for any application
  - Delete applications

- **Editable Fields**: All fields are editable in case the automatic extraction misses something:
  - Company
  - Job Title
  - Status
  - Job Link
  - Pay Range
  - Benefits
  - Employment Type
  - Date Applied

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **MongoDB** with Mongoose
- **Tailwind CSS** with DaisyUI
- **TypeScript** support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory with your MongoDB connection string:
```
MONGODB_URI=your_mongodb_connection_string
```

   You can get a free MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

1. **Adding a New Application**:
   - Click the "+ Add New Application" button
   - Paste the full job description in the text area
   - Click "Add Application"
   - The system will automatically extract information and create the application with status "Applied"

2. **Editing an Application**:
   - Click the "Edit" button on any job in the table
   - Modify any fields as needed
   - Click "Save Changes" to update

3. **Deleting an Application**:
   - Click the "Delete" button on any job
   - Confirm the deletion

## Project Structure

```
├── app/
│   ├── api/
│   │   └── jobs/
│   │       ├── route.js          # GET, POST /api/jobs
│   │       └── [id]/route.js      # GET, PUT, DELETE /api/jobs/:id
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── JobTracker.jsx            # Main container component
│   ├── FormAddJob.jsx            # Form for adding new jobs
│   ├── TableJobs.jsx             # Table displaying all jobs
│   └── RowJob.jsx                # Individual job row with edit functionality
├── lib/
│   ├── mongodb.js                # MongoDB connection utility
│   └── job-parser.js             # Job description parser
├── models/
│   └── JobApplication.js         # Mongoose schema
└── package.json
```

