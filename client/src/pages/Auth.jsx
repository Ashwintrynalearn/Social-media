import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const initialState = {
  fullName: '',
  username: '',
  password: '',
  confirmPassword: '',
  bio: '',
  avatar: '',
};

const Auth = () => {
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(true);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, username, password, confirmPassword, bio, avatar } = form;

    if (isSignup && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { data } = await axios.post(
        `http://localhost:5001/auth/${isSignup ? 'signup' : 'login'}`,
        isSignup ? { fullName, username, password, bio, avatar } : { username, password }
      );
      cookies.set('token', data.token, { maxAge: 604800 }); // 7 days
      cookies.set('username', data.username, { maxAge: 604800 });
      cookies.set('fullName', data.fullName, { maxAge: 604800 });
      cookies.set('userId', data.userId, { maxAge: 604800 });
      cookies.set('avatar',data.avatar, {maxAge: 604800} );
      window.location.href = '/';
    } catch (error) {
      setError(error.response?.data?.message || 'Server error');
    }
  };

  const switchMode = () => {
    setIsSignup((prev) => !prev);
    setError('');
    setForm(initialState);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white">Peer Group</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Connect with your classmates</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border dark:border-gray-700">
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignup && (
              <>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Tell us about yourself"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Avatar URL
                  </label>
                  <input
                    name="avatar"
                    type="text"
                    value={form.avatar}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Enter avatar URL"
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                Username
              </label>
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter your password"
              />
            </div>
            {isSignup && (
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Confirm your password"
                />
              </div>
            )}
            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg focus:ring-4 focus:ring-blue-500/50"
              >
                {isSignup ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
            <div className="text-center mt-6 text-gray-600 dark:text-gray-400">
              <p>
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-blue-500 hover:text-blue-600"
                >
                  {isSignup ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;