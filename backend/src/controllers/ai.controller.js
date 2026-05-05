import { generateMockRoadmap } from '../services/ai.service.js';
import Roadmap from '../models/Roadmap.js';

export const createRoadmap = async (req, res, next) => {
  try {
    const { goal, duration } = req.body;
    
    // Call AI Service (mock for now)
    const plan = await generateMockRoadmap(goal, duration);

    const roadmap = await Roadmap.create({
      user: req.user._id,
      goal,
      duration,
      plan
    });

    res.status(201).json({ success: true, data: roadmap });
  } catch (error) {
    next(error);
  }
};

export const getRoadmaps = async (req, res, next) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: roadmaps });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { roadmapId, taskId } = req.params;

    const roadmap = await Roadmap.findOne({ _id: roadmapId, user: req.user._id });
    if (!roadmap) {
      res.status(404);
      throw new Error('Roadmap not found');
    }

    let taskFound = false;

    // Find the task and toggle its status
    roadmap.plan.forEach((dayPlan) => {
      dayPlan.tasks.forEach((task) => {
        if (task._id.toString() === taskId) {
          task.completed = !task.completed; // toggle
          taskFound = true;
        }
      });
    });

    if (!taskFound) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Optionally check if all tasks for a day are complete to mark day as complete
    roadmap.plan.forEach((dayPlan) => {
      dayPlan.completed = dayPlan.tasks.every(t => t.completed);
    });

    await roadmap.save();

    res.json({ success: true, data: roadmap });
  } catch (error) {
    next(error);
  }
};
