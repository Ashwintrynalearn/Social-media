import User from '../models/User.js';
import Post from '../models/Post.js';
import Follow from '../models/Follow.js';
import { StreamChat } from 'stream-chat';
import { fileURLToPath } from 'url';
import path from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chatClient = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);

const createPost = async (req, res) => {
  try {
    const { userId, username, content } = req.body;
    if (!userId || !username || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    let media = '';
    if (req.files && req.files.media) {
      const file = req.files.media;
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(__dirname, '../Uploads', fileName);
      await file.mv(filePath);
      media = `http://localhost:5001/uploads/${fileName}`;
    }
    const post = await Post.create({ userId, username, content, media });
    res.status(200).json({
      postId: post._id,
      content,
      media,
      username,
      createdAt: post.createdAt,
    });
  } catch (error) {
    console.error('Create post error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Get posts error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const followUser = async (req, res) => {
    try {
      const { followerId, followeeId } = req.body;
      if (!followerId || !followeeId) {
        return res.status(400).json({ message: 'Missing followerId or followeeId' });
      }
      if (followerId === followeeId) {
        return res.status(400).json({ message: 'Cannot follow yourself' });
      }
      const existingFollow = await Follow.findOne({ followerId, followeeId });
      if (existingFollow) {
        return res.status(400).json({ message: 'Already following this user' });
      }
      await Follow.create({ followerId, followeeId });
      const sortedIds = [followerId, followeeId].sort().join('-');
      const channelId = crypto.createHash('sha256').update(sortedIds).digest('hex').slice(0, 32);
      const channel = chatClient.channel('messaging', channelId, {
        members: [followerId, followeeId],
        created_by_id: followerId,
      });
      await channel.create();
      res.status(200).json({ message: 'Followed and chat created', channelId });
    } catch (error) {
      console.error('Follow error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };

const checkFollow = async (req, res) => {
  try {
    const { followerId, followeeId } = req.params;
    const follow = await Follow.findOne({ followerId, followeeId });
    res.status(200).json({ exists: !!follow });
  } catch (error) {
    console.error('Check follow error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getFeed = async (req, res) => {
    try {
      const { userId } = req.params;
      const follows = await Follow.find({ followerId: userId });
      const followeeIds = follows.map((f) => f.followeeId);
      const posts = await Post.find({
        userId: { $in: [...followeeIds, userId] },
      }).sort({ createdAt: -1 });
      res.status(200).json(posts);
    } catch (error) {
      console.error('Get feed error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const getUsers = async (req, res) => {
    try {
      const { userId, query } = req.query;
      if (!userId) {
        return res.status(400).json({ message: 'Missing userId' });
      }
  
      const searchQuery = {
        userId: { $ne: userId }, // Always exclude current user
      };
  
      if (query && query.trim()) {
        const trimmedQuery = query.trim();
        searchQuery.$or = [
          { username: { $regex: trimmedQuery, $options: 'i' } },
          { fullName: { $regex: trimmedQuery, $options: 'i' } },
        ];
      }
  
      console.log('Get users query:', searchQuery);
  
      const users = await User.find(searchQuery, 'userId username fullName avatar').lean();
      console.log('Get users result:', users);
  
      res.status(200).json(users);
    } catch (error) {
      console.error('Get users error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

export { createPost, getUserPosts, getProfile, followUser, checkFollow, getFeed, getUsers };