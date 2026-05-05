import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  goal: {
    type: String,
    required: true,
  },
  duration: {
    type: String, // e.g., "2 months"
    required: true,
  },
  plan: [{
    day: { type: Number },
    title: { type: String },
    tasks: [{ 
      title: { type: String },
      completed: { type: Boolean, default: false }
    }],
    completed: { type: Boolean, default: false }
  }]
}, { timestamps: true });

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
export default Roadmap;
