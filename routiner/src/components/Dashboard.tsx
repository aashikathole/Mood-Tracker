import { useState } from 'react';
import { Calendar, BookOpen, CheckSquare, Heart, Award, Sun, Github, Twitter, Mail, Coffee } from 'lucide-react';

function Dashboard() {
  const [userName, setUserName] = useState('User');
  
  const getPageTitle = () => 'Routiner';

  const timeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  return (
    <div className="min-h-screen bg-[#FBF8CC]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#F1C0E8] to-[#CFBAF0] rounded-2xl p-8 shadow-lg">
            <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-sm">
              {getPageTitle()}
            </h1>
            <p className="text-white text-lg opacity-90">Good {timeOfDay()}, {userName}! ✨</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mood Tracker Feature */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#FFCFD2]/20">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-[#FBF8CC] rounded-lg">
                  <Sun className="h-6 w-6 text-[#FDE4CF]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#F1C0E8]">Mood Tracker</h2>
                  <p className="text-gray-600 text-sm mt-1">Track your emotional journey</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600">
                  • Interactive calendar view showing your daily moods
                </p>
                <p className="text-gray-600">
                  • Color-coded emotions for easy visualization
                </p>
                <p className="text-gray-600">
                  • Monthly mood patterns and insights
                </p>
              </div>
            </div>

            {/* Journal Feature */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#A3C4F3]/20">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-[#F1C0E8] rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#CFBAF0]">Daily Journal</h2>
                  <p className="text-gray-600 text-sm mt-1">Document your thoughts</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600">
                  • Guided prompts for meaningful reflection
                </p>
                <p className="text-gray-600">
                  • Daily gratitude and lesson sections
                </p>
                <p className="text-gray-600">
                  • Private and secure journaling space
                </p>
              </div>
            </div>

            {/* Task Manager Feature */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#B9FBC0]/20">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-[#98F5E1] rounded-lg">
                  <CheckSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#F1C0E8]">Task Manager</h2>
                  <p className="text-gray-600 text-sm mt-1">Stay organized</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600">
                  • Simple and intuitive task management
                </p>
                <p className="text-gray-600">
                  • Progress tracking and completion history
                </p>
                <p className="text-gray-600">
                  • Priority-based organization
                </p>
              </div>
            </div>

            {/* Streak System Feature */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#FDE4CF]/20">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-[#B9FBC0] rounded-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#CFBAF0]">Habit Streaks</h2>
                  <p className="text-gray-600 text-sm mt-1">Build consistency</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600">
                  • Daily streak tracking for activities
                </p>
                <p className="text-gray-600">
                  • Achievement milestones and rewards
                </p>
                <p className="text-gray-600">
                  • Visual progress indicators
                </p>
              </div>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg mt-8 border border-[#CFBAF0]/20">
            <h2 className="text-2xl font-semibold text-[#F1C0E8] mb-6">Getting Started ✨</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-4">
                <div className="p-4 bg-[#FBF8CC] rounded-full mb-4">
                  <Heart className="h-7 w-7 text-[#FDE4CF]" />
                </div>
                <h3 className="font-medium text-[#F1C0E8] mb-2">Track Your Mood</h3>
                <p className="text-gray-600 text-sm">Start by logging your daily mood to build emotional awareness</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="p-4 bg-[#F1C0E8] rounded-full mb-4">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-medium text-[#CFBAF0] mb-2">Write Your Story</h3>
                <p className="text-gray-600 text-sm">Reflect on your day through guided journal prompts</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="p-4 bg-[#98F5E1] rounded-full mb-4">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-medium text-[#F1C0E8] mb-2">Build Habits</h3>
                <p className="text-gray-600 text-sm">Create and maintain positive daily routines</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 border-t border-[#CFBAF0]/20 pt-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#F1C0E8]">Routiner</h3>
                  <p className="text-gray-600 text-sm">Your daily companion for building better habits and maintaining a balanced lifestyle.</p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#CFBAF0]">Features</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>Mood Tracking</li>
                    <li>Daily Journal</li>
                    <li>Task Management</li>
                    <li>Habit Streaks</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#F1C0E8]">Resources</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>Documentation</li>
                    <li>Privacy Policy</li>
                    <li>Terms of Service</li>
                    <li>Help Center</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#CFBAF0]">Connect</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-[#F1C0E8] hover:text-[#CFBAF0] transition-colors">
                      <Github className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-[#F1C0E8] hover:text-[#CFBAF0] transition-colors">
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-[#F1C0E8] hover:text-[#CFBAF0] transition-colors">
                      <Mail className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-[#F1C0E8] hover:text-[#CFBAF0] transition-colors">
                      <Coffee className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-[#CFBAF0]/20">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Routiner. All rights reserved by Us.</p>
                  <div className="flex space-x-6 mt-4 md:mt-0">
                    <a href="#" className="text-sm text-gray-600 hover:text-[#F1C0E8]">Privacy</a>
                    <a href="#" className="text-sm text-gray-600 hover:text-[#F1C0E8]">Terms</a>
                    <a href="#" className="text-sm text-gray-600 hover:text-[#F1C0E8]">Contact</a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;