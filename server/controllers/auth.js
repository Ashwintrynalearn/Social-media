import { StreamChat } from 'stream-chat';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const serverClient = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);

const signup = async (req, res) => {
  try {
    const { fullName, username, password, bio, avatar } = req.body;
    if (!fullName || !username || !password) {
      return res.status(400).json({ message: 'Missing required fields: fullName, username, password' });
    }
    const { users } = await serverClient.queryUsers({ name: username });
    if (users.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const userId = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);
    await serverClient.upsertUser({
      id: userId,
      name: username,
      fullName,
      custom: { hashedPassword },
    });
    await User.create({
      userId,
      username,
      fullName,
      bio: bio || '',
      avatar: avatar || '',
    });
    const token = serverClient.createToken(userId);
    res.status(200).json({ token, fullName, username, userId ,avatar});
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { users } = await serverClient.queryUsers({ name: username }, {}, { presence: false });
    if (!users.length) {
      return res.status(400).json({ message: 'User not found' });
    }
    const storedHash = users[0].custom?.hashedPassword;
    if (!storedHash) {
      console.error('No hashedPassword found for user:', username);
      return res.status(500).json({ message: 'User data incomplete' });
    }
    const success = await bcrypt.compare(password, storedHash);
    if (success) {
      const token = serverClient.createToken(users[0].id);
      res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id ,avatar: users[0].avatar});
    } else {
      res.status(401).json({ message: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};


const updateProfile = async (req, res) => {
  try {
    const { userId, bio, avatar } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId' });
    }
    const user = await User.findOneAndUpdate(
      { userId },
      { bio: bio || '', avatar: avatar || '' },
      { new: true, select: 'userId fullName username bio avatar' }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export { signup, login, updateProfile };