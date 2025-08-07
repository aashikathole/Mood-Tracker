import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// MongoDB Connection with specific database
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'moodtrackerDB'
})
.then(() => console.log('Connected to MongoDB - moodtrackerDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Schema Definitions
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'users' });

const journalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  lesson: { type: String, required: true },
  appreciation: { type: String, required: true },
  gratitude: { type: String, required: true },
  mood: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'journal' });

const moodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  mood: { type: String, required: true, enum: ['Happy', 'Sad', 'Neutral', 'Angry', 'Loved'] },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'moods' });

const todoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'todo' });

const plannerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  time: { type: String, required: true },
  priority: { type: String, required: true, enum: ['High', 'Medium', 'Low'] },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'planner' });

// Models
const User = mongoose.model('User', userSchema);
const Journal = mongoose.model('Journal', journalSchema);
const Mood = mongoose.model('Mood', moodSchema);
const Todo = mongoose.model('Todo', todoSchema);
const Planner = mongoose.model('Planner', plannerSchema);

// Middleware
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Token verification failed:', err);
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Authentication failed' });
  }
};

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Mood Routes - Updated
app.post('/api/moods', verifyToken, async (req, res) => {
  try {
    const { mood, date } = req.body;
    const userId = req.userId;

    console.log('Received mood data:', { mood, date, userId });

    if (!mood || !date) {
      return res.status(400).json({ message: 'Mood and date are required' });
    }

    if (!['Happy', 'Sad', 'Neutral', 'Angry', 'Loved'].includes(mood)) {
      return res.status(400).json({ message: 'Invalid mood value' });
    }

    const moodDate = new Date(date);
    moodDate.setUTCHours(0, 0, 0, 0);

    try {
      const existingMood = await Mood.findOne({
        userId,
        date: {
          $gte: moodDate,
          $lt: new Date(moodDate.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      let savedMood;

      if (existingMood) {
        existingMood.mood = mood;
        savedMood = await existingMood.save();
      } else {
        const newMood = new Mood({
          userId,
          date: moodDate,
          mood
        });
        savedMood = await newMood.save();
      }

      console.log('Saved mood:', savedMood);
      res.status(200).json(savedMood);
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save mood to database');
    }
  } catch (error) {
    console.error('Save mood error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to save mood',
      error: error.toString()
    });
  }
});

app.get('/api/moods', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;
    
    const queryStartDate = startDate ? new Date(startDate) : new Date();
    queryStartDate.setUTCHours(0, 0, 0, 0);

    const queryEndDate = endDate ? new Date(endDate) : new Date(queryStartDate);
    queryEndDate.setUTCHours(23, 59, 59, 999);

    console.log('Fetching moods for:', { userId, startDate: queryStartDate, endDate: queryEndDate });

    const moods = await Mood.find({
      userId,
      date: { 
        $gte: queryStartDate,
        $lte: queryEndDate
      }
    }).sort({ date: 1 });

    console.log('Found moods:', moods);
    res.json(moods);
  } catch (error) {
    console.error('Fetch moods error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch moods',
      error: error.message 
    });
  }
});
// Journal Routes
app.post('/api/journal', verifyToken, async (req, res) => {
  try {
    const { lesson, appreciation, gratitude, mood, date } = req.body;
    const userId = req.userId;

    if (!lesson || !appreciation || !gratitude || !mood) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const journalDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(journalDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(journalDate);
    endOfDay.setHours(23, 59, 59, 999);

    let entry = await Journal.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });

    if (entry) {
      entry.lesson = lesson;
      entry.appreciation = appreciation;
      entry.gratitude = gratitude;
      entry.mood = mood;
      await entry.save();
    } else {
      entry = new Journal({
        userId,
        date: journalDate,
        lesson,
        appreciation,
        gratitude,
        mood
      });
      await entry.save();
    }

    res.json(entry);
  } catch (error) {
    console.error('Journal entry error:', error);
    res.status(500).json({ message: 'Failed to save journal entry', error: error.message });
  }
});

app.get('/api/journal', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const entries = await Journal.find({ userId })
      .sort({ date: -1 })
      .limit(30);

    res.json(entries);
  } catch (error) {
    console.error('Fetch journal entries error:', error);
    res.status(500).json({ message: 'Failed to fetch journal entries', error: error.message });
  }
});

// Todo Routes
app.post('/api/todo', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.userId;

    if (!text) {
      return res.status(400).json({ message: 'Todo text is required' });
    }

    const todo = new Todo({
      userId,
      text,
      completed: false
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ message: 'Failed to create todo', error: error.message });
  }
});

app.get('/api/todo', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    console.error('Fetch todo error:', error);
    res.status(500).json({ message: 'Failed to fetch todo', error: error.message });
  }
});

app.patch('/api/todo/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const userId = req.userId;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      { completed },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ message: 'Failed to update todo', error: error.message });
  }
});

app.delete('/api/todo/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const todo = await Todo.findOneAndDelete({ _id: id, userId });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ message: 'Failed to delete todo', error: error.message });
  }
});

//planner routes
app.post('/api/planner', verifyToken, async (req, res) => {
  try {
    const { text, time, priority } = req.body;
    const userId = req.userId;

    if (!text || !time || !priority) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const task = new Planner({
      userId,
      text,
      time,
      priority
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Create planner task error:', error);
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
});

app.get('/api/planner', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const tasks = await Planner.find({ userId }).sort({ time: 1 });
    res.json(tasks);
  } catch (error) {
    console.error('Fetch planner tasks error:', error);
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});

app.delete('/api/planner/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await Planner.findOneAndDelete({ _id: id, userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete planner task error:', error);
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});