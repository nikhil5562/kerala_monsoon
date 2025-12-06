import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import { AppSettings } from './types';
import { Menu, X, Accessibility, CloudLightning, BookOpen } from './components/Icons';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard'>('chat');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    largeText: false,
    highContrast: false,
    simpleLanguage: false,
  });
  const [showAccessibility, setShowAccessibility] = useState(false);

  const toggleSettings = (key: keyof AppSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${settings.highContrast ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Header */}
      <header className={`z-20 shadow-sm flex items-center justify-between px-4 py-3 ${
        settings.highContrast 
          ? 'bg-gray-900 border-b border-gray-700' 
          : 'bg-white/80 backdrop-blur-md border-b border-emerald-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-lg text-white">
            <CloudLightning size={24} />
          </div>
          <div>
            <h1 className={`font-bold leading-tight ${settings.largeText ? 'text-xl' : 'text-lg'}`}>
              Monsoon Companion
            </h1>
            <p className={`text-xs ${settings.highContrast ? 'text-gray-400' : 'text-slate-500'}`}>Kerala Relief & Advisory</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop Nav */}
          <div className="hidden md:flex bg-slate-100 rounded-lg p-1 mr-4 dark:bg-gray-800">
             <button 
               onClick={() => setActiveTab('chat')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'chat' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Assistant
             </button>
             <button 
               onClick={() => setActiveTab('dashboard')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Dashboard
             </button>
          </div>

          <button 
            onClick={() => setShowAccessibility(!showAccessibility)}
            className={`p-2 rounded-full transition-colors ${showAccessibility ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-slate-100'}`}
            aria-label="Accessibility Settings"
          >
            <Accessibility size={20} />
          </button>
          
          <button 
            className="md:hidden p-2 hover:bg-slate-100 rounded-full"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Accessibility Popover */}
      {showAccessibility && (
        <div className="absolute top-16 right-4 z-50 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-4 animate-in fade-in slide-in-from-top-2">
           <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
             <Accessibility size={16} /> Accessibility
           </h3>
           <div className="space-y-3">
             <label className="flex items-center justify-between cursor-pointer">
               <span className="text-sm text-slate-600">Large Text</span>
               <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.largeText ? 'bg-emerald-500' : 'bg-slate-300'}`} onClick={() => toggleSettings('largeText')}>
                  <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${settings.largeText ? 'left-6' : 'left-1'}`} />
               </div>
             </label>
             <label className="flex items-center justify-between cursor-pointer">
               <span className="text-sm text-slate-600">High Contrast</span>
               <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.highContrast ? 'bg-emerald-500' : 'bg-slate-300'}`} onClick={() => toggleSettings('highContrast')}>
                  <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${settings.highContrast ? 'left-6' : 'left-1'}`} />
               </div>
             </label>
             <label className="flex items-center justify-between cursor-pointer">
               <span className="text-sm text-slate-600 flex items-center gap-1">
                 <BookOpen size={14} /> Simple Language
               </span>
               <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.simpleLanguage ? 'bg-emerald-500' : 'bg-slate-300'}`} onClick={() => toggleSettings('simpleLanguage')}>
                  <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${settings.simpleLanguage ? 'left-6' : 'left-1'}`} />
               </div>
             </label>
           </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar (Dashboard) - Desktop */}
        <div className={`hidden md:block w-1/3 max-w-sm border-r border-slate-200 h-full overflow-hidden ${settings.highContrast ? 'border-gray-800' : ''}`}>
           <Dashboard settings={settings} />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 h-full w-full">
           {/* Mobile Tab View */}
           <div className="md:hidden h-full">
              {activeTab === 'chat' ? (
                <ChatInterface settings={settings} />
              ) : (
                <Dashboard settings={settings} />
              )}
           </div>
           
           {/* Desktop View (Chat always visible in main area) */}
           <div className="hidden md:block h-full">
              <ChatInterface settings={settings} />
           </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="md:hidden absolute inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)}>
           <div className="absolute top-16 left-0 right-0 bg-white p-4 shadow-lg border-b border-slate-200" onClick={e => e.stopPropagation()}>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => { setActiveTab('chat'); setShowMobileMenu(false); }}
                  className={`p-3 rounded-lg text-left font-medium ${activeTab === 'chat' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600'}`}
                >
                  Ask Assistant
                </button>
                <button 
                  onClick={() => { setActiveTab('dashboard'); setShowMobileMenu(false); }}
                  className={`p-3 rounded-lg text-left font-medium ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600'}`}
                >
                  District Alerts
                </button>
              </div>
           </div>
        </div>
      )}
      
    </div>
  );
};

export default App;