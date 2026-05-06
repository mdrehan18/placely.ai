import Interview from '../models/Interview.js';
import { getNextInterviewQuestion, processInterviewTurn, generateFinalInterviewSummary } from '../services/ai.service.js';

/**
 * @desc    Start a new interview
 * @route   POST /api/interview/start
 */
export const startInterview = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Check for existing in-progress interview and end it
    await Interview.updateMany({ user: userId, status: 'In Progress' }, { status: 'Completed' });

    // Pick first question
    const firstQuestion = await getNextInterviewQuestion([]);

    // Create new interview
    const interview = await Interview.create({
      user: userId,
      messages: [{ sender: 'ai', content: firstQuestion }],
      questionsAsked: [firstQuestion],
      status: 'In Progress'
    });

    res.status(201).json({
      success: true,
      data: {
        interviewId: interview._id,
        message: firstQuestion,
        sender: 'ai'
      }
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ success: false, message: 'Failed to start interview' });
  }
};

/**
 * @desc    Submit an answer
 * @route   POST /api/interview/answer
 */
export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, answer } = req.body;

    if (!answer || answer.trim().length < 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a meaningful answer (at least 5 characters).' 
      });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    if (interview.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'This interview has already ended' });
    }

    // Save user answer
    interview.messages.push({ sender: 'user', content: answer });
    
    // Process turn with AI
    const turnData = await processInterviewTurn(interview.messages, answer);
    
    // Format feedback
    const feedbackMsg = `${turnData.feedback}\n\nRating: ${turnData.rating}/10\nTip: ${turnData.improvement}`;
    interview.messages.push({ sender: 'ai', content: feedbackMsg });

    // Check if we reached the limit (e.g., 5 technical questions)
    if (interview.questionsAsked.length >= 5) {
      const finalSummary = await generateFinalInterviewSummary(interview.messages);
      interview.status = 'Completed';
      interview.feedback = finalSummary;
      
      const endMessage = `Interview Complete! \n\nOverall Summary: ${finalSummary.overallSummary} \n\nYou scored ${finalSummary.rating}/10. Check your dashboard for the detailed report.`;
      interview.messages.push({ sender: 'ai', content: endMessage });
      await interview.save();

      return res.status(200).json({
        success: true,
        data: {
          feedback: feedbackMsg,
          nextQuestion: endMessage,
          isCompleted: true
        }
      });
    }

    // Next question
    const nextQuestion = turnData.next_question;
    
    // Prevent repetition (simple check)
    if (interview.questionsAsked.includes(nextQuestion)) {
      // If AI repeats, we could fall back or just proceed, but AI usually varies
      console.warn("AI repeated a question. Proceeding anyway.");
    }

    interview.questionsAsked.push(nextQuestion);
    interview.messages.push({ sender: 'ai', content: nextQuestion });
    await interview.save();

    res.status(200).json({
      success: true,
      data: {
        feedback: feedbackMsg,
        nextQuestion: nextQuestion,
        isCompleted: false
      }
    });

  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ success: false, message: 'Failed to process answer' });
  }
};
