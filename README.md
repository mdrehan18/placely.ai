# placely

A platform to help students and developers prepare for job placements. It uses AI to run mock interviews, analyze resumes, and create study plans.

## Features

- **AI Interview Coach**: Chat-based mock interviews with feedback and ratings.
- **Resume Analyzer**: Get an ATS score and tips for your resume.
- **Study Roadmaps**: AI-generated study plans based on your goals.
- **DSA Tracker**: Keep track of your problem-solving progress.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI**: Groq API

## Setup

### Backend
1. `cd backend`
2. `npm install`
3. Create `.env` (use the template below)
4. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Environment Variables

Backend `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=any_random_string
GROQ_API_KEY=your_groq_key
CLIENT_URL=http://localhost:5173
```

Frontend `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```
