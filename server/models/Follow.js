import mongoose from 'mongoose';

const followSchema = new mongoose.Schema({
  followerId: { type: String, required: true },
  followeeId: { type: String, required: true },
}, { indexes: [{ key: { followerId: 1, followeeId: 1 }, unique: true }] });

export default mongoose.model('Follow', followSchema);