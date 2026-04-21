import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);

  const generateItinerary = async () => {
    if (!destination || !budget) return alert("Please fill in both fields");
    
    setLoading(true);
    setItinerary('');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ 
            role: 'user', 
            content: `Create a detailed 3-day travel itinerary for ${destination} with a budget of ${budget}. Provide the output in a clean, readable format.` 
          }],
        },
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setItinerary(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching data:", error);
      setItinerary("Failed to generate itinerary. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>AI Travel Planner</h1>
      <input 
        placeholder="Destination (e.g., Paris)" 
        onChange={(e) => setDestination(e.target.value)} 
      />
      <input 
        placeholder="Budget (e.g., $500)" 
        onChange={(e) => setBudget(e.target.value)} 
      />
      <button onClick={generateItinerary} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Plan'}
      </button>

      <div className="result">
        <pre>{itinerary}</pre>
      </div>
    </div>
  );
}

export default App;