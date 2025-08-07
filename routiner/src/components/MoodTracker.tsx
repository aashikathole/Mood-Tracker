import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Smile, Frown, Meh, Angry, Heart } from 'lucide-react';
import axios from 'axios';

interface MoodTrackerProps {
  userId: string;
}

interface MoodEntry {
  _id: string;
  userId: string;
  date: string;
  mood: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MoodTracker: React.FC<MoodTrackerProps> = ({ userId }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const moods = [
    { emoji: '😄', icon: Smile, label: 'Happy', color: 'bg-green-200 hover:bg-green-300' },
    { emoji: '😢', icon: Frown, label: 'Sad', color: 'bg-blue-200 hover:bg-blue-300' },
    { emoji: '😐', icon: Meh, label: 'Neutral', color: 'bg-gray-200 hover:bg-gray-300' },
    { emoji: '😠', icon: Angry, label: 'Angry', color: 'bg-red-200 hover:bg-red-300' },
    { emoji: '😊', icon: Heart, label: 'Loved', color: 'bg-pink-200 hover:bg-pink-300' }
  ];

  // Fetch mood history for the current user
  const fetchMoodHistory = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Calculate start and end dates for the current month
      const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

      const response = await axios.get<MoodEntry[]>(`${API_URL}/api/moods`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });

      const newMoodHistory: Record<string, string> = {};
      response.data.forEach(entry => {
        const dateStr = new Date(entry.date).toISOString().split('T')[0];
        newMoodHistory[dateStr] = entry.mood;
      });

      setMoodHistory(newMoodHistory);
      const currentDateStr = formatDate(selectedDate);
      setSelectedMood(newMoodHistory[currentDateStr] || null);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load mood history';
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMoodHistory();
    }
  }, [userId, selectedDate.getMonth(), selectedDate.getFullYear()]);

  const handleMoodSelect = async (mood: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
  
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to track your mood');
      }
  
      const dateStr = formatDate(selectedDate);
  
      const response = await axios.post(
        `${API_URL}/api/moods`,
        {
          date: dateStr,
          mood,
          userId: userId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data) {
        setMoodHistory(prev => ({ ...prev, [dateStr]: mood }));
        setSelectedMood(mood);
        setSuccessMessage('Mood saved successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      let errorMessage = 'Failed to save mood';
  
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Unauthorized: Please log in again';
          localStorage.removeItem('token');
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }
  
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
    const dateStr = formatDate(newDate);
    setSelectedMood(moodHistory[dateStr] || null);
    setSuccessMessage(null);
    setError(null);
  };

  const renderMoodSquare = (date: Date) => {
    const dateStr = formatDate(date);
    const mood = moodHistory[dateStr];
    const isSelected = dateStr === formatDate(selectedDate);
    const isToday = dateStr === formatDate(new Date());

    return (
      <div
        key={dateStr}
        onClick={() => {
          setSelectedDate(date);
          setSelectedMood(mood || null);
          setSuccessMessage(null);
          setError(null);
        }}
        className={`
          p-2 border rounded-md cursor-pointer transition-all duration-200
          ${isSelected ? 'border-blue-400 border-2' : 'border-gray-200'}
          ${isToday ? 'ring-2 ring-pink-300' : ''}
          ${mood ? moods.find(m => m.label === mood)?.color : 'bg-white hover:bg-gray-100'}
        `}
      >
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-600">{date.getDate()}</span>
          {mood && <span className="text-lg">{moods.find(m => m.label === mood)?.emoji}</span>}
        </div>
      </div>
    );
  };

  if (isLoading && !Object.keys(moodHistory).length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <CalendarIcon className="mr-2 h-6 w-6 text-pink-400" />
        Mood Tracker
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-lg font-semibold text-gray-800 mb-2 block">
            Select Date
          </label>
          <input
            type="date"
            value={formatDate(selectedDate)}
            onChange={handleDateChange}
            max={formatDate(new Date())}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">How are you feeling?</h2>
          <div className="flex flex-wrap gap-3">
            {moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => handleMoodSelect(mood.label)}
                disabled={isLoading}
                className={`
                  p-2 rounded-full transition-all flex items-center gap-2
                  ${selectedMood === mood.label 
                    ? 'bg-blue-500 text-white transform scale-105' 
                    : mood.color}
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {React.createElement(mood.icon, { className: 'h-5 w-5' })}
                <span className="text-sm font-medium">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Monthly Overview</h2>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() }, (_, i) => {
            const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1);
            return date <= new Date() ? renderMoodSquare(date) : null;
          })}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default MoodTracker;