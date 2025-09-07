import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateQuiz from './pages/CreateQuiz';
import AttemptQuiz from './pages/AttemptQuiz';
import Profile from './pages/Profile_with_quiz_results.jsx';
import AdminDashboard from './pages/AdminDashboard';
import JoinQuiz from './pages/JoinQuiz';


// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/create-quiz" element={<CreateQuiz />} />
              <Route path="/quiz/:id" element={<AttemptQuiz />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/join-quiz" element={<JoinQuiz />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;