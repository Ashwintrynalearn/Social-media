import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import Post from '../components/Post';
import { Camera, Edit2, UserPlus, UserCheck } from 'lucide-react';

const cookies = new Cookies();

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ bio: '', avatar: '' });
  const currentUserId = cookies.get('userId');

  useEffect(() => {
    const fetchProfile = async () => {
      setError('');
      try {
        const [profileRes, postsRes, followRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/profile/${userId}`),
          axios.get(`http://localhost:5001/api/posts/${userId}`),
          currentUserId && userId !== currentUserId
            ? axios.get(`http://localhost:5001/api/follow/${currentUserId}/${userId}`)
            : Promise.resolve({ data: { exists: false } }),
        ]);
        setProfile(profileRes.data);
        setPosts(postsRes.data);
        setIsFollowing(followRes.data.exists);
        setEditForm({ bio: profileRes.data.bio || '', avatar: profileRes.data.avatar || '' });
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load profile');
      }
    };
    if (userId && currentUserId) {
      fetchProfile();
    } else {
      setError('Please log in to view profiles');
    }
  }, [userId, currentUserId]);

  const handleFollow = async () => {
    if (!currentUserId) {
      setError('Please log in to follow users');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5001/api/follow', {
        followerId: currentUserId,
        followeeId: userId,
      });
      setIsFollowing(true);
      navigate(`/chat/${response.data.channelId}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to follow');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch('http://localhost:5001/auth/profile', {
        userId: currentUserId,
        bio: editForm.bio,
        avatar: editForm.avatar,
      });
      setProfile(response.data);
      setIsEditing(false);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Please log in to view profiles</p>
          <a href="/auth" className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Log In
          </a>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-center">
          {error}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <img
                src={profile.avatar || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
              />
              {currentUserId === userId && (
                <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition-colors">
                  <Camera size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-20 px-6 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.fullName}</h2>
              <p className="text-gray-600 dark:text-gray-400">@{profile.username}</p>
            </div>
            {currentUserId === userId ? (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Edit2 size={16} />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            ) : (
              <button
                onClick={handleFollow}
                disabled={isFollowing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isFollowing
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck size={16} />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Follow
                  </>
                )}
              </button>
            )}
          </div>
          
          <p className="mt-4 text-gray-700 dark:text-gray-300">{profile.bio || 'No bio yet'}</p>
        </div>
      </div>

      {isEditing && currentUserId === userId && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Edit Profile</h3>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Tell us about yourself"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Avatar URL
              </label>
              <input
                type="text"
                value={editForm.avatar}
                onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter avatar URL"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Posts</h3>
        {posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No posts yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Post
                key={post._id}
                content={post.content}
                media={post.media}
                timestamp={post.createdAt}
                user={{ name: profile.username, avatar: profile.avatar, userId: profile.userId }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;