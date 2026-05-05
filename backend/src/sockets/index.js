import Interview from '../models/Interview.js';
import { getNextInterviewQuestion, processInterviewTurn, generateFinalInterviewSummary } from '../services/ai.service.js';

export default function setupSockets(io) {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('start_interview', async (data) => {
      try {
        const { userId } = data;
        
        // Pick a first question
        const firstQuestion = await getNextInterviewQuestion([]);

        // Create new interview in DB
        const interview = await Interview.create({
          user: userId,
          messages: [{ sender: 'ai', content: firstQuestion }],
          questionsAsked: [firstQuestion],
          status: 'In Progress'
        });

        // Store interviewId in socket session for future messages
        socket.interviewId = interview._id;
        socket.userId = userId;

        socket.emit('interview_message', {
          sender: 'ai',
          message: firstQuestion,
          interviewId: interview._id
        });
      } catch (error) {
        console.error('Error starting interview:', error);
        socket.emit('interview_error', { message: 'Failed to start interview.' });
      }
    });

    socket.on('send_answer', async (data) => {
      try {
        const { answer } = data;
        
        if (!socket.interviewId) {
          return socket.emit('interview_error', { message: 'No active interview found.' });
        }

        const interview = await Interview.findById(socket.interviewId);
        if (!interview || interview.status === 'Completed') return;

        // Ensure we know what question they are answering
        const lastMsg = interview.messages[interview.messages.length - 1];
        if (lastMsg.sender !== 'ai') return; // Out of sync

        // Save user answer
        interview.messages.push({ sender: 'user', content: answer });
        await interview.save();

        // Process turn with AI
        const turnData = await processInterviewTurn(interview.messages, answer);
        
        // Format feedback message
        const feedbackMsg = `${turnData.feedback}\n\nRating: ${turnData.rating}/10\nTip: ${turnData.improvement}`;
        
        // Save feedback
        interview.messages.push({ sender: 'ai', content: feedbackMsg });
        socket.emit('interview_message', { sender: 'ai', message: feedbackMsg });

        // Check if we hit 5 questions
        if (interview.questionsAsked.length >= 5) {
          // End interview
          const finalSummary = await generateFinalInterviewSummary(interview.messages);
          interview.status = 'Completed';
          interview.feedback = finalSummary;
          
          const endMessage = `Interview Complete! Overall Summary: ${finalSummary.overallSummary} You scored ${finalSummary.rating}/10. Check your dashboard for detailed feedback.`;
          interview.messages.push({ sender: 'ai', content: endMessage });
          await interview.save();

          socket.emit('interview_message', { sender: 'ai', message: endMessage, isCompleted: true });
        } else {
          // Next question (from turnData)
          const nextQuestion = turnData.next_question;
          interview.questionsAsked.push(nextQuestion);
          interview.messages.push({ sender: 'ai', content: nextQuestion });
          await interview.save();

          socket.emit('interview_message', { sender: 'ai', message: nextQuestion });
        }

      } catch (error) {
        console.error('Error handling answer:', error);
        socket.emit('interview_error', { message: 'An error occurred while processing your answer.' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
