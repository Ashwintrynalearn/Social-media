import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelList,
  ChannelHeader,
  MessageList,
  MessageInput,
  Window,
} from 'stream-chat-react';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import CustomChannelPreview from '../components/CustomChannelPreview';
import ErrorBoundary from '../components/ErrorBoundary';
import { MessageSquare, UserPlus, Users } from 'lucide-react';
import 'stream-chat-react/dist/css/v2/index.css';
import './Chat.css';

const cookies = new Cookies();
const client = StreamChat.getInstance('7hsb2jgp42gd');

const ChatPage = () => {
  const { channelId } = useParams();
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const userId = cookies.get('userId');
  const token = cookies.get('token');
  const username = cookies.get('username');
  const fullName = cookies.get('fullName');

  useEffect(() => {
    const connectUser = async () => {
      if (!client.userID && token && userId && username && fullName) {
        try {
          await client.connectUser({ id: userId, name: username, fullName }, token);
          setIsConnected(true);
          const response = await axios.get('http://localhost:5001/api/feed/users', {
            params: { userId },
          });
          setUsers(response.data);
          console.log("Users from API:", response.data);

          if (channelId) {
            const channel = client.channel('messaging', channelId);
            await channel.watch();
            setSelectedChannel(channel);
          }
        } catch (error) {
          console.error('Connect user error:', error.message);
        }
      }
    };

    connectUser();
    return () => {
      client.disconnectUser();
      setIsConnected(false);
    };
  }, [userId, token, username, fullName, channelId]);

  const handleStartChat = async (targetUserId) => {
    try {
      const response = await axios.post('http://localhost:5001/api/follow', {
        followerId: userId,
        followeeId: targetUserId,
      });

      const channel = client.channel('messaging', response.data.channelId, {
        members: [userId, targetUserId],
      });

      await channel.watch();
      setSelectedChannel(channel);
    } catch (error) {
      console.error('Start chat error:', error.message);
    }
  };

  if (!userId || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Please log in to chat</p>
          <a href="/auth" className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Log In
          </a>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600 dark:text-gray-300">Connecting to chat...</div>
      </div>
    );
  }

  const filters = { members: { $in: [userId] } };
  const sort = { last_message_at: -1 };

  return (
    <div className="flex-1 flex flex-col h-screen max-w-7xl mx-auto w-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageSquare size={24} />
          Messages
        </h2>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Users size={20} />
              Start a Chat
            </h3>
            {users.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No users found.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {users.map((user) => (
                  <button
                    key={user.userId}
                    onClick={() => handleStartChat(user.userId)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                    <UserPlus size={16} />
                    {user.fullName}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <ErrorBoundary componentName="ChannelList">
              <ChannelList
                filters={filters}
                sort={sort}
                Preview={(props) => (
                  <CustomChannelPreview {...props} setActiveChannel={setSelectedChannel} />
                )}
              />
            </ErrorBoundary>
          </div>
        </div>

        <div className="w-2/3 flex flex-col">
          <ErrorBoundary componentName="Chat">
            <Chat client={client}>
              {selectedChannel ? (
                <Channel channel={selectedChannel}>
                  <Window>
                    <div className="flex flex-col h-full">
                      <div className="border-b border-gray-200 dark:border-gray-700">
                        <ChannelHeader />
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        <MessageList />
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700">
                        <MessageInput />
                      </div>
                    </div>
                  </Window>
                </Channel>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
                  <div className="text-center p-6">
                    <MessageSquare size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      Select a chat to start messaging
                    </p>
                  </div>
                </div>
              )}
            </Chat>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
