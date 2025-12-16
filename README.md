# Quiz App – Full-Stack Online Quiz Platform

A full-stack Quiz Application that allows users to create, attempt, and analyze quizzes with secure authentication, private access codes, leaderboards, and performance analytics.

**Live Demo:** https://quiz-frontend-0g4l.onrender.com/  
**GitHub Repository:** https://github.com/Subhash-2005/quiz  

---

## Features

###  User Authentication & Authorization
- User registration and login
- JWT-based token authentication
- Protected routes using authentication middleware

###  Quiz Management
- Create quizzes with title, description, difficulty, time limit, and questions
- Supports public and private quizzes
- Private quizzes secured using unique access codes
- Edit and delete quizzes by quiz creators

###  Quiz Attempting & Scoring
- Browse and attempt public quizzes
- Join private quizzes using access codes
- Automatic score calculation
- Attempt history tracking

###  Leaderboards & Analytics
- Global leaderboard based on user performance
- Quiz-specific leaderboards
- Quiz creators can view a ranked table of participants with scores in descending order
- User profile with statistics and analytics

###  Robust Backend & Performance
- RESTful API design using Express.js
- MongoDB schema design with proper relations
- Optimized queries for leaderboards
- Error handling and secure API access
- CORS handling for frontend-backend communication

---

##  Tech Stack

### Frontend
- React.js
- JavaScript (ES6+)
- HTML, CSS
- Axios

### Backend
- Node.js
- Express.js
- JWT (Authentication)
- bcrypt (Password hashing)

### Database
- MongoDB
- Mongoose

### Deployment
- Frontend & Backend hosted on Render

---

##  Project Structure

### Frontend – client/

| Path | Description |
|---|---|
| client/ | React frontend root |
| client/public/ | Public assets |
| client/public/index.html | Main HTML file |
| client/src/ | React source code |
| client/src/components/ | Reusable UI components |
| client/src/components/Leaderboard.jsx | Leaderboard table |
| client/src/components/QuizAttempt.jsx | Quiz attempt UI |
| client/src/components/QuizCard.jsx | Quiz card component |
| client/src/pages/ | Application pages |
| client/src/pages/Login.jsx | Login page |
| client/src/pages/Register.jsx | Register page |
| client/src/pages/Home.jsx | Home page |
| client/src/pages/CreateQuiz.jsx | Create quiz page |
| client/src/pages/MyQuizzes.jsx | User quizzes |
| client/src/pages/Profile.jsx | Profile & analytics |
| client/src/pages/LeaderboardPage.jsx | Leaderboard page |
| client/src/services/ | API services |
| client/src/services/authService.js | Auth APIs |
| client/src/services/quizService.js | Quiz APIs |
| client/src/utils/ | Utility helpers |
| client/src/utils/authHeader.js | JWT header helper |
| client/src/App.js | Root component |
| client/src/index.js | Entry point |
| client/src/styles.css | Global styles |
| client/package.json | Frontend dependencies |

---

### Backend – server/

| Path | Description |
|---|---|
| server/ | Backend root |
| server/controllers/ | Business logic |
| server/controllers/authController.js | Auth logic |
| server/controllers/quizController.js | Quiz logic |
| server/controllers/attemptController.js | Attempt & scoring |
| server/routes/ | API routes |
| server/routes/authRoutes.js | Auth routes |
| server/routes/quizRoutes.js | Quiz routes |
| server/routes/attemptRoutes.js | Attempt routes |
| server/models/ | MongoDB schemas |
| server/models/User.js | User schema |
| server/models/Quiz.js | Quiz schema |
| server/models/Attempt.js | Attempt schema |
| server/middleware/ | Middleware |
| server/middleware/authMiddleware.js | JWT middleware |
| server/config/ | Configuration |
| server/config/db.js | MongoDB connection |
| server/server.js | Server entry |
| server/package.json | Backend dependencies |

---

### Root Files

| Path | Description |
|---|---|
| .env | Environment variables |
| .gitignore | Git ignore rules |
| README.md | Project documentation |



---

##  Key Implementation Highlights

- JWT authentication with middleware protection
- Creator-only access for viewing participant scores
- Score calculation and leaderboard sorting at database level
- Secure REST APIs with proper authorization checks
- Clean and scalable code structure

---

##  How It Works (High-Level)

1. Users register and log in to receive a JWT token
2. Authenticated users can create quizzes (public/private)
3. Users attempt quizzes and submit answers
4. Scores are calculated automatically
5. Leaderboards and analytics are updated
6. Quiz creators can track participant performance

---

##  Future Enhancements

- AI-generated quiz questions
- Adaptive difficulty levels
- Real-time multiplayer quizzes
- Quiz recommendations based on user performance
- Admin dashboard for moderation

---

##  Author

**Subhash Talluri**  
- Full Stack Developer  
- GitHub: https://github.com/Subhash-2005  
- LinkedIn: https://linkedin.com/in/tallurisubhash  

---

 If you like this project, feel free to star the repository! 
