import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
});

export default mongoose.model('User', userSchema);