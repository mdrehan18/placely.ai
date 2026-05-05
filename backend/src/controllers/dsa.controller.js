import Problem from '../models/Problem.js';

export const getProblems = async (req, res, next) => {
  try {
    const problems = await Problem.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: problems });
  } catch (error) {
    next(error);
  }
};

export const createProblem = async (req, res, next) => {
  try {
    const problem = await Problem.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json({ success: true, data: problem });
  } catch (error) {
    next(error);
  }
};

export const updateProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);
    
    if (!problem) {
      res.status(404);
      throw new Error('Problem not found');
    }

    if (problem.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedProblem });
  } catch (error) {
    next(error);
  }
};

export const deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);
    
    if (!problem) {
      res.status(404);
      throw new Error('Problem not found');
    }

    if (problem.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    await problem.deleteOne();
    res.json({ success: true, message: 'Problem removed' });
  } catch (error) {
    next(error);
  }
};
