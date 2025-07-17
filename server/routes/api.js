import express from 'express';
import { createPost, getUserPosts, getProfile, followUser, checkFollow, getFeed, getUsers } from '../controllers/api.js';

const router = express.Router();

router.post('/posts', createPost);
router.get('/posts/:userId', getUserPosts);
router.get('/profile/:userId', getProfile);
router.post('/follow', followUser);
router.get('/follow/:followerId/:followeeId', checkFollow);
router.get('/feed/:userId', getFeed);
router.get('/feed/users', getUsers);

export default router;