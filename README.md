# Placely.ai 🚀

Placely.ai is a professional, AI-powered platform designed to help students and developers master the recruitment process. From analyzing resumes with industry-standard ATS logic to simulating real-world technical interviews, Placely.ai is your ultimate placement companion.

## ✨ Features

### 🤖 AI Interview Coach
- **Conversational AI**: Engage in a real-time, 5-round interview simulation.
- **Dynamic Difficulty**: The AI adjusts questions based on your performance.
- **Structured Feedback**: Receive per-answer ratings, feedback, and improvement tips.
- **Comprehensive Report**: Get a final performance summary and a readiness score.

### 📄 ATS Resume Analyzer
- **Expert Evaluation**: Analyze your resume against senior recruiter standards.
- **ATS Scoring**: Get an instant score from 0 to 100.
- **Keyword Optimization**: Identify missing industry keywords crucial for passing automated filters.
- **Actionable Tips**: Detailed lists of strengths, weaknesses, and specific suggestions for improvement.

### 🗺️ Smart Roadmap Generator
- **Personalized Planning**: Generate custom study roadmaps based on your career goals and timeline.
- **Task Tracking**: Interactive daily tasks with progress monitoring.
- **Milestone Management**: Stay organized with structured learning phases.

### 📊 DSA Tracker
- **Progress Monitoring**: Track your Data Structures and Algorithms practice.
- **Problem Sorting**: Organize problems by difficulty and topic.
- **Visual Analytics**: Monitor your solving consistency and skill growth.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Lucide React, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **AI Engine**: Groq API (Llama 3.3 70B & Llama 3.1 8B)
- **Real-time**: Socket.io
- **Security**: JWT Authentication, Bcrypt Password Hashing
- **Deployment**: Docker Support (Dockerfile & Docker Compose)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance
- Groq API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mdrehan18/placely.ai.git
   cd placely.ai
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GROQ_API_KEY=your_groq_api_key
   FRONTEND_URL=http://localhost:5173
   ```
   Start the backend:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the App**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📄 License
This project is licensed under the MIT License.
