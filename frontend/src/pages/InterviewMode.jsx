import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const InterviewMode = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    // Connect to Socket.io server
    const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on('interview_message', (data) => {
      setMessages((prev) => [...prev, data]);
      setIsWaitingForAI(false);
      
      if (data.isCompleted) {
        setIsCompleted(true);
      }
    });

    newSocket.on('interview_error', (data) => {
      console.error(data.message);
      setIsWaitingForAI(false);
    });

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isWaitingForAI]);

  const startInterview = () => {
    setIsInterviewStarted(true);
    setIsWaitingForAI(true);
    socket?.emit('start_interview', { userId: user._id });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || isWaitingForAI || isCompleted) return;

    const newMsg = { sender: 'user', message: input };
    setMessages((prev) => [...prev, newMsg]);
    setIsWaitingForAI(true);
    socket?.emit('send_answer', { answer: input });
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-heading mb-1">AI Interview Coach</h1>
          <p className="text-muted-foreground text-sm">Practice with our intelligent conversational AI.</p>
        </div>
        {isCompleted && (
          <span className="px-4 py-1.5 bg-success/10 border border-success/20 text-success text-sm font-bold tracking-wide uppercase rounded-full">
            Completed
          </span>
        )}
      </div>

      {!isInterviewStarted ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-border rounded-2xl bg-card shadow-soft relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="text-center max-w-md p-8 relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow rotate-3">
              <Bot size={40} className="-rotate-3" />
            </div>
            <h2 className="text-2xl font-bold font-heading mb-3">Ready for your mock interview?</h2>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
              Our AI coach will ask you 5 technical and behavioral questions, evaluate your responses in real-time, and provide an actionable feedback summary.
            </p>
            <button 
              onClick={startInterview}
              disabled={isWaitingForAI}
              className="w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/25 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isWaitingForAI ? 'Connecting to Coach...' : 'Start Session'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col border border-border rounded-2xl bg-card shadow-soft overflow-hidden">
          {/* Chat area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-background/30 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${
                    msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-gradient-to-br from-secondary to-muted text-foreground border border-border'
                  }`}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : msg.message.startsWith('Feedback:') || msg.message.startsWith('Interview Complete!')
                        ? 'bg-accent/10 border border-accent/20 text-foreground rounded-tl-sm font-medium'
                        : 'bg-card border border-border text-foreground rounded-tl-sm'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              </div>
            ))}
            
            {isWaitingForAI && (
              <div className="flex justify-start animate-pulse">
                <div className="flex gap-3 flex-row">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-secondary to-muted text-foreground border border-border shadow-sm">
                    <Bot size={16} />
                  </div>
                  <div className="p-4 rounded-2xl bg-card border border-border rounded-tl-sm flex items-center gap-3 shadow-sm">
                    <Loader2 size={16} className="animate-spin text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">AI is evaluating...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 sm:p-5 bg-card border-t border-border">
            <form onSubmit={sendMessage} className="flex gap-3 relative max-w-5xl mx-auto">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isWaitingForAI || isCompleted}
                placeholder={isCompleted ? "Interview completed. Check your dashboard." : "Type your detailed answer here..."} 
                className="flex-1 p-3.5 pl-5 bg-background border border-input rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 pr-14 disabled:opacity-50 transition-shadow shadow-sm"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isWaitingForAI || isCompleted}
                className="absolute right-2 top-2 bottom-2 w-11 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewMode;
