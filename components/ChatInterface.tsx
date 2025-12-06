import React, { useState, useRef, useEffect } from 'react';
import { Message, AppSettings } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { Send, Mic, ExternalLink, BookOpen, ImageIcon, X, MapPin } from './Icons';
import { SUGGESTED_QUERIES, UI_TRANSLATIONS } from '../constants';

interface ChatInterfaceProps {
  settings: AppSettings;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ settings }) => {
  const t = UI_TRANSLATIONS[settings.language];
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: settings.language === 'ml' 
        ? "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ കേരള മൺസൂൺ സഹായിയാണ്. മഴയെക്കുറിച്ചും വെള്ളപ്പൊക്കത്തെക്കുറിച്ചും എന്നോട് ചോദിക്കാം." 
        : "Namaskaram! I am your Kerala Monsoon Companion. I can help you with rainfall updates, flood risks, and understanding our monsoon patterns. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (text: string = input) => {
    if ((!text.trim() && !selectedImage)) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date(),
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const imageToSend = selectedImage;
    setSelectedImage(null); // Clear pending image immediately
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({ 
          role: m.role, 
          text: m.text,
          image: m.image
      }));
      
      const response = await sendMessageToGemini(text, history, settings, imageToSend || undefined);
      
      const botText = response.text || (settings.language === 'ml' ? "ക്ഷമിക്കണം, ഇപ്പോൾ പ്രതികരിക്കാൻ കഴിയില്ല." : "I'm sorry, I couldn't process that right now.");

      const sources = response.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => {
           if (chunk.web?.uri) {
             return { title: chunk.web.title || 'Source', uri: chunk.web.uri };
           }
           return null;
        })
        .filter((s: any) => s !== null) as { title: string; uri: string }[] || [];

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: botText,
        timestamp: new Date(),
        sources: sources
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'model',
        text: settings.language === 'ml' ? "നെറ്റ്‌വർക്ക് തകരാർ മൂലം ബന്ധപ്പെടാൻ കഴിയുന്നില്ല." : "Sorry, I'm having trouble connecting to the weather network. Please try again.",
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
    recognition.lang = settings.language === 'ml' ? 'ml-IN' : 'en-IN';
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
  
  return (
    <div className={`flex flex-col h-full relative ${settings.highContrast ? 'bg-gray-900' : 'bg-slate-50'}`}>
      
      {/* Location Context Badge */}
      {settings.location?.district && (
          <div className="absolute top-2 left-0 right-0 z-10 flex justify-center pointer-events-none">
              <div className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full shadow-sm flex items-center gap-1 opacity-90 border border-emerald-200 backdrop-blur-sm">
                  <MapPin size={10} />
                  <span>Based on {settings.location.district}</span>
              </div>
          </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-8">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
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
              {msg.image && (
                  <div className="mb-3 rounded-lg overflow-hidden border border-white/20">
                      <img src={msg.image} alt="User uploaded" className="max-h-64 object-cover w-full" />
                  </div>
              )}
              {msg.text}
              
              {/* Sources Display */}
              {msg.sources && msg.sources.length > 0 && (
                <div className={`mt-3 pt-3 border-t ${
                    msg.role === 'user' 
                        ? 'border-white/20' 
                        : settings.highContrast 
                            ? 'border-gray-600' 
                            : 'border-slate-100'
                }`}>
                    <p className={`text-[10px] uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5 ${
                        msg.role === 'user' 
                            ? 'opacity-80' 
                            : settings.highContrast 
                                ? 'text-gray-400' 
                                : 'text-slate-400'
                    }`}>
                        <BookOpen size={10} /> Sources
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {msg.sources.map((source, idx) => (
                            <a 
                                key={idx} 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all max-w-[220px] ${
                                    msg.role === 'user' 
                                        ? 'bg-white/10 hover:bg-white/20 text-white' 
                                        : settings.highContrast
                                            ? 'bg-gray-900 border border-yellow-500/30 text-yellow-300 hover:border-yellow-500'
                                            : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white hover:border-emerald-200 hover:text-emerald-700 hover:shadow-sm'
                                }`}
                                title={source.title}
                            >
                                <span className="truncate">{source.title}</span>
                                <ExternalLink size={10} className="opacity-50 shrink-0" />
                            </a>
                        ))}
                    </div>
                </div>
              )}

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

      {/* Suggested Queries */}
      {messages.length < 3 && (
        <div className="px-4 pb-2">
            <p className={`text-xs font-semibold mb-2 ${settings.highContrast ? 'text-yellow-400' : 'text-slate-500'}`}>
                {settings.language === 'ml' ? 'നിർദ്ദേശിച്ച ചോദ്യങ്ങൾ:' : 'SUGGESTED:'}
            </p>
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

      {/* Image Preview */}
      {selectedImage && (
          <div className="px-4 pb-2 flex items-center gap-2 animate-in slide-in-from-bottom-2">
              <div className="relative group">
                  <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-lg border-2 border-emerald-500" />
                  <button onClick={clearImage} className="absolute -top-1 -right-1 bg-gray-800 text-white rounded-full p-0.5 shadow-md hover:bg-red-500 transition-colors">
                      <X size={12} />
                  </button>
              </div>
              <span className="text-xs text-slate-500 italic">Image attached</span>
          </div>
      )}

      {/* Input Area */}
      <div className={`p-4 border-t ${settings.highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'}`}>
        <div className="relative flex items-center gap-2">
          {/* Hidden File Input */}
          <input 
             type="file" 
             ref={fileInputRef}
             accept="image/*"
             onChange={handleImageSelect}
             className="hidden" 
          />
          
          <button 
             onClick={() => fileInputRef.current?.click()}
             className={`p-3 rounded-xl border transition-all ${
                 settings.highContrast 
                  ? 'border-gray-700 text-yellow-400 hover:bg-gray-800' 
                  : 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-emerald-600'
             }`}
             title={t.upload}
          >
              <ImageIcon size={20} />
          </button>

          <div className="relative flex-1">
             <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t.inputPlaceholder}
                className={`w-full pl-4 pr-12 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                settings.highContrast 
                    ? 'bg-black text-yellow-300 border-yellow-500 placeholder-gray-500' 
                    : 'bg-slate-50 text-slate-900 border-slate-200 placeholder-slate-400'
                } ${settings.largeText ? 'text-lg' : 'text-base'}`}
             />
             <button
                onClick={handleMicClick}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${
                    isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : settings.highContrast 
                        ? 'text-yellow-400 hover:bg-gray-800' 
                        : 'text-slate-400 hover:bg-slate-200'
                }`}
                title={t.voice}
                >
                <Mic size={20} />
            </button>
          </div>
          
          <button
            onClick={() => handleSend()}
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className={`p-3 rounded-xl transition-all ${
              (!input.trim() && !selectedImage)
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:scale-105 active:scale-95'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;