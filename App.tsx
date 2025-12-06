import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import { AppSettings, UserLocation } from './types';
import { Menu, X, Accessibility, CloudLightning, BookOpen, Settings, Phone, CheckSquare, History, LifeBuoy, MapPin, Languages, ArrowRight, PanelLeftClose, PanelLeftOpen, ShieldAlert } from './components/Icons';
import { UI_TRANSLATIONS, PREPARE_CONTENT, KERALA_DISTRICTS } from './constants';

// --- Emergency Panel Component ---
const EmergencyPanel: React.FC<{ expanded: boolean; onToggle: () => void; settings: AppSettings }> = ({ expanded, onToggle, settings }) => {
    const t = UI_TRANSLATIONS[settings.language];
    return (
        <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end transition-all ${expanded ? 'gap-3' : ''}`}>
            {expanded && (
                <div className="bg-white rounded-xl shadow-2xl border border-red-100 overflow-hidden w-64 animate-in slide-in-from-bottom-5">
                    <div className="bg-red-600 text-white p-3 font-bold flex justify-between items-center">
                        <span>{t.emergency} Contacts</span>
                        <button onClick={onToggle} className="hover:bg-red-700 rounded-full p-1"><X size={16}/></button>
                    </div>
                    <div className="p-3 space-y-3">
                        <a href="tel:1077" className="flex items-center gap-3 p-2 hover:bg-red-50 rounded-lg text-red-900 transition-colors">
                            <div className="bg-red-100 p-2 rounded-full"><Phone size={18} className="text-red-600"/></div>
                            <div>
                                <p className="text-sm font-bold">KSDMA / Collectorate</p>
                                <p className="text-xs text-red-600 font-mono">1077</p>
                            </div>
                        </a>
                        <a href="tel:112" className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg text-slate-900 transition-colors">
                            <div className="bg-slate-100 p-2 rounded-full"><ShieldAlert size={18} className="text-slate-600"/></div>
                            <div>
                                <p className="text-sm font-bold">Police / Fire / Amb</p>
                                <p className="text-xs text-slate-500 font-mono">112</p>
                            </div>
                        </a>
                        <div className="border-t pt-2">
                             <button className="w-full bg-slate-900 text-white text-xs py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800">
                                 <LifeBuoy size={14} /> Find Nearest Shelter (Sim)
                             </button>
                        </div>
                    </div>
                </div>
            )}
            <button 
                onClick={onToggle}
                className={`shadow-lg flex items-center gap-2 px-5 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 ${
                    expanded ? 'bg-slate-800 text-white' : 'bg-red-600 text-white animate-bounce'
                }`}
                style={{ animationDuration: '3s' }}
            >
                <LifeBuoy size={24} />
                {!expanded && <span className="hidden md:inline">{t.emergency}</span>}
            </button>
        </div>
    );
};

// --- Prepare Tab Component ---
const PrepareTab: React.FC<{ settings: AppSettings }> = ({ settings }) => {
    return (
        <div className={`h-full overflow-y-auto p-4 md:p-8 ${settings.highContrast ? 'bg-black text-white' : 'bg-slate-50'}`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CheckSquare className="text-emerald-600" /> Prepare & Learn
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border ${settings.highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'}`}>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                        <LifeBuoy size={20} /> Safety Checklists
                    </h3>
                    <div className="space-y-6">
                        {PREPARE_CONTENT.checklists.map((list, idx) => (
                            <div key={idx}>
                                <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider opacity-70">{list.title}</h4>
                                <ul className="space-y-2">
                                    {list.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                                            <span className="text-sm opacity-90">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`p-6 rounded-2xl border ${settings.highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'}`}>
                     <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-400">
                        <History size={20} /> Historical Timeline
                    </h3>
                    <div className="relative border-l-2 border-slate-200 dark:border-gray-700 ml-3 space-y-8 pl-6 py-2">
                        {PREPARE_CONTENT.history.map((event, idx) => (
                            <div key={idx} className="relative">
                                <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-blue-500 border-2 border-white dark:border-gray-900"></span>
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full mb-1 inline-block">
                                    {event.year}
                                </span>
                                <h4 className="font-bold text-base mb-1">{event.title}</h4>
                                <p className="text-sm opacity-70 leading-relaxed">{event.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main App Component ---
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'prepare'>('chat');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [settings, setSettings] = useState<AppSettings>({
    largeText: false,
    highContrast: false,
    simpleLanguage: false,
    language: 'en',
    location: { district: '' }
  });

  const toggleSettings = (key: keyof AppSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLocationChange = (district: string) => {
      setSettings(prev => ({ ...prev, location: { ...prev.location, district } }));
  };

  const t = UI_TRANSLATIONS[settings.language];

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${settings.highContrast ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Header */}
      <header className={`z-20 shadow-sm flex items-center justify-between px-4 py-3 shrink-0 ${
        settings.highContrast 
          ? 'bg-gray-900 border-b border-gray-700' 
          : 'bg-white/80 backdrop-blur-md border-b border-emerald-100'
      }`}>
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle (Desktop Only, only in Chat mode) */}
          {activeTab === 'chat' && (
             <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-500 dark:text-gray-400"
                title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
             >
                {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
             </button>
          )}

          <div className="p-2 bg-emerald-600 rounded-lg text-white">
            <CloudLightning size={24} />
          </div>
          <div>
            <h1 className={`font-bold leading-tight ${settings.largeText ? 'text-xl' : 'text-lg'}`}>
              {t.appTitle}
            </h1>
            <p className={`text-xs ${settings.highContrast ? 'text-gray-400' : 'text-slate-500'}`}>{t.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop Nav */}
          <div className="hidden md:flex bg-slate-100 rounded-lg p-1 mr-4 dark:bg-gray-800">
             <button 
               onClick={() => setActiveTab('chat')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'chat' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
             >
               {t.assistant}
             </button>
             <button 
               onClick={() => setActiveTab('dashboard')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
             >
               {t.dashboard}
             </button>
             <button 
               onClick={() => setActiveTab('prepare')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'prepare' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
             >
               {t.prepare}
             </button>
          </div>

          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-slate-100'}`}
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
          
          <button 
            className="md:hidden p-2 hover:bg-slate-100 rounded-full"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 z-50 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-slate-200 dark:border-gray-700 p-5 animate-in fade-in slide-in-from-top-2">
           <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Settings size={18} /> {t.settings}
                </h3>
                <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
           </div>
           
           <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
             <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-gray-800">
                 <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1"><MapPin size={12}/> {t.myLocation}</h4>
                 <div>
                     <label className="block text-sm text-slate-600 mb-1">{t.district}</label>
                     <select 
                        value={settings.location?.district || ''}
                        onChange={(e) => handleLocationChange(e.target.value)}
                        className="w-full p-2 text-sm rounded-lg border border-slate-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                     >
                         <option value="">Select District</option>
                         {KERALA_DISTRICTS.map(d => (
                             <option key={d.id} value={d.name}>{d.name}</option>
                         ))}
                     </select>
                 </div>
             </div>

             <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-gray-800">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1"><Languages size={12}/> {t.language}</h4>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setSettings(prev => ({...prev, language: 'en'}))}
                        className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${settings.language === 'en' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold' : 'border-slate-200 text-slate-600'}`}
                    >
                        English
                    </button>
                    <button 
                        onClick={() => setSettings(prev => ({...prev, language: 'ml'}))}
                        className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${settings.language === 'ml' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold' : 'border-slate-200 text-slate-600'}`}
                    >
                        മലയാളം
                    </button>
                </div>
             </div>

             <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1"><Accessibility size={12}/> Accessibility</h4>
                <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-slate-600 dark:text-gray-300">Large Text</span>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.largeText ? 'bg-emerald-500' : 'bg-slate-300'}`} onClick={() => toggleSettings('largeText')}>
                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${settings.largeText ? 'left-6' : 'left-1'}`} />
                </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-slate-600 dark:text-gray-300">High Contrast</span>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.highContrast ? 'bg-emerald-500' : 'bg-slate-300'}`} onClick={() => toggleSettings('highContrast')}>
                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${settings.highContrast ? 'left-6' : 'left-1'}`} />
                </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-slate-600 dark:text-gray-300 flex items-center gap-1">
                    <BookOpen size={14} /> Simple Language
                </span>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.simpleLanguage ? 'bg-emerald-500' : 'bg-slate-300'}`} onClick={() => toggleSettings('simpleLanguage')}>
                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${settings.simpleLanguage ? 'left-6' : 'left-1'}`} />
                </div>
                </label>
             </div>
           </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar (Dashboard) - Desktop - Only in CHAT mode */}
        {activeTab === 'chat' && sidebarOpen && (
            <div className={`hidden md:block w-[350px] min-w-[350px] shrink-0 border-r border-slate-200 h-full transition-all bg-white dark:bg-black ${settings.highContrast ? 'border-gray-800' : ''}`}>
                <Dashboard settings={settings} isSidebar={true} />
            </div>
        )}

        {/* Main Area */}
        <div className="flex-1 h-full w-full relative min-w-0">
           
           {/* Mobile View */}
           <div className="md:hidden h-full">
              {activeTab === 'chat' && <ChatInterface settings={settings} />}
              {activeTab === 'dashboard' && <Dashboard settings={settings} />}
              {activeTab === 'prepare' && <PrepareTab settings={settings} />}
           </div>
           
           {/* Desktop View */}
           <div className="hidden md:block h-full">
              {activeTab === 'chat' && <ChatInterface settings={settings} />}
              
              {/* If dashboard tab is active, we render Dashboard HERE full width, not in sidebar */}
              {activeTab === 'dashboard' && <Dashboard settings={settings} />}
              
              {activeTab === 'prepare' && <PrepareTab settings={settings} />}
           </div>
        </div>
      </div>

      {/* Emergency Floating Panel */}
      <EmergencyPanel expanded={showEmergency} onToggle={() => setShowEmergency(!showEmergency)} settings={settings} />

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="md:hidden absolute inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)}>
           <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 p-4 shadow-lg border-b border-slate-200 dark:border-gray-800" onClick={e => e.stopPropagation()}>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => { setActiveTab('chat'); setShowMobileMenu(false); }}
                  className={`p-3 rounded-lg text-left font-medium ${activeTab === 'chat' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600'}`}
                >
                  {t.assistant}
                </button>
                <button 
                  onClick={() => { setActiveTab('dashboard'); setShowMobileMenu(false); }}
                  className={`p-3 rounded-lg text-left font-medium ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600'}`}
                >
                  {t.dashboard}
                </button>
                <button 
                  onClick={() => { setActiveTab('prepare'); setShowMobileMenu(false); }}
                  className={`p-3 rounded-lg text-left font-medium ${activeTab === 'prepare' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600'}`}
                >
                  {t.prepare}
                </button>
              </div>
           </div>
        </div>
      )}
      
    </div>
  );
};

export default App;