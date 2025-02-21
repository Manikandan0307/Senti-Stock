import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Register from './components/Register'; // Add Register component import
import Login from './components/Login'; // Add Login component import
import { TrendingUp, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import SentimentAnalysis from './components/SentimentAnalysis';
import StockPrediction from './components/StockPrediction';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated'); // Check if logged in

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  return children; // Show protected component if authenticated
};

const ProtectedStockPrediction = () => {
  const hasSentimentCheck = sessionStorage.getItem('sentimentCheck');
  
  if (!hasSentimentCheck) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <Brain className="mx-auto text-blue-600 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Mindset Check Required</h2>
          <p className="text-gray-600 mb-6">
            Before viewing predictions, you need to check your market sentiment. This helps ensure you're in the right mindset for trading.
          </p>
          <Link
            to="/sentiment"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Check Your Mindset
          </Link>
        </div>
      </div>
    );
  }

  return <StockPrediction />; // Show StockPrediction if sentiment check passed
};

function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8"
    >
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            AI-Powered Stock Market Analysis
          </h1>
          <p className="text-xl text-gray-600">
            Combine sentiment analysis with advanced stock predictions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Link to="/sentiment">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <Brain className="text-blue-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Sentiment Analysis
              </h2>
              <p className="text-gray-600">
                Analyze your market sentiment before making investment decisions
              </p>
            </motion.div>
          </Link>

          <Link to="/prediction">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <TrendingUp className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Stock Predictions
              </h2>
              <p className="text-gray-600">
                Get AI-powered predictions for major Indian stocks
              </p>
            </motion.div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <img
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80"
            alt="Stock Market Analysis"
            className="rounded-2xl shadow-2xl mx-auto"
          />
        </div>
      </div>
    </motion.div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/sentiment" element={<SentimentAnalysis />} />
        <Route path="/prediction" element={
          <ProtectedRoute>
            <ProtectedStockPrediction />
          </ProtectedRoute>
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
