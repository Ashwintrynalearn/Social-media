import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';
import { Plus, Newspaper } from 'lucide-react';

const cookies = new Cookies();

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const userId = cookies.get('userId');
  const user = {
    name: cookies.get('fullName'),
    avatar: cookies.get('avatar') || 'https://via.placeholder.com/40',
  };

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/feed/${userId}`);
        console.log('Feed posts:', response.data);
        setPosts(response.data);
      } catch (error) {
        setError('Failed to load feed');
      }
    };
    if (userId) {
      fetchFeed();
    }
  }, [userId]);

  const handlePost = (postData) => {
    setPosts([{
      _id: postData.postId,
      userId,
      username: cookies.get('username'),
      content: postData.content,
      media: postData.media,
      createdAt: postData.createdAt,
    }, ...posts]);
    setShowCreatePost(false);
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Please log in to view your feed</p>
          <a href="/auth" className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Log In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Newspaper size={24} />
          Your Feed
        </h2>
        <button
          onClick={() => setShowCreatePost(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          Create Post
        </button>
      </div>

      {showCreatePost && (
        <CreatePost
          user={user}
          onPost={handlePost}
          onClose={() => setShowCreatePost(false)}
        />
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-center">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <Newspaper size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Follow users to see posts in your feed
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Post
              key={post._id}
              content={post.content}
              media={post.media}
              timestamp={post.createdAt}
              user={{
                name: post.username,
                avatar: post.avatar || 'https://i.sstatic.net/l60Hf.png',
                userId: post.userId,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;