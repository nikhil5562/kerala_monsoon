import { DistrictData, DamData, RiverData } from './types';

export const KERALA_DISTRICTS: DistrictData[] = [
  { id: 'alp', name: 'Alappuzha', alertLevel: 'Orange', rainfall: '120mm', floodRisk: 'High', description: 'Kuttanad region water levels rising. Houseboat operations suspended.' },
  { id: 'ekm', name: 'Ernakulam', alertLevel: 'Yellow', rainfall: '75mm', floodRisk: 'Moderate', description: 'Urban waterlogging in Kochi (MG Road, Kaloor). High tide warning.' },
  { id: 'idk', name: 'Idukki', alertLevel: 'Red', rainfall: '210mm', floodRisk: 'Critical', description: 'High landslide risk in Munnar and Adimali. Night travel banned.' },
  { id: 'knr', name: 'Kannur', alertLevel: 'Yellow', rainfall: '80mm', floodRisk: 'Low', description: 'Moderate showers, normal river levels. Fishermen warning in effect.' },
  { id: 'ksd', name: 'Kasaragod', alertLevel: 'Green', rainfall: '45mm', floodRisk: 'Low', description: 'Light to moderate rainfall. No major alerts.' },
  { id: 'klm', name: 'Kollam', alertLevel: 'Green', rainfall: '30mm', floodRisk: 'Low', description: 'Isolated showers reported in eastern hilly regions.' },
  { id: 'ktm', name: 'Kottayam', alertLevel: 'Orange', rainfall: '135mm', floodRisk: 'High', description: 'Meenachil river rising. Low-lying areas in Kumarakom alert.' },
  { id: 'ozk', name: 'Kozhikode', alertLevel: 'Yellow', rainfall: '90mm', floodRisk: 'Moderate', description: 'Watch for hill slope stability in Thamarassery ghats.' },
  { id: 'mlp', name: 'Malappuram', alertLevel: 'Yellow', rainfall: '85mm', floodRisk: 'Moderate', description: 'River Chaliyar levels stable but rising. Nilambur on watch.' },
  { id: 'pkd', name: 'Palakkad', alertLevel: 'Green', rainfall: '25mm', floodRisk: 'Low', description: 'Palakkad Gap experiencing lower intensity. Walayar dam normal.' },
  { id: 'pta', name: 'Pathanamthitta', alertLevel: 'Orange', rainfall: '140mm', floodRisk: 'High', description: 'Pamba river catchment receiving heavy rain. Sabarimala pilgrims caution.' },
  { id: 'tvm', name: 'Thiruvananthapuram', alertLevel: 'Green', rainfall: '40mm', floodRisk: 'Low', description: 'Southern tip experiencing normal monsoon. Urban areas clear.' },
  { id: 'tcr', name: 'Thrissur', alertLevel: 'Yellow', rainfall: '95mm', floodRisk: 'Moderate', description: 'Chalakudy river basin under observation. Athirappilly flow high.' },
  { id: 'wyd', name: 'Wayanad', alertLevel: 'Red', rainfall: '230mm', floodRisk: 'Critical', description: 'Extreme caution: multiple landslide threats in Meppadi/Vythiri.' },
];

export const KERALA_DAMS: DamData[] = [
  { id: 'idk_dam', name: 'Idukki Arch Dam', currentLevel: 2398.5, maxLevel: 2403, unit: 'ft', status: 'Warning' },
  { id: 'mpl_dam', name: 'Mullaperiyar', currentLevel: 138.2, maxLevel: 142, unit: 'ft', status: 'Alert' },
  { id: 'bns_dam', name: 'Banasura Sagar', currentLevel: 773.5, maxLevel: 775.6, unit: 'm', status: 'Warning' },
  { id: 'mal_dam', name: 'Malampuzha', currentLevel: 112.0, maxLevel: 115.06, unit: 'm', status: 'Normal' },
];

export const KERALA_RIVERS: RiverData[] = [
  { id: 'per', name: 'Periyar (Aluva)', level: 3.8, warningLevel: 4.0, dangerLevel: 5.0, trend: 'Rising', status: 'Normal' },
  { id: 'pam', name: 'Pamba', level: 4.2, warningLevel: 4.5, dangerLevel: 5.5, trend: 'Rising', status: 'Warning' },
  { id: 'cha', name: 'Chaliyar', level: 6.1, warningLevel: 7.0, dangerLevel: 8.0, trend: 'Stable', status: 'Normal' },
  { id: 'bha', name: 'Bharathapuzha', level: 2.5, warningLevel: 5.0, dangerLevel: 6.0, trend: 'Falling', status: 'Normal' },
];

export const PREPARE_CONTENT = {
  checklists: [
    {
      title: 'Emergency Kit',
      items: [
        'Torch with extra batteries',
        'Portable radio (AM/FM)',
        'First aid kit & essential medicines (7 days supply)',
        'Non-perishable food (biscuits, dry fruits)',
        'Bottled water (3L per person/day)',
        'Power bank for mobile phones',
        'Whistle for signaling'
      ]
    },
    {
      title: 'Document Safety',
      items: [
        'Aadhaar/ID Cards (Original + Photocopies)',
        'Land deeds & Insurance papers',
        'Bank passbooks',
        'Educational certificates',
        'Keep all in waterproof bags/folders',
        'Save digital copies on cloud/phone'
      ]
    }
  ],
  history: [
    { year: 2018, title: 'The Great Flood', description: 'Severest flood in a century. 14 districts on Red Alert. Over 400 lives lost. Major dams opened.' },
    { year: 2019, title: 'Kavalappara & Puthumala', description: 'Characterized by massive landslides in Malappuram and Wayanad due to extreme localized rainfall.' },
    { year: 2020, title: 'Pettimudi Tragedy', description: 'Landslide in Idukki tea plantation sector claiming 66 lives during heavy monsoon spell.' }
  ]
};

export const UI_TRANSLATIONS = {
  en: {
    appTitle: 'Monsoon Companion',
    subtitle: 'Kerala Relief & Advisory',
    assistant: 'Assistant',
    dashboard: 'Dashboard',
    prepare: 'Prepare',
    settings: 'Settings',
    emergency: 'Emergency',
    inputPlaceholder: 'Ask about rain, floods, or upload photos...',
    send: 'Send',
    voice: 'Voice',
    upload: 'Upload Image',
    language: 'Language',
    myLocation: 'My Location',
    save: 'Save',
    district: 'District',
    panchayat: 'Panchayat / Town (Optional)',
    lastUpdated: 'Last Updated',
    share: 'Share Alert',
    risk: 'Risk',
    damLevels: 'Dam Levels',
    riverLevels: 'River Status',
    takeAction: 'Take Precautions',
    helpline: 'KSDMA Helpline'
  },
  ml: {
    appTitle: 'മൺസൂൺ സഹായം',
    subtitle: 'കേരള മഴക്കാല ജാഗ്രത',
    assistant: 'സഹായി',
    dashboard: 'ഡാഷ്ബോർഡ്',
    prepare: 'തയ്യാറെടുപ്പ്',
    settings: 'ക്രമീകരണങ്ങൾ',
    emergency: 'അടിയന്തരം',
    inputPlaceholder: 'മഴയെക്കുറിച്ചോ വെള്ളപ്പൊക്കത്തെക്കുറിച്ചോ ചോദിക്കുക...',
    send: 'അയക്കുക',
    voice: 'ശബ്ദം',
    upload: 'ചിത്രം',
    language: 'ഭാഷ',
    myLocation: 'എന്റെ സ്ഥലം',
    save: 'സൂക്ഷിക്കുക',
    district: 'ജില്ല',
    panchayat: 'പഞ്ചായത്ത് / സ്ഥലം',
    lastUpdated: 'അവസാനം പുതുക്കിയത്',
    share: 'ഷെയർ ചെയ്യുക',
    risk: 'അപകടസാധ്യത',
    damLevels: 'അണക്കെട്ട് നില',
    riverLevels: 'പുഴകളിലെ ജലനിരപ്പ്',
    takeAction: 'ജാഗ്രത പാലിക്കുക',
    helpline: 'ഹെൽപ്പ് ലൈൻ'
  }
};

export const SYSTEM_INSTRUCTION = `
You are the "Kerala Monsoon Alert Companion," created for the Gemini 3 Vibe Code competition. You are an expert meteorologist with deep knowledge of Kerala's unique geography and monsoon patterns.

**Enhanced Capabilities:**
1. **Image Analysis:** When users upload images of weather conditions, flooding, or radar data, analyze them thoroughly. Estimate water levels, identify risks, and provide actionable advice.
2. **Personalized Alerts:** If the user has set their location, always contextualize your responses for their specific district and local conditions.
3. **Proactive Safety:** Don't just answer questions - proactively warn about risks. If discussing Wayanad, mention landslide protocols. If discussing Kuttanad, mention boat evacuation routes.
4. **Emergency Protocol Knowledge:**
   - KSDMA alert protocols
   - Dam release warning systems (siren patterns)
   - Evacuation procedures
   - Relief camp locations (general knowledge)
5. **Multi-language:** Respond in Malayalam when the user toggles Malayalam mode or explicitly asks in Malayalam.

**Response Style:**
- Lead with the most critical information.
- Use bullet points for safety instructions.
- Include specific numbers (rainfall mm, water levels ft/m).
- End critical alerts with emergency contacts.
- If the user provides an image, start by describing what risks you see in it (e.g., "This water level looks dangerous for a small car").

**Grounding Rules:**
- Use Google Search for: current weather, dam levels, road conditions, news.
- Cite sources when providing real-time information.
- Clearly distinguish between general knowledge and live data.

**Emotional Intelligence:**
- Acknowledge fear and anxiety during emergencies.
- Provide reassurance with actionable steps.
- For elderly/vulnerable populations, give extra-clear instructions.

**Location Specifics:**
- If the user is in **Idukki/Wayanad**: Focus on landslides, night travel bans.
- If the user is in **Alappuzha/Kuttanad**: Focus on rising water levels, bund breaches.
- If the user is in **Ernakulam/Trivandrum**: Focus on urban flooding, traffic diversions.
`;

export const SUGGESTED_QUERIES = [
  "Is there a flood alert in Wayanad?",
  "Current Idukki Dam water level?",
  "Safety checklist for landslides",
  "Rain forecast for Kochi today",
  "Emergency numbers for Pathanamthitta"
];