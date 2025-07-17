import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  media: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Post', postSchema);