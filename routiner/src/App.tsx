import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import MoodTracker from './components/MoodTracker';
import GratitudeJournal from './components/GratitudeJournal';
import ToDoList from './components/ToDoList';
import DailyPlanner from './components/DailyPlanner';
import Home from './components/Home';
import { Calendar, Smile, BookOpen, CheckSquare, Clock, LogOut } from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userId'));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserId(null); // Reset userId on logout
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#fbf8cc] to-[#b9fbc0]">
        {isLoggedIn && (
          <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <Smile className="h-8 w-8 text-[#f1c0e8]" />
                    <span className="ml-2 text-xl font-semibold text-gray-800">MoodTracker</span>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <a href="/dashboard" className="text-gray-700 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-[#cfbaf0] text-sm font-medium">
                      Dashboard
                    </a>
                    <a href="/mood-tracker" className="text-gray-700 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-[#cfbaf0] text-sm font-medium">
                      <Calendar className="mr-1 h-5 w-5" />
                      Mood Tracker
                    </a>
                    <a href="/gratitude-journal" className="text-gray-700 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-[#cfbaf0] text-sm font-medium">
                      <BookOpen className="mr-1 h-5 w-5" />
                      Gratitude Journal
                    </a>
                    <a href="/todo-list" className="text-gray-700 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-[#cfbaf0] text-sm font-medium">
                      <CheckSquare className="mr-1 h-5 w-5" />
                      To-Do List
                    </a>
                    <a href="/daily-planner" className="text-gray-700 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-[#cfbaf0] text-sm font-medium">
                      <Clock className="mr-1 h-5 w-5" />
                      Daily Planner
                    </a>
                  </div>
                </div>
                <div className="flex items-center">
                  <button onClick={handleLogout} className="text-gray-700 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-[#cfbaf0] text-sm font-medium">
                    <LogOut className="mr-1 h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Home />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />} />
            <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />} />
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/mood-tracker" element={isLoggedIn ? <MoodTracker userId={userId!} /> : <Navigate to="/login" />} />
            <Route path="/gratitude-journal" element={isLoggedIn ? <GratitudeJournal userId={userId!} /> : <Navigate to="/login" />} />
            <Route path="/todo-list" element={isLoggedIn ? <ToDoList userId={userId!} /> : <Navigate to="/login" />} />
            <Route path="/daily-planner" element={isLoggedIn ? <DailyPlanner userId={userId!} /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
