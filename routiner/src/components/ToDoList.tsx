import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

interface Todo {
  _id: string;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  userId: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TodoList: React.FC<TodoListProps> = ({ userId }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/api/todo`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data) {
        setTodos(response.data);
        setError(null);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch todos';
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
      fetchTodos();
    }
  }, [userId]);

  const handleAddTodo = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTodo.trim()) return;

    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `${API_URL}/api/todo`,
        { text: newTodo },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        setTodos(prevTodos => [response.data, ...prevTodos]);
        setNewTodo('');
        setError(null);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to add todo';
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
      }
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const todo = todos.find(t => t._id === id);
      if (!todo) return;

      const response = await axios.patch(
        `${API_URL}/api/todo/${id}`,
        { completed: !todo.completed },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        setTodos(prevTodos => 
          prevTodos.map(t => t._id === id ? response.data : t)
        );
        setError(null);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update todo';
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
      }
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`${API_URL}/api/todo/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete todo';
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a3c4f3]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <CheckSquare className="mr-2 h-6 w-6 text-[#f1c0e8]" />
        To-Do List
      </h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleAddTodo} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#cfbaf0]"
            placeholder="Add a new task..."
            aria-label="New task"
          />
          <button
            type="submit"
            className="bg-[#a3c4f3] text-white p-2 rounded-r-md hover:bg-[#90dbf4] focus:outline-none focus:ring-2 focus:ring-[#cfbaf0]"
            aria-label="Add task"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </form>
      
      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo._id} className="flex items-center bg-[#fde4cf] bg-opacity-50 p-3 rounded-md">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo._id)}
              className="mr-2 h-5 w-5 text-[#a3c4f3] rounded focus:ring-[#cfbaf0]"
              aria-label={`Toggle task "${todo.text}"`}
            />
            <span className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {todo.text}
            </span>
            <button
              onClick={() => handleDeleteTodo(todo._id)}
              className="text-red-500 hover:text-red-700 focus:outline-none"
              type="button"
              aria-label={`Delete task "${todo.text}"`}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </li>
        ))}
      </ul>
      
      {todos.length === 0 && (
        <p className="text-gray-600 text-center mt-4">No tasks yet. Add some tasks to get started!</p>
      )}
    </div>
  );
};

export default TodoList;