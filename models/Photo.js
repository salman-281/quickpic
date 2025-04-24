import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
  image: { type: String, required: true }, 
  userName: { type: String, required: true },
  carrier: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);
