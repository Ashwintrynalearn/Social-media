import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

const cookies = new Cookies();

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const userId = cookies.get('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userId) {
        setError('Please log in to discover users');
        return;
      }
      try {
        const query = searchQuery.trim();
        console.log('Fetching users:', { userId, query }); // Debug
        const response = await axios.get('http://localhost:5001/api/feed/users', {
            params: { userId }, // this must match the cookie exactly
          });
          
        console.log('Discover users response:', response.data); // Debug
        setUsers(response.data);
        setError('');
      } catch (error) {
        console.error('Fetch users error:', error.response?.data || error.message); // Debug
        setError(error.response?.data?.message || 'Failed to load users');
      }
    };
    fetchUsers();
  }, [userId, searchQuery]);

  const handleFollow = async (followeeId) => {
    if (!userId) {
      setError('Please log in to follow users');
      return;
    }
    try {
      console.log('Following:', { followerId: userId, followeeId }); // Debug
      const response = await axios.post('http://localhost:5001/api/follow', {
        followerId: userId,
        followeeId,
      });
      console.log('Followed:', { followeeId, channelId: response.data.channelId });
      navigate(`/chat/${response.data.channelId}`);
    } catch (error) {
      console.error('Follow error:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to follow');
    }
  };

  if (!userId) {
    return (
      <div className="text-center p-4 text-gray-800 dark:text-white">
        Please <a href="/auth" className="text-blue-500 hover:underline">log in</a> to discover users
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Discover People</h2>
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by username (e.g., jane)"
          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {users.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          {searchQuery ? `No users found for "${searchQuery}". Try a different username.` : 'No other users available. Invite friends to join!'}
        </p>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div
              key={u.userId}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <div className="flex items-center gap-3">
                <img
                  src={u.avatar || 'https://via.placeholder.com/40'}
                  alt="User avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">{u.fullName || 'Unknown'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{u.username}</p>
                </div>
              </div>
              <button
                onClick={() => handleFollow(u.userId)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Discover;