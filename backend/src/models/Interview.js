import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'ai'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topic: {
    type: String,
    default: 'General Technical',
  },
  messages: [messageSchema],
  feedback: {
    rating: { type: Number, min: 1, max: 10 },
    correctness: { type: String },
    improvementSuggestions: { type: String },
    overallSummary: { type: String },
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed'],
    default: 'In Progress',
  },
  questionsAsked: [{ type: String }],
}, { timestamps: true });

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
