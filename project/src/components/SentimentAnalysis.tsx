import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const SentimentAnalysis: React.FC = () => {
  const [text, setText] = useState('');
  interface SentimentResult {
    sentiment: string;
    polarity: number;
  }

  const [result, setResult] = useState<SentimentResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const analyzeSentiment = async () => {
    if (!text.trim()) {
      alert('Please enter some text to analyze');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze-sentiment', {
        text: text
      });

      setResult(response.data);

      // Automatically navigate based on sentiment
      const sentiment = response.data.sentiment;
      if (sentiment === 'positive' || sentiment === 'neutral') {
        sessionStorage.setItem('sentimentCheck', 'true');
      }

      if (sentiment === 'negative') {
        const currentTime = new Date().getTime();
        sessionStorage.setItem('lastNegativeTime', currentTime.toString());

        setTimeout(() => {
          navigate('/');
        }, 3000);
      }

    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      alert('Error analyzing sentiment. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Stock Market Sentiment Analysis
          </h1>
          <p className="text-gray-600">
            Share your thoughts about the market to get personalized insights
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <p className="text-lg font-semibold text-gray-700 mb-4"><h2>How are you feeling today?</h2></p>

          <textarea
            className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Enter your market analysis or thoughts..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            onClick={analyzeSentiment}
            disabled={isAnalyzing}
            className={`mt-4 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 ${
              isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Brain size={20} />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Sentiment'}
          </button>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              {result.sentiment === 'positive' && (
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="text-green-600" size={24} />
                    <h3 className="text-xl font-semibold text-green-800">
                      Positive Sentiment Detected!
                    </h3>
                  </div>
                  <p className="text-green-700 mb-4">
                    Your analysis shows a positive outlook. Let's explore stock predictions!
                  </p>
                  <button
                    onClick={() => navigate('/prediction')}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    View Predictions
                  </button>
                </div>
              )}
              {result.sentiment === 'negative' && (
                <div className="bg-red-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="text-red-600" size={24} />
                    <h3 className="text-xl font-semibold text-red-800">
                      Negative Sentiment Detected
                    </h3>
                  </div>
                  <p className="text-red-700">
                    Your mindset appears cautious. Redirecting to home page in 3 seconds...
                  </p>
                </div>
              )}
              {result.sentiment === 'neutral' && (
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="text-yellow-600" size={24} />
                    <h3 className="text-xl font-semibold text-yellow-800">
                      Neutral Sentiment Detected
                    </h3>
                  </div>
                  <p className="text-yellow-700 mb-4">
                    Your analysis shows a balanced perspective.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate('/prediction')}
                      className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Continue to Predictions
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Return Home
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SentimentAnalysis;
