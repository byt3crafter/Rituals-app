
import React, { useState, useRef, useEffect } from 'react';
import { useFastingStore } from '../../store/useFastingStore';
import { getMentorResponse } from '../../services/geminiService';
import { speak } from '../../services/speechService';
import { MentorMessage } from '../../types';

const MentorScreen: React.FC = () => {
  const { state: fastingState, startTime } = useFastingStore();
  const [messages, setMessages] = useState<MentorMessage[]>([
    { id: 1, text: 'Welcome. How can I support your ritual today?', sender: 'mentor' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: MentorMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const loadingMessage: MentorMessage = { id: Date.now() + 1, text: '...', sender: 'mentor', isLoading: true };
    setMessages(prev => [...prev, loadingMessage]);
    
    const fastingHours = startTime ? (Date.now() - startTime) / (1000 * 60 * 60) : 0;
    
    if (fastingState !== 'active') {
        const reply = "Begin a fast to speak with me. I am here to guide you on your journey.";
        setMessages(prev => prev.slice(0, -1).concat({ id: Date.now() + 1, text: reply, sender: 'mentor' }));
        speak(reply);
        setIsLoading(false);
        return;
    }

    const mentorReply = await getMentorResponse(input, fastingHours);
    
    setMessages(prev => prev.slice(0, -1).concat({ id: Date.now() + 1, text: mentorReply, sender: 'mentor' }));
    speak(mentorReply);
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md h-full flex flex-col p-4">
      <h1 className="text-2xl font-bold text-center mb-4 text-on-base">Mentor</h1>
      <div className="flex-grow overflow-y-auto mb-4 p-2 bg-surface rounded-lg">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md ${
                msg.sender === 'user'
                  ? 'bg-primary text-base'
                  : `bg-on-surface/20 text-on-surface ${msg.isLoading ? 'animate-pulse' : ''}`
              }`}
            >
              {msg.isLoading ? 
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-on-surface/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-on-surface/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-on-surface/50 rounded-full animate-bounce"></div>
                </div> 
                : msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask for guidance..."
          className="flex-grow bg-surface border border-on-surface/30 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-primary text-base font-bold p-2 rounded-r-md hover:bg-opacity-80 disabled:bg-opacity-50 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MentorScreen;
