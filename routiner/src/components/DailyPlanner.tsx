import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface Task {
  _id: string;
  text: string;
  time: string;
  priority: 'High' | 'Medium' | 'Low';
  userId: string;
}

interface DailyPlannerProps {
  userId: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DailyPlanner: React.FC<DailyPlannerProps> = ({ userId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/api/planner`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data) {
        setTasks(response.data);
        setError(null);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch tasks';
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
      fetchTasks();
    }
  }, [userId]);

  const handleAddTask = async () => {
    if (!newTask.trim() || !newTime) return;

    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `${API_URL}/api/planner`,
        {
          text: newTask,
          time: newTime,
          priority: newPriority,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        setTasks(prevTasks => [response.data, ...prevTasks]);
        setNewTask('');
        setNewTime('');
        setNewPriority('Medium');
        setError(null);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to add task';
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
      }
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`${API_URL}/api/planner/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete task';
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
      }
    }
  };

  const getPriorityStyle = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return 'bg-gradient-to-r from-rose-100 to-rose-200 border-l-4 border-rose-400';
      case 'Medium':
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-400';
      case 'Low':
        return 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-l-4 border-emerald-400';
    }
  };

  const renderTasks = (priority: 'High' | 'Medium' | 'Low') => {
    return tasks
      .filter(task => task.priority === priority)
      .sort((a, b) => a.time.localeCompare(b.time))
      .map(task => (
        <li 
          key={task._id} 
          className={`${getPriorityStyle(priority)} p-4 rounded-lg shadow-sm 
            transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-['Playfair_Display'] text-lg text-gray-700">
                {task.time}
              </span>
              <span className="font-['Dancing_Script'] text-xl text-gray-800">
                {task.text}
              </span>
            </div>
            <button
              onClick={() => handleDeleteTask(task._id)}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
              aria-label={`Delete task "${task.text}"`}
              type="button"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </li>
      ));
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-xl p-8 space-y-8 
        bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]">
        <div className="text-center mb-8">
          <h1 className="font-['Playfair_Display'] text-4xl text-gray-800 mb-2 flex items-center justify-center">
            <Clock className="mr-3 h-8 w-8 text-indigo-400" />
            Daily Planner
          </h1>
          <p className="font-['Dancing_Script'] text-xl text-gray-600">
            Plan your day with grace and purpose
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-inner">
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-grow p-3 rounded-lg border-2 border-gray-200 focus:border-indigo-300 
                  focus:ring focus:ring-indigo-200 focus:ring-opacity-50 
                  font-['Source_Serif_Pro'] text-lg"
                placeholder="Write your task here..."
              />
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-32 p-3 rounded-lg border-2 border-gray-200 focus:border-indigo-300 
                  focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            <div className="flex justify-between items-center">
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                className="p-3 rounded-lg border-2 border-gray-200 focus:border-indigo-300 
                  focus:ring focus:ring-indigo-200 focus:ring-opacity-50 
                  font-['Source_Serif_Pro'] text-lg"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>

              <button
                onClick={handleAddTask}
                className="bg-indigo-500 text-white px-6 py-3 rounded-lg 
                  hover:bg-indigo-600 transform transition-all duration-200 
                  hover:scale-105 focus:outline-none focus:ring-2 
                  focus:ring-indigo-500 focus:ring-opacity-50 
                  flex items-center space-x-2"
                type="button"
              >
                <Plus className="h-5 w-5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8 mt-8">
          {['High', 'Medium', 'Low'].map((priority) => (
            <div key={priority} className="space-y-4">
              <h2 className={`font-['Playfair_Display'] text-2xl flex items-center
                ${priority === 'High' ? 'text-rose-600' : 
                  priority === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
                <CheckCircle className="mr-2 h-6 w-6" />
                {priority} Priority Tasks
              </h2>
              <ul className="space-y-3">
                {renderTasks(priority as 'High' | 'Medium' | 'Low')}
              </ul>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-8">
            <p className="font-['Dancing_Script'] text-2xl text-gray-500">
              Your canvas awaits... Start planning your beautiful day!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyPlanner;