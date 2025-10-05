# BTP Shipsy - Project Management and Evaluation Platform

## Full Documentation
[Read Documentation](https://drive.google.com/file/d/17WelkCE3BTcJY_uBmtnfonCcR--Cm7_Z/view?usp=sharing](https://docs.google.com/document/d/1xrGpOSzHvVVj50_Z9X8UhrMclPkonzFr/edit?usp=sharing&ouid=117958093781975400393&rtpof=true&sd=true))

## Overview
BTP Shipsy is a project management and evaluation platform designed for academic projects under the BTP program. The platform supports three types of users: students, supervisors, and admins. Each user role has distinct capabilities for interacting with project groups and evaluations.

- **Students** can create groups, view group details, and see evaluation results.
- **Supervisors** can view their assigned teams, evaluate teams, and view evaluation results.
- **Admins** can view all groups, manage group details, and view evaluation results.

The backend uses Node.js and Express.js with MongoDB for data storage. The frontend is developed with React.js.

## Features
- User registration and authentication for students, supervisors, and admins.
- Group creation with up to 3 student members and assignment of a supervisor.
- Submission and viewing of evaluation marks by supervisors.
- Admin dashboard for managing groups and viewing evaluations.
- Sorting and filtering functionality for groups.

## Architecture
- Backend: Node.js, Express.js
- Database: MongoDB
- Frontend: React.js
- API Base URL: `https://btp-shipsy-6zxs.onrender.com`

## Database Schema
### User
| Field     | Type    | Description                      |
|-----------|---------|--------------------------------|
| username  | String  | Unique username                 |
| password  | String  | Hashed password                 |
| role      | String  | Role: student, supervisor, admin|
| rollno    | String  | Unique roll number (students)  |
| createdAt | Date    | Creation timestamp             |

### Group
| Field       | Type            | Description                      |
|-------------|-----------------|--------------------------------|
| title       | String          | Project title                  |
| supervisorId| ObjectId (User) | Assigned supervisor             |
| members     | Array of ObjectIds (Users) | Group members (max 3 students)|
| isEvaluated | Boolean         | If group has been evaluated    |
| createdAt   | Date            | Creation timestamp             |

### Evaluation
| Field              | Type            | Description                      |
|--------------------|-----------------|--------------------------------|
| groupId            | ObjectId (Group)| Evaluated group                 |
| reportMarks        | Number (0-5)    | Marks for report                |
| literatureSurveyMarks| Number (0-5)   | Marks for literature survey    |
| workDoneMarks      | Number (0-5)    | Marks for work done            |
| presentationMarks  | Number (0-5)    | Marks for presentation         |
| totalMarks        | Number          | Sum of above marks             |
| createdAt          | Date            | Creation timestamp             |

## API Endpoints

### Authentication
- **POST /signup**: Register a new user (student, supervisor, admin).
- **POST /login**: Authenticate and start session.
- **GET /logout**: Logout current user.

### Group Management
- **POST /creategroup**: Create a new project group.
- **GET /displaygroup**: Get group details for logged-in student.
- **GET /displayall**: Get all groups (admin only).
- **PATCH /updategroup/:id**: Update group details (admin only).
- **DELETE /deletegroup/:id**: Delete a group (admin only).
- **GET /fetchsupervisors**: Get list of supervisors.
- **GET /fetchstudents**: Get list of students.
- **GET /displayteams**: Get supervisor’s assigned groups.

### Evaluation
- **POST /evaluateteam/:id**: Submit evaluation for a group.
- **GET /viewevaluation/:id**: Get evaluation details for a group.

## Dashboards

### Student Dashboard
- Create and view group.
- View evaluation results.
- Logout functionality.

### Supervisor Dashboard
- View assigned teams.
- Submit evaluations.
- View evaluated team results.

### Admin Dashboard
- View, update, delete groups.
- View evaluation results.
- Sort groups by creation date.
- Logout functionality.

## Installation

1. Clone the repository:
   git clone https://github.com/tripti2442/btp_shipsy.git
2. Install backend dependencies:
   cd backend
   npm install
3. Install frontend dependencies:
   cd ../frontend
   npm install
4. Setup MongoDB and update connection strings in backend configuration.
5. Run backend server:
   node index.js
6. Run frontend server:
   npm run dev
7. Access the application via browser at the frontend address (e.g., `http://localhost:3000`).


## Live Application
[btp-shipsy.vercel.app](https://btp-shipsy.vercel.app)

## Code Repository
[https://github.com/tripti2442/btp_shipsy](https://github.com/tripti2442/btp_shipsy)

## Demo Video
[Watch the Demo Video](https://drive.google.com/file/d/17WelkCE3BTcJY_uBmtnfonCcR--Cm7_Z/view?usp=sharing)



 
