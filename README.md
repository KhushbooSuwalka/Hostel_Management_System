# Hostel Management And Grievance Control System

A full-stack hostel management web application built for handling student access, room allotment requests, grievances, notices, and admin-side student management.

## Overview

This project provides two connected parts:

- `frontend/` - React + Vite user interface
- `backend/` - Express + MongoDB REST API

The system supports both student and admin workflows in one application.

## Features

- Student and admin login
- First-time password setup and password reset
- Student room allotment request submission
- Student grievance submission and grievance tracking
- Admin grievance management with status updates and replies
- Admin room request review and allotment reply handling
- Admin notice creation and deletion
- Admin student creation, editing, and deletion
- Protected admin and student pages with access checks

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- bcrypt
- dotenv
- cors

## Project Structure

```text
hostel-app/
├── backend/
│   ├── models/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── package.json
└── README.md
```

## Setup

### 1. Clone The Repository

```powershell
git clone <your-repository-url>
cd hostel-app
```

### 2. Install Backend Dependencies

```powershell
cd backend
npm install
```

### 3. Install Frontend Dependencies

```powershell
cd ..\frontend
npm install
```

## Environment Variables

Create a `.env` file inside `backend/` and add:

```env
MONGO_URI=your_mongodb_connection_string
```

## Run The Project

### Start Backend

From `backend/`:

```powershell
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### Start Frontend

From `frontend/`:

```powershell
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

## Main Pages

- `/` - Home page
- `/room` - Room allotment request page
- `/grievance` - Grievance submission and tracking page
- `/contact` - Contact page
- `/admin` - Admin dashboard
- `/set-password` - First-time password setup page

## Admin Capabilities

- View grievance records
- Update grievance status
- Reply to grievances
- Review room requests
- Update room request status
- Add allotted room and reply
- Post notices
- Delete notices
- Create new student entries
- Edit student information
- Delete student entries

## Student Capabilities

- Login as student
- Submit room allotment requests
- Track room request status
- Submit grievances
- View grievance replies and status

## Build Frontend

```powershell
cd frontend
npm run build
```

## Notes

- The frontend is configured to call the backend at `http://localhost:5000`
- Make sure the backend server is running before using the frontend
- MongoDB connection is required for data storage

## Future Improvements

- JWT-based authentication
- File upload support for grievance proof
- Better validation and form feedback
- Search and filter options for admin records
- Deployment-ready environment configuration
