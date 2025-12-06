import React from 'react';
import { KERALA_DISTRICTS } from '../constants';
import { AlertLevel, DistrictData, AppSettings } from '../types';
import { CloudRain, AlertTriangle, ShieldAlert, Droplets, MapPin } from './Icons';

interface DashboardProps {
  settings: AppSettings;
}

const getAlertColor = (level: AlertLevel, highContrast: boolean): string => {
  if (highContrast) {
     switch (level) {
      case 'Green': return 'border-l-4 border-green-400 bg-gray-900';
      case 'Yellow': return 'border-l-4 border-yellow-400 bg-gray-900';
      case 'Orange': return 'border-l-4 border-orange-500 bg-gray-900';
      case 'Red': return 'border-l-4 border-red-600 bg-gray-900';
    }
  }
  switch (level) {
    case 'Green': return 'bg-emerald-50 border-emerald-200 text-emerald-900';
    case 'Yellow': return 'bg-yellow-50 border-yellow-200 text-yellow-900';
    case 'Orange': return 'bg-orange-50 border-orange-200 text-orange-900';
    case 'Red': return 'bg-red-50 border-red-200 text-red-900';
  }
  return 'bg-white';
};

const getBadgeColor = (level: AlertLevel) => {
  switch(level) {
    case 'Green': return 'bg-green-100 text-green-800';
    case 'Yellow': return 'bg-yellow-100 text-yellow-800';
    case 'Orange': return 'bg-orange-100 text-orange-800';
    case 'Red': return 'bg-red-100 text-red-800';
  }
};

const DistrictCard: React.FC<{ district: DistrictData; settings: AppSettings }> = ({ district, settings }) => {
  const cardStyle = getAlertColor(district.alertLevel, settings.highContrast);
  const isCritical = district.alertLevel === 'Red' || district.alertLevel === 'Orange';

  return (
    <div className={`rounded-xl p-4 border transition-all hover:shadow-md ${cardStyle} ${settings.highContrast ? 'border-gray-700' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-bold flex items-center gap-1 ${settings.largeText ? 'text-xl' : 'text-lg'} ${settings.highContrast ? 'text-white' : ''}`}>
          <MapPin size={16} className={settings.highContrast ? 'text-yellow-400' : 'text-slate-500'} />
          {district.name}
        </h3>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getBadgeColor(district.alertLevel)}`}>
          {district.alertLevel} Alert
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center gap-2">
            <CloudRain size={16} className={settings.highContrast ? 'text-blue-300' : 'text-blue-500'} />
            <span className={`font-mono font-medium ${settings.highContrast ? 'text-gray-300' : ''}`}>{district.rainfall}</span>
        </div>
        <div className="flex items-center gap-2">
            <Droplets size={16} className={district.floodRisk === 'Critical' ? 'text-red-500' : settings.highContrast ? 'text-gray-300' : 'text-slate-500'} />
            <span className={`text-sm ${district.floodRisk === 'Critical' ? 'text-red-600 font-bold' : settings.highContrast ? 'text-gray-300' : 'text-slate-600'}`}>
              Risk: {district.floodRisk}
            </span>
        </div>
      </div>

      <p className={`text-sm leading-relaxed ${settings.highContrast ? 'text-gray-400' : 'text-slate-600'}`}>
        {district.description}
      </p>

      {isCritical && (
        <div className={`mt-3 flex items-center gap-2 text-xs font-bold ${settings.highContrast ? 'text-red-400' : 'text-red-600'}`}>
           <AlertTriangle size={14} />
           <span>Take Precautions</span>
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ settings }) => {
  return (
    <div className={`h-full overflow-y-auto p-4 md:p-6 ${settings.highContrast ? 'bg-black text-white' : 'bg-slate-100'}`}>
      <div className="mb-6">
        <h2 className={`font-bold mb-2 flex items-center gap-2 ${settings.largeText ? 'text-2xl' : 'text-xl'}`}>
          <ShieldAlert className="text-emerald-600" />
          Live District Status
        </h2>
        <p className={`text-sm ${settings.highContrast ? 'text-gray-400' : 'text-slate-500'}`}>
          Last Updated: {new Date().toLocaleDateString()} 08:30 AM IST (Simulated)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
        {KERALA_DISTRICTS.map(district => (
          <DistrictCard key={district.id} district={district} settings={settings} />
        ))}
      </div>
      
      <div className={`mt-8 p-4 rounded-lg border ${settings.highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'}`}>
         <h3 className="font-bold mb-2">Legend</h3>
         <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>Green: Normal (&lt;64mm)</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span>Yellow: Watch (64-115mm)</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                <span>Orange: Alert (115-204mm)</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600"></span>
                <span>Red: Warning (&gt;204mm)</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;