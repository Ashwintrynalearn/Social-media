import React from 'react';
import { useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const CustomChannelPreview = ({ channel, setActiveChannel }) => {
  const { channel: activeChannel } = useChatContext();
  const userId = cookies.get('userId');

  if (!channel || !channel.state) {
    return (
      <div className="p-3 mb-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading channel...</p>
      </div>
    );
  }

  const isSelected = activeChannel?.id === channel.id;
  const members = Object.values(channel.state.members || {}).filter(
    (member) => member.user_id !== userId
  );
  const displayName = members.length > 0
    ? members.map((m) => m.user?.name || m.user_id || 'Unknown').join(', ')
    : 'No members';
  const lastMessage = channel.state.last_message?.text || 'No messages yet';

  return (
    <div
      onClick={() => setActiveChannel && setActiveChannel(channel)}
      className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? 'bg-blue-100 dark:bg-blue-900'
          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
    >
      <p className="font-medium text-gray-800 dark:text-white truncate">{displayName}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{lastMessage}</p>
    </div>
  );
};

export default CustomChannelPreview;