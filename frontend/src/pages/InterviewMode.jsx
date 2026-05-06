import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2, Sparkles, Trophy, Power, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const InterviewMode = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [interviewId, setInterviewId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isWaitingForAI]);

  const startInterview = async () => {
    try {
      setIsInterviewStarted(true);
      setIsWaitingForAI(true);
      const response = await api.post('/api/interview/start');
      const { interviewId, message } = response.data.data;
      
      setInterviewId(interviewId);
      setMessages([{ sender: 'ai', message }]);
      setIsWaitingForAI(false);
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview. Please try again.');
      setIsInterviewStarted(false);
      setIsWaitingForAI(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const cleanInput = input.trim();
    
    if (cleanInput.length < 5) {
      alert('Please provide a more meaningful answer (at least 5 characters).');
      return;
    }

    if (isWaitingForAI || isCompleted) return;

    // Add user message to UI
    const userMsg = { sender: 'user', message: cleanInput };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsWaitingForAI(true);

    try {
      const response = await api.post('/api/interview/answer', {
        interviewId,
        answer: cleanInput
      });

      const { feedback, nextQuestion, isCompleted: sessionCompleted } = response.data.data;

      // Add feedback and next question to messages
      setMessages((prev) => [
        ...prev, 
        { sender: 'ai', message: feedback },
        { sender: 'ai', message: nextQuestion }
      ]);
      
      if (sessionCompleted) {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      const errorMsg = error.response?.data?.message || 'Something went wrong. Please try again.';
      alert(errorMsg);
    } finally {
      setIsWaitingForAI(false);
    }
  };


  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-4 uppercase tracking-widest">
            <Sparkles size={12} className="fill-current" /> AI Coaching
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-heading">Mock Interview</h1>
        </div>
        {isCompleted && (
          <div className="px-6 py-2 bg-success/10 border border-success/20 text-success text-xs font-black tracking-widest uppercase rounded-2xl flex items-center gap-2 shadow-sm">
            <Trophy size={14} /> Session Completed
          </div>
        )}
      </div>

      {!isInterviewStarted ? (
        <div className="flex-1 flex flex-col items-center justify-center glass-card rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
          
          <div className="relative z-10 text-center max-w-xl">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-primary text-primary-foreground rounded-2xl sm:rounded-[2rem] flex items-center justify-center mx-auto mb-6 sm:mb-10 shadow-glow rotate-6 group-hover:rotate-0 transition-all duration-700">
              <MessageCircle size={32} className="sm:w-[48px] sm:h-[48px]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-3 sm:mb-4 tracking-tight">Ready to test your skills?</h2>
            <p className="text-muted-foreground text-sm sm:text-lg mb-8 sm:mb-10 leading-relaxed font-medium opacity-80">
              Our AI coach will conduct a 5-round technical and behavioral interview. You'll receive real-time evaluation and a full performance score.
            </p>
            <button 
              onClick={startInterview}
              disabled={isWaitingForAI}
              className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-primary text-primary-foreground font-black text-base sm:text-lg rounded-2xl sm:rounded-[2rem] hover:bg-primary/90 transition-all shadow-glow hover:scale-[1.05] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 mx-auto"
            >
              {isWaitingForAI ? <><Loader2 className="animate-spin" size={20} /> Connecting...</> : <>Start Session <Power size={18} /></>}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col glass-card rounded-[3rem] overflow-hidden shadow-2xl relative border-border/30">
          {/* Chat area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-6 sm:y-8 custom-scrollbar bg-gradient-to-b from-transparent to-secondary/10">
            {messages.length === 0 && !isWaitingForAI && (
              <div className="h-full flex items-center justify-center text-center opacity-40">
                <p className="font-bold tracking-widest uppercase text-[10px] sm:text-xs">Waiting for AI to start...</p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                <div className={`flex max-w-[90%] sm:max-w-[70%] gap-3 sm:gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg ${
                    msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'
                  }`}>
                    {msg.sender === 'user' ? <User size={16} className="sm:w-[20px] sm:h-[20px]" /> : <Bot size={16} className="sm:w-[20px] sm:h-[20px]" />}
                  </div>
                  <div className={`p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] text-sm sm:text-[15px] leading-relaxed shadow-soft ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : msg.message.includes('Rating:') || msg.message.includes('Tip:')
                        ? 'bg-accent/10 border border-accent/20 text-foreground rounded-tl-sm font-semibold'
                        : 'bg-card border border-border/50 text-foreground rounded-tl-sm'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              </div>
            ))}
            
            {isWaitingForAI && (
              <div className="flex justify-start animate-pulse">
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center bg-card border border-border shadow-lg">
                    <Bot size={16} className="sm:w-[20px] sm:h-[20px]" />
                  </div>
                  <div className="p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] bg-card border border-border/50 rounded-tl-sm flex items-center gap-3 shadow-soft">
                    <Loader2 size={16} className="animate-spin text-primary" />
                    <span className="text-[10px] sm:text-sm font-bold text-muted-foreground tracking-wide uppercase">AI is evaluating...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 sm:p-8 bg-card/50 border-t border-border/30 backdrop-blur-xl">
            <form onSubmit={sendMessage} className="flex gap-3 sm:gap-4 relative max-w-5xl mx-auto group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isWaitingForAI || isCompleted}
                placeholder={isCompleted ? "Session completed." : "Your answer..."} 
                className="flex-1 p-4 sm:p-5 pl-6 sm:pl-8 bg-background border border-border/50 rounded-[1.5rem] sm:rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-primary/10 pr-16 sm:pr-20 disabled:opacity-50 transition-all shadow-inner text-sm sm:text-[15px] font-medium"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isWaitingForAI || isCompleted}
                className="absolute right-2 top-2 bottom-2 w-12 sm:w-14 bg-primary text-primary-foreground rounded-xl sm:rounded-[1.5rem] flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-all shadow-glow hover:scale-105 active:scale-95"
              >
                <Send size={18} className="sm:w-[22px] sm:h-[22px] ml-1" />
              </button>
            </form>
            <p className="hidden sm:block text-center mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-40">Press Enter to Send Answer</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewMode;
