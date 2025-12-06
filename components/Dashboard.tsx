import React, { useState } from 'react';
import { KERALA_DISTRICTS, KERALA_DAMS, KERALA_RIVERS, UI_TRANSLATIONS } from '../constants';
import { AlertLevel, DistrictData, AppSettings } from '../types';
import { CloudRain, AlertTriangle, ShieldAlert, Droplets, MapPin, Waves, ArrowUpRight, ArrowRight, ArrowDownRight, Share2, CheckSquare } from './Icons';

interface DashboardProps {
  settings: AppSettings;
  isSidebar?: boolean;
}

const getAlertColor = (level: AlertLevel, highContrast: boolean): string => {
  if (highContrast) {
     switch (level) {
      case 'Green': return 'border-l-4 border-l-green-400 bg-gray-900 border-gray-700';
      case 'Yellow': return 'border-l-4 border-l-yellow-400 bg-gray-900 border-gray-700';
      case 'Orange': return 'border-l-4 border-l-orange-500 bg-gray-900 border-gray-700';
      case 'Red': return 'border-l-4 border-l-red-600 bg-gray-900 border-gray-700';
    }
  }
  // Added border-l-4 for strong visual indication in standard mode too
  switch (level) {
    case 'Green': return 'bg-emerald-50 border border-emerald-100 border-l-4 border-l-emerald-500 text-emerald-900';
    case 'Yellow': return 'bg-yellow-50 border border-yellow-100 border-l-4 border-l-yellow-500 text-yellow-900';
    case 'Orange': return 'bg-orange-50 border border-orange-100 border-l-4 border-l-orange-500 text-orange-900';
    case 'Red': return 'bg-red-50 border border-red-100 border-l-4 border-l-red-600 text-red-900';
  }
  return 'bg-white border-l-4 border-l-slate-200';
};

const getBadgeColor = (level: AlertLevel) => {
  switch(level) {
    case 'Green': return 'bg-green-100 text-green-800 border border-green-200';
    case 'Yellow': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case 'Orange': return 'bg-orange-100 text-orange-800 border border-orange-200';
    case 'Red': return 'bg-red-100 text-red-800 border border-red-200';
  }
};

const DistrictCard: React.FC<{ district: DistrictData; settings: AppSettings; compact?: boolean }> = ({ district, settings, compact }) => {
  const cardStyle = getAlertColor(district.alertLevel, settings.highContrast);
  const isCritical = district.alertLevel === 'Red' || district.alertLevel === 'Orange';
  const t = UI_TRANSLATIONS[settings.language];
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = `⚠️ ${district.alertLevel.toUpperCase()} ALERT - ${district.name}\nRainfall: ${district.rainfall} | Risk: ${district.floodRisk}\n${district.description}\n\nStay safe! Via Kerala Monsoon Companion`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative rounded-xl transition-all hover:shadow-md overflow-hidden ${cardStyle} ${compact ? 'p-3' : 'p-4'}`}>
      {/* Background Animation for Critical Alerts */}
      {isCritical && !settings.highContrast && (
          <div className="absolute inset-0 bg-red-400/5 animate-pulse pointer-events-none" />
      )}
      
      <div className="relative z-10">
        <div className="flex justify-between items-start gap-3 mb-2">
            <h3 className={`font-bold flex items-center gap-1 min-w-0 flex-1 ${settings.largeText ? 'text-lg' : 'text-base'} ${settings.highContrast ? 'text-white' : ''}`}>
                <MapPin size={compact ? 14 : 16} className={`shrink-0 ${settings.highContrast ? 'text-yellow-400' : 'text-slate-500'}`} />
                <span className="truncate" title={district.name}>{district.name}</span>
            </h3>
            
            <span className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ${getBadgeColor(district.alertLevel)}`}>
               <span className={`w-2 h-2 rounded-full ${
                  district.alertLevel === 'Red' ? 'bg-red-600' :
                  district.alertLevel === 'Orange' ? 'bg-orange-600' :
                  district.alertLevel === 'Yellow' ? 'bg-yellow-600' : 'bg-green-600'
               }`}></span>
               {district.alertLevel.toUpperCase()}
            </span>
        </div>
        
        <div className={`grid grid-cols-2 gap-2 ${compact ? 'mb-2' : 'mb-3'}`}>
            <div className="flex items-center gap-1.5">
                <CloudRain size={14} className={settings.highContrast ? 'text-blue-300' : 'text-blue-500'} />
                <span className={`font-mono font-medium text-xs ${settings.highContrast ? 'text-gray-300' : ''}`}>{district.rainfall}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Droplets size={14} className={district.floodRisk === 'Critical' ? 'text-red-500' : settings.highContrast ? 'text-gray-300' : 'text-slate-500'} />
                <span className={`text-xs ${district.floodRisk === 'Critical' ? 'text-red-600 font-bold' : settings.highContrast ? 'text-gray-300' : 'text-slate-600'}`}>
                {t.risk}: {district.floodRisk}
                </span>
            </div>
        </div>

        <p className={`text-xs leading-relaxed ${settings.highContrast ? 'text-gray-400' : 'text-slate-600'} ${compact ? 'line-clamp-2' : ''}`}>
            {district.description}
        </p>

        <div className={`flex items-center justify-between ${compact ? 'mt-2' : 'mt-3'}`}>
            {isCritical ? (
                <div className={`flex items-center gap-1 text-[10px] font-bold ${settings.highContrast ? 'text-red-400' : 'text-red-600'}`}>
                    <AlertTriangle size={12} />
                    <span>{t.takeAction}</span>
                </div>
            ) : <div />}
            
            <button 
                onClick={handleShare}
                className={`p-1.5 rounded-full transition-colors ${copied ? 'bg-green-100 text-green-700' : 'hover:bg-black/5'}`}
                title={t.share}
            >
                {copied ? <CheckSquare size={14} /> : <Share2 size={14} />}
            </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ settings, isSidebar = false }) => {
  const t = UI_TRANSLATIONS[settings.language];
  
  // Use a single column grid if isSidebar is true, otherwise use responsive grid
  const gridClass = isSidebar 
    ? 'grid-cols-1' 
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className={`h-full overflow-y-auto ${isSidebar ? 'p-3' : 'p-6'} ${settings.highContrast ? 'bg-black text-white' : 'bg-slate-100'}`}>
      
      {/* Header */}
      <div className={`${isSidebar ? 'mb-4' : 'mb-6'}`}>
        <h2 className={`font-bold mb-1 flex items-center gap-2 ${settings.largeText ? 'text-xl' : 'text-lg'}`}>
          <ShieldAlert className="text-emerald-600" size={isSidebar ? 20 : 24} />
          {t.dashboard}
        </h2>
        <p className={`text-xs ${settings.highContrast ? 'text-gray-400' : 'text-slate-500'}`}>
          {t.lastUpdated}: {new Date().toLocaleDateString()} 08:30 AM IST
        </p>
      </div>

      {/* Dam Levels Section */}
      <div className={`${isSidebar ? 'mb-6' : 'mb-8'}`}>
          <h3 className={`font-bold mb-3 flex items-center gap-2 ${settings.largeText ? 'text-lg' : 'text-base'}`}>
              <Waves size={18} className="text-blue-500" /> {t.damLevels}
          </h3>
          <div className={`grid gap-4 ${isSidebar ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
             {KERALA_DAMS.map(dam => {
                 const percentage = Math.min((dam.currentLevel / dam.maxLevel) * 100, 100);
                 const isDanger = percentage > 95;
                 const isWarning = percentage > 80;
                 const colorClass = isDanger ? 'bg-red-500' : isWarning ? 'bg-orange-400' : 'bg-blue-500';

                 return (
                     <div key={dam.id} className={`rounded-xl border ${isSidebar ? 'p-3' : 'p-4'} ${settings.highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'}`}>
                         <div className="flex justify-between items-center mb-2">
                             <span className="font-semibold text-xs">{dam.name}</span>
                             <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isDanger ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                                 {dam.status}
                             </span>
                         </div>
                         <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-1 dark:bg-gray-700">
                             <div 
                                className={`h-full rounded-full transition-all duration-1000 ${colorClass}`} 
                                style={{ width: `${percentage}%` }}
                             />
                         </div>
                         <div className="flex justify-between text-[10px] text-slate-500 dark:text-gray-400 font-mono">
                             <span>{dam.currentLevel} {dam.unit}</span>
                             <span>Max: {dam.maxLevel}</span>
                         </div>
                     </div>
                 )
             })}
          </div>
      </div>

      {/* River Levels Section */}
      <div className={`${isSidebar ? 'mb-6' : 'mb-8'}`}>
          <h3 className={`font-bold mb-3 flex items-center gap-2 ${settings.largeText ? 'text-lg' : 'text-base'}`}>
              <Droplets size={18} className="text-blue-400" /> {t.riverLevels}
          </h3>
          <div className={`grid gap-3 ${isSidebar ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6'}`}>
              {KERALA_RIVERS.map(river => (
                  <div key={river.id} className={`p-2 rounded-xl border text-center ${settings.highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'}`}>
                      <p className="text-xs font-semibold mb-1 truncate" title={river.name}>{river.name}</p>
                      <div className="flex items-center justify-center gap-1 mb-1">
                          <span className={`font-bold text-sm ${river.level > river.warningLevel ? 'text-orange-600' : 'text-slate-700 dark:text-gray-200'}`}>
                             {river.level}m
                          </span>
                          {river.trend === 'Rising' && <ArrowUpRight size={12} className="text-red-500" />}
                          {river.trend === 'Falling' && <ArrowDownRight size={12} className="text-green-500" />}
                          {river.trend === 'Stable' && <ArrowRight size={12} className="text-slate-400" />}
                      </div>
                      <p className="text-[10px] text-slate-400">Warn: {river.warningLevel}</p>
                  </div>
              ))}
          </div>
      </div>

      {/* District Alerts */}
      <h3 className={`font-bold mb-3 ${settings.largeText ? 'text-lg' : 'text-base'}`}>
          {t.district} Status
      </h3>
      <div className={`grid gap-3 ${gridClass}`}>
        {KERALA_DISTRICTS.map(district => (
          <DistrictCard key={district.id} district={district} settings={settings} compact={isSidebar} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;