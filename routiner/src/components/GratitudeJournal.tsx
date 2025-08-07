import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Save, BookOpenCheck } from 'lucide-react';
import axios from 'axios';

interface JournalEntry {
  _id: string;
  userId: string;
  date: string;
  lesson: string;
  appreciation: string;
  gratitude: string;
  mood: string;
  createdAt: string;
}

interface GratitudeJournalProps {
  userId: string;
}

const GratitudeJournal: React.FC<GratitudeJournalProps> = ({ userId }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({
    lesson: '',
    appreciation: '',
    gratitude: '',
    mood: 'Peaceful'
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (userId) {
      fetchEntries();
    }
  }, [userId]);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${apiUrl}/api/journal`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setEntries(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(`Failed to load journal entries: ${errorMessage}`);
      } else {
        setError('Failed to load journal entries');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const payload = {
        ...newEntry,
        date: selectedDate,
        userId
      };

      await axios.post(
        `${apiUrl}/api/journal`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess('Journal entry saved successfully!');
      setNewEntry({ lesson: '', appreciation: '', gratitude: '', mood: 'Peaceful' });
      fetchEntries();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(`Failed to save entry: ${errorMessage}`);
      } else {
        setError('Failed to save journal entry');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[90rem] mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - New Entry Form */}
        <div className="bg-white shadow-lg rounded-xl p-8 h-fit">
          <h1 className="text-3xl font-['Playfair_Display'] text-gray-800 mb-6 flex items-center">
            <BookOpen className="mr-3 h-8 w-8 text-[#f1c0e8]" />
            New Journal Entry
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-6">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cfbaf0] font-['Source_Serif_Pro']"
              />
            </div>

            <div className="space-y-6">
              {[
                { label: "Today's Valuable Lesson", field: 'lesson', placeholder: 'What did you learn today?' },
                { label: 'Moment of Appreciation', field: 'appreciation', placeholder: 'What touched your heart today?' },
                { label: 'Gratitude Reflection', field: 'gratitude', placeholder: 'What are you grateful for?' }
              ].map(({ label, field, placeholder }) => (
                <div key={field} className="journal-section">
                  <label className="block text-xl font-['Playfair_Display'] text-gray-700 mb-2">
                    {label}
                  </label>
                  <textarea
                    value={newEntry[field as keyof typeof newEntry]}
                    onChange={(e) => setNewEntry({ ...newEntry, [field]: e.target.value })}
                    className="w-full p-4 border border-gray-300 rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#cfbaf0] font-['Source_Serif_Pro']"
                    placeholder={placeholder}
                    required
                  />
                </div>
              ))}

              <div className="journal-section">
                <label className="block text-xl font-['Playfair_Display'] text-gray-700 mb-2">
                  Current Mood
                </label>
                <select
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cfbaf0] font-['Source_Serif_Pro']"
                >
                  {['Peaceful', 'Joyful', 'Grateful', 'Blessed', 'Hopeful', 'Reflective'].map((mood) => (
                    <option key={mood} value={mood}>{mood}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#a3c4f3] text-white py-3 px-6 rounded-lg hover:bg-[#90dbf4] focus:outline-none focus:ring-2 focus:ring-[#cfbaf0] transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center disabled:opacity-50 font-['Playfair_Display']"
            >
              {loading ? 'Saving...' : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Entry
                </>
              )}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}
          </form>
        </div>

        {/* Right Column - Previous Entries */}
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-3xl font-['Playfair_Display'] text-gray-800 mb-6 flex items-center">
            <BookOpenCheck className="mr-3 h-8 w-8 text-[#cfbaf0]" />
            Previous Entries
          </h2>

          <div className="overflow-y-auto max-h-[800px] pr-2 custom-scrollbar">
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <p className="font-['Dancing_Script'] text-2xl text-gray-500">
                  No entries yet. Start your gratitude journey today!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <div
                    key={entry._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-[#cfbaf0] transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                  >
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => setExpandedEntry(expandedEntry === entry._id ? null : entry._id)}
                    >
                      <div>
                        <p className="text-lg font-['Playfair_Display']">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-gray-600 font-['Source_Serif_Pro']">Mood: {entry.mood}</p>
                      </div>
                      {expandedEntry === entry._id ? (
                        <ChevronUp className="h-5 w-5 text-[#cfbaf0]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-[#cfbaf0]" />
                      )}
                    </div>

                    {expandedEntry === entry._id && (
                      <div className="mt-4 space-y-4 pl-4 border-l-2 border-[#cfbaf0]">
                        {[
                          { title: 'Lesson Learned', content: entry.lesson },
                          { title: 'Appreciation', content: entry.appreciation },
                          { title: 'Gratitude', content: entry.gratitude }
                        ].map(({ title, content }) => (
                          <div key={title}>
                            <h3 className="text-lg font-['Playfair_Display'] text-gray-700">{title}:</h3>
                            <p className="mt-1 text-gray-600 font-['Source_Serif_Pro']">{content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GratitudeJournal;