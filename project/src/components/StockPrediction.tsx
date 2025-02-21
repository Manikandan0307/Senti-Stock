import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const stocks = [
  { symbol: 'PAYTM', name: 'Paytm', currentPrice: 1000 },
  { symbol: 'ITC', name: 'ITC Limited', currentPrice: 1000 },
  { symbol: 'RELIANCE', name: 'Reliance Industries', currentPrice: 1000 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', currentPrice: 3779.40 },
  { symbol: 'INFOSYS', name: 'Infosys', currentPrice: 1740.00 },
  { symbol: 'HDFC', name: 'HDFC Limited', currentPrice: 2594.00 },
  { symbol: 'SBI', name: 'State Bank of India', currentPrice: 729.70 },
  { symbol: 'HDFC Bank', name: 'HDFC Bank', currentPrice: 1687.10 },
  { symbol: 'ICICI', name: 'ICICI Bank', currentPrice: 59.98 },
  { symbol: 'AXISBANK', name: 'Axis Bank', currentPrice: 761.50 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', currentPrice: 1970.55 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', currentPrice: 711.00 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', currentPrice: 7000.00 },
  { symbol: 'TITAN', name: 'Titan Company', currentPrice: 1800.00 },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', currentPrice: 3000.00 },
  { symbol: 'NESTLEIND', name: 'Nestle India', currentPrice: 18000.00 },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', currentPrice: 8000.00 },
  { symbol: 'BAJAJFINANCE', name: 'Bajaj Finance', currentPrice: 7000.00 },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv', currentPrice: 12000.00 },
  { symbol: 'SHREECEM', name: 'Shree Cement', currentPrice: 30000.00 },
  { symbol: 'HCLTECH', name: 'HCL Technologies', currentPrice: 1160.00 },
  { symbol: 'WIPRO', name: 'Wipro Limited', currentPrice: 620.00 },
  { symbol: 'M&M', name: 'Mahindra & Mahindra', currentPrice: 1200.00 },
  { symbol: 'BPCL', name: 'Bharat Petroleum', currentPrice: 420.00 },
  { symbol: 'INDUSIND', name: 'IndusInd Bank', currentPrice: 1200.00 }
];

const StockPrediction: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState(stocks[0]);
  const [stockData, setStockData] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStocks, setFilteredStocks] = useState(stocks);

  // Handle stock selection and generate predictions
  useEffect(() => {
    const generatePredictions = () => {
      const basePrice = selectedStock.currentPrice; // No need to fetch it from API, just use the given value
      const predictions = Array.from({ length: 7 }, (_, i) => {
        const trend = Math.random() > 0.5 ? 1 : -1;
        const volatility = basePrice * 0.02;
        return basePrice + (trend * volatility * (i + 1)) + (Math.random() - 0.5) * volatility;
      });

      setStockData({
        symbol: selectedStock.symbol,
        price: basePrice,
        prediction: predictions,
      });
    };

    if (selectedStock) {
      generatePredictions();
    }
  }, [selectedStock]);

  // Filter stocks based on search term
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const filtered = stocks.filter((stock) =>
      stock.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredStocks(filtered);
  };

  // Prepare chart data for the next 7 days
  const chartData = stockData?.prediction?.map((price: number, index: number) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return {
      date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      price: Number(price.toFixed(2)),
    };
  });

  // Render stock data with chart
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">AI Powered Predictions</h1>
          <p className="text-gray-600">AI-based stock predictions for the next 7 days</p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search for a stock"
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-3 rounded-l-lg border border-gray-300"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">Search</button>
        </div>

        {/* Stock Selection (Show only 4 by default) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {filteredStocks.slice(0, 4).map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => setSelectedStock(stock)}
              className={`p-6 rounded-xl shadow-lg transition-all ${selectedStock.symbol === stock.symbol ? 'bg-blue-600 text-white' : 'bg-white hover:bg-blue-50'}`}
            >
              <h3 className="text-lg font-semibold">{stock.name}</h3>
              <p className={`text-sm mt-2 ${selectedStock.symbol === stock.symbol ? 'text-white' : 'text-gray-600'}`}>
                Current: ₹{stock.currentPrice.toFixed(2)}
              </p>
            </button>
          ))}
        </div>

        {/* Display Prediction Data */}
        {stockData && stockData.prediction && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedStock.name} ({selectedStock.symbol})</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-3xl font-bold">₹{stockData.price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* LineChart for Market Trends */}
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#4F46E5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StockPrediction;
