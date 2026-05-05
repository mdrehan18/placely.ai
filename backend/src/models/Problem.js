import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Unsolved', 'Solving', 'Solved'],
    default: 'Unsolved',
  },
  tags: [{
    type: String,
  }],
  notes: {
    type: String,
  },
  link: {
    type: String,
  }
}, { timestamps: true });

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
