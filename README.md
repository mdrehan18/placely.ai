# AI Interview Coach & Placement Tracker

This is a platform to help developers prepare for placements. It uses AI to run mock interviews, analyze resumes for ATS compatibility, and generate custom study plans.

## Features

- AI Interview Coach: A conversational bot that asks technical and behavioral questions, giving feedback and a rating for each answer.
- Resume Analyzer: Checks your resume and gives an ATS score along with specific strengths, weaknesses, and missing keywords.
- Smart Study Roadmap: Creates 1-month or 3-month study plans based on your goals and tracks your progress.
- Progress Tracking: Basic dashboard to see your stats and roadmap completion.

## Tech Stack

- Frontend: React (Vite), Tailwind CSS, Axios, Context API
- Backend: Node.js, Express.js
- Database: MongoDB
- Validation & AI: Zod, Groq API

## Setup Instructions

### Backend
1. Go to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a .env file (see example below)
4. Start the server: `npm run dev`

### Frontend
1. Go to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

## Environment Variables

Create a .env file in the backend directory with these keys:

```
PORT=5000
MONGODB_URI=your_mongodb_url
JWT_SECRET=any_random_string
GROQ_API_KEY=your_groq_key
FRONTEND_URL=http://localhost:5173
```

## Notes

- Make sure MongoDB is running before starting the backend.
- You need a Groq API key for the resume analyzer and interview coach to work.
- The default port for the backend is 5000 and frontend is 5173.

## Future Improvements

- Add voice support for the interview coach.
- Support for more file formats in the resume analyzer.
- PDF export for the study roadmaps.
- More detailed analytics for the DSA tracker.
