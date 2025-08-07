# ROUTINER  
Capture Mood | Manage Tasks | Improve Lifestyle

## Overview

**ROUTINER** is an all-in-one web application designed to help users manage their daily tasks, track moods, and foster a balanced, productive lifestyle. Inspired by leading apps like Todoist, Daylio, and Habitica, ROUTINER stands out by seamlessly integrating mood tracking and gratitude journaling with task management. It empowers users to gain emotional insight, improve productivity, and develop positive habits.

## Features

- **To-Do List**
  - Structured interface for organizing and prioritizing tasks
  - Add descriptions and deadlines, receive reminders
  - Mark tasks as done/undone

- **Mood Tracker**
  - Daily mood logging with emoji representation
  - Weekly/monthly visual mood analysis
  - View mood trends on calendar

- **Daily Productivity Planner**
  - Schedule tasks with priorities (High, Medium, Low)
  - Add timers and reminders for the day’s activities
  - Visual planner for time management

- **Gratitude Journal**
  - Log daily points of gratitude and positive experiences
  - Build a collection of gratitude notes for mindfulness

- **Progress Dashboard**
  - Visualize productivity and mood trends with charts/graphs
  - View activity history
  - Comprehensive dashboard to track holistic progress

## Objectives

- Deliver a platform merging task management and emotional health for holistic growth
- Improve task organization and tracking for enhanced efficiency
- Foster emotional insight via mood reflection
- Supply analytics to connect mood and productivity trends
- Support personal development through positive habit-building

## Tech Stack

ROUTINER leverages the **MERN** stack for a fully JavaScript-based, modern web application:

- **MongoDB**: Flexible, scalable NoSQL database for storing user, task, mood, and journal data
- **Express.js**: Backend framework for APIs, routing, and middleware
- **React.js**: Frontend library providing a dynamic, component-based single-page application
- **Node.js**: Server-side JavaScript runtime

## System Requirements

**Hardware Requirements**
- Processor: Intel i3 or above (i5/i7 recommended)
- RAM: 4GB minimum (8GB+ recommended)
- Storage: Sufficient for database and application files
- Display: 1366x768 minimum resolution

**Software Requirements**
- OS: Windows 10+, Ubuntu, macOS Mojave+
- Node.js (v16+ recommended)
- MongoDB (v4+ recommended)
- Modern browser: Chrome, Firefox, Edge, or Safari

## Database Design

ROUTINER uses a normalized MongoDB schema with the following main collections:

| **Collection** | **Key Attributes** |
|----------------|-------------------|
| users          | _id, name, email, password |
| moods          | _id, userId (ref: users), mood (Happy/Sad/etc.), createdAt, date |
| journal        | _id, userId, gratitude, appreciation, lesson, mood, date, createdAt |
| todos          | _id, userId, task, status (Done/NotDone), deadline |
| dailyPlanner   | _id, userId, tasks[], priority, date, time |

**Normalization:**  
All tables are in 3NF – no transitive dependencies, only atomic fields, strict key dependency for each attribute.

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/routiner.git
   cd routiner
   ```

2. **Backend Setup**
   - Go to the server directory (if present):
     ```bash
     cd server
     npm install
     ```
   - Create a `.env` file with your MongoDB URI and any JWT secrets.

3. **Frontend Setup**
   - In the client directory:
     ```bash
     cd ../client
     npm install
     ```

4. **Start Application**
   - Backend: `npm run dev`
   - Frontend: `npm start`
   - Visit: `http://localhost:3000` (or specified port)

5. **Database Initialization**
   - Ensure MongoDB is running locally or use a cloud MongoDB Atlas database.
   - Collections will be automatically created as users interact with the app.

## Usage

- **Register** with email and password
- **Sign In** and access the dashboard
- Add, prioritize, and check off tasks in the To-Do List
- Log your mood daily in the Mood Tracker
- Use the Daily Planner for scheduling
- Reflect daily in the Gratitude Journal
- Visualize trends on the dashboard and review progress

## Future Scope

- **Mood Analyzer**: Advanced mood pattern analysis & personalized tips
- **Enhanced Daily Planner**: Notifications & reminders for improved productivity
- **Gratitude Journal Reminders**: Automated prompts and motivational quotes
- **Mobile App**: Future mobile-friendly and offline-ready version
- **Admin Dashboard**: Enhanced management and analytics for administrators

## Project Structure

```
routiner/
├── server/        # Node.js, Express backend
├── client/        # React frontend
├── README.md
├── package.json
└── ...
```

## References

- [Todoist](https://todoist.com/inspiration)
- [Daylio](https://daylio.net/)
- [Day One](https://dayoneapp.com/blog/mood-journal)
- [Habitica](https://habitica.com/)
- [eMoodTracker](https://emoodtracker.com/)

## Author
- Aashika Thole

> **Empower your productivity and well-being with ROUTINER!**
