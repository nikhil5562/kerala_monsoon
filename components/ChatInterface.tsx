import React, { useState, useRef, useEffect } from 'react';
import { Message, AppSettings } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { Send, Mic, Info, CloudRain, AlertTriangle } from './Icons';
import { SUGGESTED_QUERIES } from '../constants';

interface ChatInterfaceProps {
  settings: AppSettings;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ settings }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Namaskaram! I am your Kerala Monsoon Companion. I can help you with rainfall updates, flood risks, and understanding our monsoon patterns. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API (excluding the current new message as it's passed as prompt)
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      
      const response = await sendMessageToGemini(text, history, settings.simpleLanguage);
      
      let botText = response.text || "I'm sorry, I couldn't process that right now.";

      // Append grounding sources if available
      if (response.groundingMetadata?.groundingChunks) {
        const links = response.groundingMetadata.groundingChunks
          .map((chunk: any) => chunk.web?.uri ? `[${chunk.web.title || 'Source'}](${chunk.web.uri})` : null)
          .filter(Boolean)
          .join(', ');
        
        if (links) {
            botText += `\n\n*Sources: ${links}*`;
        }
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: botText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'model',
        text: "Sorry, I'm having trouble connecting to the weather network. Please try again.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-IN'; // English (India)
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const textSizeClass = settings.largeText ? 'text-lg' : 'text-sm md:text-base';
  const contrastClass = settings.highContrast ? 'bg-black text-yellow-300 border-white' : 'bg-white text-slate-800';

  return (
    <div className={`flex flex-col h-full ${settings.highContrast ? 'bg-gray-900' : 'bg-slate-50'}`}>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm whitespace-pre-wrap ${textSizeClass} ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : settings.highContrast 
                    ? 'bg-gray-800 text-white border border-yellow-400 rounded-bl-none'
                    : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'
              } ${msg.isError ? 'bg-red-100 text-red-700 border-red-200' : ''}`}
            >
              {msg.text}
              <div className={`text-[10px] mt-2 opacity-70 text-right`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`bg-white rounded-2xl p-4 rounded-bl-none shadow-sm flex items-center space-x-2 ${settings.highContrast ? 'bg-gray-800' : ''}`}>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Queries (only show if few messages) */}
      {messages.length < 3 && (
        <div className="px-4 pb-2">
            <p className={`text-xs font-semibold mb-2 ${settings.highContrast ? 'text-yellow-400' : 'text-slate-500'}`}>SUGGESTED:</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {SUGGESTED_QUERIES.map((q, idx) => (
                    <button 
                        key={idx}
                        onClick={() => handleSend(q)}
                        className={`whitespace-nowrap px-3 py-1.5 rounded-full border text-sm transition-colors ${
                            settings.highContrast 
                            ? 'border-yellow-400 text-yellow-300 hover:bg-yellow-900' 
                            : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                    >
                        {q}
                    </button>
                ))}
            </div>
        </div>
      )}

      {/* Input Area */}
      <div className={`p-4 border-t ${settings.highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'}`}>
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about rain, floods, or alerts..."
            className={`w-full pl-4 pr-24 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              settings.highContrast 
                ? 'bg-black text-yellow-300 border-yellow-500 placeholder-gray-500' 
                : 'bg-slate-50 text-slate-900 border-slate-200 placeholder-slate-400'
            } ${settings.largeText ? 'text-lg' : 'text-base'}`}
          />
          <div className="absolute right-2 flex items-center space-x-1">
            <button
              onClick={handleMicClick}
              className={`p-2 rounded-full transition-colors ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : settings.highContrast 
                    ? 'text-yellow-400 hover:bg-gray-800' 
                    : 'text-slate-400 hover:bg-slate-200'
              }`}
              title="Voice Input"
            >
              <Mic size={20} />
            </button>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={`p-2 rounded-full transition-colors ${
                !input.trim()
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        <div className={`mt-2 text-xs text-center ${settings.highContrast ? 'text-gray-400' : 'text-slate-400'}`}>
           Prototype - AI may make mistakes. Check official IMD/KSDMA sources for emergencies.
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;