# RESTful Task Tracker Dashboard

A comprehensive web application demonstrating REST API concepts through a task management system. Built with Node.js, Express.js, and a clean HTML/CSS frontend using Tailwind CSS.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete tasks
- **RESTful API**: Full REST API with GET, POST, PUT, DELETE endpoints
- **Interactive Dashboard**: Clean, responsive UI with task cards
- **Request Logging**: Visual log of all API requests with method indicators
- **Statistics Chart**: Doughnut chart showing task completion statistics
- **Real-time Updates**: Dynamic updates without page refresh

## API Endpoints

- `GET /api/tasks` - Retrieve all tasks
- `GET /api/tasks/:id` - Retrieve a single task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/logs` - Retrieve request logs
- `GET /api/stats` - Get task statistics

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open your browser to `http://localhost:3000`

## Development

For development with auto-restart:
```bash
npm run dev
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, Tailwind CSS, JavaScript
- **Charts**: Chart.js
- **Middleware**: CORS, Body Parser

## Project Structure

```
├── server.js          # Express server and API routes
├── package.json       # Dependencies and scripts
├── public/
│   ├── index.html     # Main dashboard page
│   └── app.js         # Frontend JavaScript
└── README.md          # This file
```

## Educational Value

This project serves as an excellent example of:
- REST API design principles
- HTTP methods and status codes
- Client-server communication
- Frontend-backend integration
- Modern web development practices