import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { UserPlus, UserCheck } from 'lucide-react';

const cookies = new Cookies();

function Post({ content, media, timestamp, user }) {
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(true);
  const currentUserId = cookies.get('userId');
  const navigate = useNavigate();

  // Debug: Log props and cookies
  console.log('Post props:', { user, currentUserId });

  const handleFollow = async () => {
    if (!currentUserId) {
      setError('Please log in to follow users');
      return;
    }
    if (!user?.userId) {
      setError('Invalid user ID');
      return;
    }
    console.log('Following:', { followerId: currentUserId, followeeId: user.userId });
    try {
      const response = await axios.post('http://localhost:5001/api/follow', {
        followerId: currentUserId,
        followeeId: user.userId,
      });
      setIsFollowing(true);
      navigate(`/chat/${response.data.channelId}`);
    } catch (error) {
      console.error('Follow error:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to follow');
    }
  };

  return (
    <div className="max-w-5xl bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || 'https://via.placeholder.com/40'}
              alt="User avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{user.name || 'Unknown'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
          {user.userId && currentUserId !== user.userId && (
            <button
              onClick={handleFollow}
              disabled={isFollowing}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">{content}</p>

        {media && (
          <div className="mt-4 rounded-lg overflow-hidden">
            {media.endsWith(".mp4") || media.endsWith(".webm") ? (
              <video
                src={media}
                controls
                className="w-full rounded-lg"
              />
            ) : (
              <img
                src={media}
                alt="Post media"
                className="w-full rounded-lg object-cover"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;