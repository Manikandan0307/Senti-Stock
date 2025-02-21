import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    mobile_number: '',
    age: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate password match and length
    if (formData.password !== formData.confirm_password) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      console.log('Sending registration request...');
      const response = await axios.post('http://localhost:5000/register', formData);
      console.log('Response:', response);
      setSuccessMessage(response.data.message);
      setErrorMessage('');
      setFormData({
        name: '',
        mobile_number: '',
        age: '',
        email: '',
        password: '',
        confirm_password: '',
      });
    } catch (error) {
      console.log('Error:', error);
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.error || 'Registration failed');
      } else if (axios.isAxiosError(error) && error.request) {
        setErrorMessage('No response from the server. Please check your network.');
      } else {
        setErrorMessage('Registration failed due to an unexpected error');
      }
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-8">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full sm:w-96">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="text"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
        {successMessage && (
          <div className="text-green-500 text-center mt-4">
            <p>{successMessage}</p>
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
