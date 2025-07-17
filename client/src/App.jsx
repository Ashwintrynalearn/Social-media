import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Discover from './pages/Discover';
import ChatPage from './pages/Chat';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import 'stream-chat-react/dist/css/v2/index.css';

const cookies = new Cookies();
const client = StreamChat.getInstance('7hsb2jgp42gd');

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const authToken = cookies.get('token');

  useEffect(() => {
    const connectUser = async () => {
      const userId = cookies.get('userId');
      const username = cookies.get('username');
      const fullName = cookies.get('fullName');

      if (authToken && userId && username && fullName) {
        try {
          await client.connectUser(
            { id: userId, name: username, fullName },
            authToken
          );
        } catch (error) {
          console.error('Connect user error:', error.message);
          cookies.remove('token');
          cookies.remove('username');
          cookies.remove('fullName');
          cookies.remove('userId');
        }
      }
      setIsLoading(false);
    };
    connectUser();
    return () => {
      client.disconnectUser();
    };
  }, []);

  if (isLoading) {
    return <div className="text-center p-4 text-gray-800 dark:text-white">Loading...</div>;
  }

  return (
    <Router>
      <Chat client={client}>
        {authToken ? (
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/chat/:channelId" element={<ChatPage />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
        )}
      </Chat>
    </Router>
  );
}

export default App;