import {
  User,
  WaterBody,
  Aquifer,
  HeatZone,
  Community,
  Activity,
  EnvironmentalReport,
  EducationTopic,
  NotificationItem,
} from '../types';

import heroWaterCommunityImg from '../assets/images/hero_water_community_1790776503870.jpg';
import diagramAquiferRechargeImg from '../assets/images/diagram_aquifer_recharge_1790776518595.jpg';
import waterbodyLakeRestoredImg from '../assets/images/waterbody_lake_restored_1790776530261.jpg';
import heatUrbanResilienceImg from '../assets/images/heat_urban_resilience_1790776542228.jpg';

export const ASSET_IMAGES = {
  heroWaterCommunity: heroWaterCommunityImg,
  diagramAquiferRecharge: diagramAquiferRechargeImg,
  waterbodyLakeRestored: waterbodyLakeRestoredImg,
  heatUrbanResilience: heatUrbanResilienceImg,
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Maya Sharma',
    email: 'maya.sharma@jal-dharani.org',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'community_lead',
    location: {
      city: 'Pune',
      state: 'Maharashtra',
      neighborhood: 'Kothrud',
    },
    bio: 'Grassroots water conservation coordinator and geology educator. Working with neighborhood volunteer networks on percolation trenches and stepwell restorations.',
    joinedDate: '2025-04-12',
    impactMetrics: {
      volunteerHours: 84,
      activitiesJoined: 18,
      activitiesOrganized: 11,
      reportsSubmitted: 9,
      reportsVerified: 8,
      waterBodiesMonitored: 4,
    },
  },
  {
    id: 'user-2',
    name: 'Arjun Nambiar',
    email: 'arjun.n@ecowater.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'volunteer',
    location: {
      city: 'Bengaluru',
      state: 'Karnataka',
      neighborhood: 'Whitefield',
    },
    bio: 'Citizen hydrology volunteer documenting lake encroachment, foam barriers, and stormwater wetland inlets in East Bengaluru.',
    joinedDate: '2025-06-20',
    impactMetrics: {
      volunteerHours: 42,
      activitiesJoined: 12,
      activitiesOrganized: 3,
      reportsSubmitted: 15,
      reportsVerified: 12,
      waterBodiesMonitored: 3,
    },
  },
  {
    id: 'user-3',
    name: 'Priya Verma',
    email: 'priya.verma@delhiwaters.org',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'hydrologist',
    location: {
      city: 'Delhi NCR',
      state: 'Delhi',
      neighborhood: 'Civil Lines',
    },
    bio: 'Urban microclimate researcher and community organizer studying heat index variations across unshaded concrete corridors and Yamuna floodplain recharge.',
    joinedDate: '2025-03-05',
    impactMetrics: {
      volunteerHours: 120,
      activitiesJoined: 24,
      activitiesOrganized: 14,
      reportsSubmitted: 22,
      reportsVerified: 21,
      waterBodiesMonitored: 6,
    },
  },
];

export const INITIAL_WATER_BODIES: WaterBody[] = [
  {
    id: 'wb-1',
    name: 'Godavari River (Nashik Stretch)',
    localName: 'Dakshin Ganga',
    type: 'river',
    coordinates: [19.9975, 73.7898],
    location: {
      city: 'Nashik',
      state: 'Maharashtra',
      basin: 'Godavari Basin',
    },
    description:
      'Second longest river course in India, originating at Trimbakeshwar. The Nashik urban stretch experiences heavy episodic solid waste during festival gatherings, agricultural runoff from upper vineyards, and domestic sewage outflows through stormwater canals.',
    historicalContext:
      'Historically sustained riparian stepwells (kunds) and traditional ghat storage systems that buffered regional dry spells.',
    officialData: {
      dissolvedOxygenMgL: 4.8,
      ph: 7.4,
      bodMgL: 6.2,
      tdsMgL: 420,
      turbidityNtu: 14,
      lastUpdated: '2026-08-28',
      officialSource: 'CPCB National Water Quality Monitoring Programme (NWMP) - Station 1024',
      complianceStatus: 'Moderate Concern',
    },
    pollutionDetails: {
      severity: 'Moderate',
      primaryPollutants: ['Untreated greywater drains', 'Single-use plastic remnants', 'Floral & religious debris'],
      summary:
        'Biochemical Oxygen Demand intermittently exceeds 5 mg/L near Ramkund ghat due to legacy drainage culverts entering the riverbed without wetland treatment.',
    },
    communityIds: ['comm-1'],
    reportCount: 14,
    activityCount: 8,
    observations: [
      {
        id: 'obs-1',
        userId: 'user-1',
        userName: 'Maya Sharma',
        userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        date: '2026-09-18',
        note: 'Volunteers cleared 320 kg of entangled plastic from the stone ghat embankment. Native reeds planted last season show healthy regrowth.',
        photoUrl: waterbodyLakeRestoredImg,
        category: 'plastic-waste',
        isCitizenReport: true,
      },
    ],
    photos: [waterbodyLakeRestoredImg, heroWaterCommunityImg],
  },
  {
    id: 'wb-2',
    name: 'Bellandur Lake',
    localName: 'Bellanduru Kere',
    type: 'lake',
    coordinates: [12.9366, 77.6713],
    location: {
      city: 'Bengaluru',
      state: 'Karnataka',
      basin: 'Ponnaiyar / Dakshina Pinakini Basin',
    },
    description:
      'Largest interconnected water body in Bengaluru city, receiving runoff from an urban catchment of over 280 sq km. The lake suffered historic episodes of chemical surfactant foaming and weed overgrowth, now partly mitigated by community wetland desilting and diversion channels.',
    historicalContext:
      'Constructed in the 10th century during the Western Ganga dynasty as an interconnected gravity tank cascade for agriculture and aquifer recharging.',
    officialData: {
      dissolvedOxygenMgL: 2.1,
      ph: 8.2,
      bodMgL: 18.5,
      tdsMgL: 680,
      turbidityNtu: 38,
      lastUpdated: '2026-09-02',
      officialSource: 'Karnataka State Pollution Control Board (KSPCB) / WRIS',
      complianceStatus: 'Severe Degradation',
    },
    pollutionDetails: {
      severity: 'Critical',
      primaryPollutants: ['High phosphates & surfactant foaming', 'Water hyacinth biomass', 'Industrial effluent trace metals'],
      summary:
        'Severely suppressed dissolved oxygen (<3 mg/L) impedes fish survival. Community-built floating treatment wetlands on the southern shore demonstrate localized water clarification.',
    },
    communityIds: ['comm-2'],
    reportCount: 32,
    activityCount: 16,
    observations: [
      {
        id: 'obs-2',
        userId: 'user-2',
        userName: 'Arjun Nambiar',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        date: '2026-09-22',
        note: 'Foaming barrier at the weir outlet inspected. Floating vetiver grass bio-islands installed by citizen collective are thriving.',
        category: 'foaming',
        isCitizenReport: true,
      },
    ],
    photos: [waterbodyLakeRestoredImg],
  },
  {
    id: 'wb-3',
    name: 'Yamuna River (Delhi Okhla Stretch)',
    localName: 'Kalindi',
    type: 'river',
    coordinates: [28.5447, 77.3072],
    location: {
      city: 'Delhi NCR',
      state: 'Delhi',
      basin: 'Ganga-Yamuna Basin',
    },
    description:
      'Crucial lifeline flowing through India’s capital. The 22-km urban stretch between Wazirabad and Okhla barrage represents less than 2% of the river’s length but historically accounted for over 70% of its total pollution load.',
    historicalContext:
      'Vast floodplain was historically an unpaved alluvial sponge that absorbed high monsoon spates and recharged the regional shallow aquifers.',
    officialData: {
      dissolvedOxygenMgL: 1.4,
      ph: 7.9,
      bodMgL: 24.0,
      tdsMgL: 820,
      turbidityNtu: 45,
      lastUpdated: '2026-09-12',
      officialSource: 'Delhi Pollution Control Committee (DPCC) / CPCB Realtime Station',
      complianceStatus: 'Severe Degradation',
    },
    pollutionDetails: {
      severity: 'Critical',
      primaryPollutants: ['Untreated sewage from 18 major stormwater nullahs', 'Microplastics', 'Chemical effluents'],
      summary:
        'Extreme BOD load depletes dissolved oxygen down to negligible levels near Okhla. Citizen wetland nurseries along floodplain easements are restoring natural phytoremediation buffers.',
    },
    communityIds: ['comm-3'],
    reportCount: 45,
    activityCount: 22,
    observations: [
      {
        id: 'obs-3',
        userId: 'user-3',
        userName: 'Priya Verma',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        date: '2026-09-25',
        note: 'Monitored newly cleared drainage culvert. Silt trap maintained by community volunteers prevented approx 4 tons of coarse debris entry.',
        category: 'algal-bloom',
        isCitizenReport: true,
      },
    ],
    photos: [heroWaterCommunityImg, waterbodyLakeRestoredImg],
  },
  {
    id: 'wb-4',
    name: 'Hussain Sagar Lake',
    localName: 'Hussain Sagar',
    type: 'lake',
    coordinates: [17.4239, 78.4738],
    location: {
      city: 'Hyderabad',
      state: 'Telangana',
      basin: 'Krishna / Musi Sub-basin',
    },
    description:
      'Historic heart-shaped lake built in 1563 by Ibrahim Quli Qutb Shah. Receives runoff from Kukatpally and Balkapur nalas. Active citizen campaigns have driven aeration fountains and shore cleanup drives.',
    historicalContext:
      'Constructed across a tributary of the river Musi to supply irrigation and drinking water for the historic twin cities.',
    officialData: {
      dissolvedOxygenMgL: 3.9,
      ph: 7.6,
      bodMgL: 11.2,
      tdsMgL: 540,
      turbidityNtu: 22,
      lastUpdated: '2026-08-30',
      officialSource: 'Telangana State Pollution Control Board (TSPCB)',
      complianceStatus: 'Moderate Concern',
    },
    pollutionDetails: {
      severity: 'Moderate',
      primaryPollutants: ['Industrial catchment runoff', 'Algal blooms', 'Eutrophication'],
      summary:
        'Nutrient runoff creates periodic algal blooms. Community aerator monitoring and shoreline cleanup groups are actively operating.',
    },
    communityIds: ['comm-4'],
    reportCount: 19,
    activityCount: 9,
    observations: [],
    photos: [waterbodyLakeRestoredImg],
  },
  {
    id: 'wb-5',
    name: 'Chandlai Lake',
    localName: 'Chandlai Talab',
    type: 'pond',
    coordinates: [26.6853, 75.8752],
    location: {
      city: 'Jaipur',
      state: 'Rajasthan',
      basin: 'Dhund River Catchment',
    },
    description:
      'Vibrant rainfed wetland and avian sanctuary 30 km south of Jaipur. Vital rural-urban transitional groundwater recharge reservoir that buffers regional borewells against Thar heatwaves.',
    historicalContext:
      'Century-old earthern bund engineered by traditional water masters to capture seasonal flash runoff from surrounding Aravalli hillocks.',
    officialData: {
      dissolvedOxygenMgL: 6.2,
      ph: 7.8,
      bodMgL: 3.8,
      tdsMgL: 310,
      turbidityNtu: 9,
      lastUpdated: '2026-09-08',
      officialSource: 'Rajasthan State Pollution Control Board (RSPCB)',
      complianceStatus: 'Satisfactory',
    },
    pollutionDetails: {
      severity: 'Low',
      primaryPollutants: ['Invasive Prosopis juliflora weed encroachment', 'Localized siltation of inlet canals'],
      summary:
        'Water quality remains remarkably clear. The key community task is desilting tributary feeder channels before monsoon showers.',
    },
    communityIds: ['comm-5'],
    reportCount: 8,
    activityCount: 11,
    observations: [],
    photos: [waterbodyLakeRestoredImg, heroWaterCommunityImg],
  },
  {
    id: 'wb-6',
    name: 'Pashan Lake',
    localName: 'Pashan Talav',
    type: 'lake',
    coordinates: [18.5362, 73.7844],
    location: {
      city: 'Pune',
      state: 'Maharashtra',
      basin: 'Mula-Mutha Basin',
    },
    description:
      'Manmade water body built in the British era to provide water to Pashan and Khadki. Urbanization in the catchment has caused silt deposition and severe weed proliferation.',
    historicalContext:
      'Surrounded by basaltic hillocks; historically served as a critical nesting stop for migratory waterfowl and aquifer balancer.',
    officialData: {
      dissolvedOxygenMgL: 4.1,
      ph: 7.5,
      bodMgL: 7.9,
      tdsMgL: 460,
      turbidityNtu: 18,
      lastUpdated: '2026-09-14',
      officialSource: 'Maharashtra Pollution Control Board (MPCB)',
      complianceStatus: 'Moderate Concern',
    },
    pollutionDetails: {
      severity: 'Moderate',
      primaryPollutants: ['Domestic sewage inflows from Baner/Pashan', 'Siltation from construction sites'],
      summary:
        'High silt load reduces water storage depth. Citizen groups have created bund barriers and planted riparian vetiver grass to trap runoff silt.',
    },
    communityIds: ['comm-1'],
    reportCount: 16,
    activityCount: 14,
    observations: [],
    photos: [waterbodyLakeRestoredImg],
  },
];

export const INITIAL_AQUIFERS: Aquifer[] = [
  {
    id: 'aq-1',
    name: 'Deccan Traps Basaltic Aquifer System',
    hydrogeologyType: 'Basaltic (Deccan Traps)',
    region: 'Maharashtra, Western Madhya Pradesh & Northern Karnataka',
    coordinates: [19.7515, 75.7139],
    cgwbCategory: 'Semi-Critical',
    currentWaterTableBglMeters: 14.5,
    tenYearTrend: 'Declining',
    trendRateMetersPerYear: 0.35,
    rechargePotential: 'Moderate',
    soilInfiltrationRateMmHr: 12,
    safeRechargePractices: [
      'Shallow recharge pits (up to 3m depth) with graded sand-gravel filter beds',
      'Contour trenching on basalt hill slopes to slow runoff and encourage infiltration',
      'Desilting traditional farm ponds and check dams to expose weathered vesicular basalt zones',
    ],
    risksAndWarnings: [
      'DO NOT inject unfiltered urban surface runoff directly into deep borewells; fractures connect directly to drinking zones without soil filtration.',
      'Basalt has low specific yield (1% to 3%); water is stored in thin joint fractures and vesicular lava flows, depleting rapidly during summer heat.',
    ],
    officialSource: 'Central Ground Water Board (CGWB) Dynamic Ground Water Resources Assessment 2024',
    description:
      'Layered volcanic lava flows with weathered upper crust (murrum) and fractured columnar basalt. Water yield is highly localized along fracture joints. When rainfall falls on unpaved ground, weathered basalt absorbs water well, but concrete urban expansion leads to severe summer borewell dry-outs.',
  },
  {
    id: 'aq-2',
    name: 'Indo-Gangetic Deep Alluvial Aquifer',
    hydrogeologyType: 'Alluvial (Gangetic)',
    region: 'Punjab, Haryana, Delhi NCR, and Uttar Pradesh Plains',
    coordinates: [28.7041, 77.1025],
    cgwbCategory: 'Over-exploited',
    currentWaterTableBglMeters: 38.2,
    tenYearTrend: 'Rapidly Depleting',
    trendRateMetersPerYear: 0.85,
    rechargePotential: 'High',
    soilInfiltrationRateMmHr: 28,
    safeRechargePractices: [
      'Floodplain preservation and pond rejuvenation to store surplus monsoon peak flows',
      'Rooftop rainwater harvesting with sediment settling tanks and recharge shafts into sandy horizons',
      'Community permeable pavements along institutional campuses and neighborhood park perimeters',
    ],
    risksAndWarnings: [
      'Over-extraction exceeds natural recharge by up to 140% in agricultural and urban belts.',
      'Risk of deep saline groundwater up-coning if freshwater unconfined layers are depleted past 50m.',
    ],
    officialSource: 'CGWB National Compilation on Dynamic Ground Water Resources of India',
    description:
      'Immense multilayered sand, silt, and gravel sediment deposited by the Himalayan river system. Exceptionally high storage porosity, but centuries of intensive tube-well extraction without adequate infiltration have pushed the regional water table to historic lows.',
  },
  {
    id: 'aq-3',
    name: 'South Indian Crystalline Hard Rock Aquifer',
    hydrogeologyType: 'Hard Rock / Crystalline',
    region: 'Bengaluru Plateau, Mysore, Tamil Nadu Crystalline Belt',
    coordinates: [12.9716, 77.5946],
    cgwbCategory: 'Critical',
    currentWaterTableBglMeters: 52.0,
    tenYearTrend: 'Declining',
    trendRateMetersPerYear: 0.65,
    rechargePotential: 'Constrained by Impervious Surfaces',
    soilInfiltrationRateMmHr: 8,
    safeRechargePractices: [
      'Cascade tank desilting (re-establishing natural hydrological connectivity between lakes)',
      'Percolation wells placed in low-lying natural valleys with red loamy soil',
      'Swales and rain gardens along road reserves to intercept road runoff',
    ],
    risksAndWarnings: [
      'Extreme borewell depths (up to 1,000 feet) tapping ancient fossil fractures with elevated fluoride and nitrates.',
      'Urban impervious surfaces exceed 85% in city cores, preventing rainwater from reaching the saprolite weathered zone.',
    ],
    officialSource: 'CGWB Regional Office Bengaluru / WRIS Ground Water Atlas',
    description:
      'Composed of granite and gneiss basement rocks. Groundwater exists only in shallow weathered overburden (top 15-20 meters) and deeper shear fractures. Interconnected lakes historically recharged this entire plateau through gravity.',
  },
  {
    id: 'aq-4',
    name: 'Western Arid Sandstone & Quaternary Aquifer',
    hydrogeologyType: 'Coastal Sandstone',
    region: 'Jaipur, Jodhpur, Bikaner, and Shekhawati Belt (Rajasthan)',
    coordinates: [26.9124, 75.7873],
    cgwbCategory: 'Over-exploited',
    currentWaterTableBglMeters: 64.0,
    tenYearTrend: 'Declining',
    trendRateMetersPerYear: 0.9,
    rechargePotential: 'Low',
    soilInfiltrationRateMmHr: 45,
    safeRechargePractices: [
      'Revival of traditional Baolis (stepwells), Kunds, and Tankas for decentralized storage',
      'Catchment contour bunding to maximize retention of short episodic desert monsoon showers',
      'Channeling rooftop runoff into clean household storage tankas before groundwater recharge',
    ],
    risksAndWarnings: [
      'Low annual rainfall (300-500 mm) makes replenishment extremely slow.',
      'High potential evaporation (exceeding 2,000 mm/year) means open water loses rapidly to heat without shaded stepwell designs.',
    ],
    officialSource: 'Ground Water Department Rajasthan / CGWB Western Region',
    description:
      'Thick aeolian sand dunes overlying hard sandstone. Sandy soils have high permeability, but low seasonal rainfall requires specialized indigenous water architectures to prevent evaporation before infiltration.',
  },
];

export const INITIAL_HEAT_ZONES: HeatZone[] = [
  {
    id: 'hz-1',
    city: 'Nagpur & Vidarbha Corridor',
    areaName: 'Central Commercial & Industrial Belt',
    coordinates: [21.1458, 79.0882],
    currentTempC: 43.6,
    feelsLikeC: 46.2,
    wetBulbTempC: 28.5,
    relativeHumidityPercent: 24,
    riskLevel: 'Severe Heatwave',
    imdAlert: 'Orange',
    urbanCanopyPercent: 11,
    imperviousSurfacePercent: 82,
    waterStressMultiplier: '2.5x Critical Surge',
    peakHours: '11:30 AM – 4:30 PM',
    communityCoolingTips: [
      'Erect shaded khus (vetiver grass) mats wetted with recycled greywater outside public shops',
      'Setup community earthen pot (matka) drinking water stations along public walkways',
      'Avoid unshaded field work during peak thermal hours; stay hydrated with salted lemon water or buttermilk',
      'Keep rooftops painted with solar-reflective white lime wash to reduce indoor radiant heat by 4-6°C',
    ],
    nearbyCoolingCentres: [
      { name: 'Dharampeth Community Library Hall', distance: '0.8 km' },
      { name: 'Sitabuldi Shaded Transit Shelter', distance: '1.4 km' },
    ],
    officialSource: 'India Meteorological Department (IMD) Heat Action Bulletin / NDMA',
  },
  {
    id: 'hz-2',
    city: 'Delhi NCR',
    areaName: 'Old Delhi & Trans-Yamuna Dense Corridors',
    coordinates: [28.6505, 77.2303],
    currentTempC: 41.8,
    feelsLikeC: 47.5,
    wetBulbTempC: 30.2,
    relativeHumidityPercent: 44,
    riskLevel: 'Severe Heatwave',
    imdAlert: 'Orange',
    urbanCanopyPercent: 7,
    imperviousSurfacePercent: 91,
    waterStressMultiplier: '2.5x Critical Surge',
    peakHours: '12:00 PM – 5:00 PM',
    communityCoolingTips: [
      'High humidity paired with high temperature raises wet-bulb temperature near physiological stress limits',
      'Prioritize elderly and outdoor gig workers with shaded hydration hubs',
      'Plant native shade trees (Neem, Peepal, Jamun) along western-facing street corridors to block afternoon radiant solar load',
      'Mist sprayers powered by rooftop rainwater harvesting in market squares',
    ],
    nearbyCoolingCentres: [
      { name: 'Chandni Chowk Municipal Cooling Pavilion', distance: '0.5 km' },
      { name: 'Red Fort Metro Underground Air-Cooled Foyer', distance: '0.9 km' },
    ],
    officialSource: 'Delhi Disaster Management Authority (DDMA) / IMD',
  },
  {
    id: 'hz-3',
    city: 'Bengaluru',
    areaName: 'Whitefield & Outer Ring Road Tech Corridor',
    coordinates: [12.9856, 77.7315],
    currentTempC: 36.4,
    feelsLikeC: 38.0,
    wetBulbTempC: 25.1,
    relativeHumidityPercent: 36,
    riskLevel: 'Moderate',
    imdAlert: 'Yellow',
    urbanCanopyPercent: 14,
    imperviousSurfacePercent: 79,
    waterStressMultiplier: '1.8x Heavy Stress',
    peakHours: '12:30 PM – 3:30 PM',
    communityCoolingTips: [
      'Rapid concretization has created micro-urban heat pockets 3.5°C warmer than nearby Lalbagh/Cubbon parklands',
      'Preserve and expand roadside bioswales and tree cover to curb asphalt heat release into evening hours',
      'Residential apartment complexes should stagger private water tanker delivery to avoid peak neighborhood groundwater stress',
    ],
    nearbyCoolingCentres: [
      { name: 'Kadugodi Community Health Centre', distance: '1.2 km' },
      { name: 'Kundalahalli Shaded Park Kiosk', distance: '2.0 km' },
    ],
    officialSource: 'Karnataka State Disaster Management Authority / IMD Bengaluru',
  },
  {
    id: 'hz-4',
    city: 'Ahmedabad',
    areaName: 'Vatva & Naroda Industrial Cluster',
    coordinates: [22.9868, 72.6377],
    currentTempC: 42.5,
    feelsLikeC: 44.8,
    wetBulbTempC: 27.8,
    relativeHumidityPercent: 28,
    riskLevel: 'High',
    imdAlert: 'Orange',
    urbanCanopyPercent: 8,
    imperviousSurfacePercent: 88,
    waterStressMultiplier: '1.8x Heavy Stress',
    peakHours: '11:00 AM – 4:30 PM',
    communityCoolingTips: [
      'Pioneer of South Asia’s first Heat Action Plan (HAP)',
      'Community cool-roof coatings applied by neighborhood youth groups keep slum dwellings significantly cooler',
      'Drinking water kiosks (parabs) maintained by citizen trusts at transport intersections',
    ],
    nearbyCoolingCentres: [
      { name: 'Vatva Urban Health Centre Shaded Wing', distance: '0.6 km' },
      { name: 'Kankaria Public Cooling Station', distance: '2.5 km' },
    ],
    officialSource: 'Ahmedabad Municipal Corporation Heat Action Plan / IMD',
  },
];

export const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'comm-1',
    name: 'Jal-Sangam Maharashtra',
    tagline: 'Grassroots water warriors & stepwell revival collective',
    description:
      'A coalition of citizen ecologists, college volunteers, and neighborhood associations in Nashik, Pune, and Ahmednagar restoring traditional stepwells, monitoring river pollution outfalls, and constructing decentralized rainwater percolation pits.',
    focusAreas: ['water-body', 'groundwater', 'rainwater-harvesting', 'pollution-cleanup'],
    location: {
      city: 'Pune',
      state: 'Maharashtra',
      coordinates: [18.5204, 73.8567],
    },
    waterBodyId: 'wb-1',
    adminIds: ['user-1'],
    members: [
      {
        userId: 'user-1',
        name: 'Maya Sharma',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        role: 'admin',
        joinedAt: '2025-04-12',
      },
      {
        userId: 'user-2',
        name: 'Arjun Nambiar',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'volunteer',
        joinedAt: '2025-07-01',
      },
    ],
    impact: {
      membersCount: 420,
      activitiesCompleted: 28,
      volunteersMobilized: 1150,
      waterBodiesMonitored: 5,
      reportsSubmitted: 64,
      rechargeStructuresMapped: 42,
      wasteRemovedKg: 6800,
      treesPlantedForShade: 850,
      isVerifiedData: true,
    },
    photos: [heroWaterCommunityImg, waterbodyLakeRestoredImg],
    announcements: [
      {
        id: 'ann-1',
        title: 'Upcoming Pre-Monsoon Percolation Pit Audit',
        content: 'Join our team this Saturday as we inspect 15 neighborhood recharge pits in Kothrud to remove silt before rains.',
        date: '2026-09-26',
      },
    ],
    posts: [
      {
        id: 'post-1',
        communityId: 'comm-1',
        userId: 'user-1',
        userName: 'Maya Sharma',
        userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        content:
          'Great milestone! The desilted stepwell at Trimbakeshwar has retained 1.8 meters of clean spring water through the peak summer heat. Neighboring open wells report a 1.2m rise in water table!',
        photoUrl: heroWaterCommunityImg,
        timestamp: '2026-09-24T10:30:00Z',
        likesCount: 38,
        comments: [
          {
            id: 'c-1',
            userId: 'user-2',
            userName: 'Arjun Nambiar',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            text: 'Incredible work team. Documenting this impact helps convince neighboring municipal wards to do the same!',
            timestamp: '2026-09-24T12:15:00Z',
          },
        ],
      },
    ],
    createdAt: '2025-04-12',
  },
  {
    id: 'comm-2',
    name: 'Bengaluru Lake Guardians',
    tagline: 'Protecting lake cascades & reviving urban recharge',
    description:
      'Citizen group committed to restoring East Bengaluru lake cascades. We organize weekly water quality sampling, foam barrier checks, and floating wetland maintenance.',
    focusAreas: ['water-body', 'pollution-cleanup', 'groundwater'],
    location: {
      city: 'Bengaluru',
      state: 'Karnataka',
      coordinates: [12.9716, 77.5946],
    },
    waterBodyId: 'wb-2',
    adminIds: ['user-2'],
    members: [
      {
        userId: 'user-2',
        name: 'Arjun Nambiar',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'admin',
        joinedAt: '2025-06-20',
      },
    ],
    impact: {
      membersCount: 380,
      activitiesCompleted: 22,
      volunteersMobilized: 890,
      waterBodiesMonitored: 4,
      reportsSubmitted: 88,
      rechargeStructuresMapped: 28,
      wasteRemovedKg: 5200,
      isVerifiedData: true,
    },
    photos: [waterbodyLakeRestoredImg],
    announcements: [
      {
        id: 'ann-2',
        title: 'Water Hyacinth Removal Drive at Bellandur Inlet',
        content: 'Protective gloves and rakes provided. Let us clear the blockage before the weekend runoff.',
        date: '2026-09-28',
      },
    ],
    posts: [
      {
        id: 'post-2',
        communityId: 'comm-2',
        userId: 'user-2',
        userName: 'Arjun Nambiar',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content:
          'Citizen observation test today: Dissolved oxygen near the floating bio-islands reached 3.8 mg/L compared to 1.8 mg/L in untreated open stagnant areas. Nature-based filtration works!',
        photoUrl: waterbodyLakeRestoredImg,
        timestamp: '2026-09-25T08:00:00Z',
        likesCount: 42,
        comments: [],
      },
    ],
    createdAt: '2025-06-20',
  },
  {
    id: 'comm-3',
    name: 'Yamuna Floodplain Stewards',
    tagline: 'Defending Delhi’s riverbed sponge and heat shelters',
    description:
      'Youth-led environmental defense and community action network. We map plastic debris outflows, document illegal construction debris dumping, and organize community shade kiosks during heatwaves.',
    focusAreas: ['water-body', 'heat-resilience', 'pollution-cleanup', 'groundwater'],
    location: {
      city: 'Delhi NCR',
      state: 'Delhi',
      coordinates: [28.6139, 77.209],
    },
    waterBodyId: 'wb-3',
    adminIds: ['user-3'],
    members: [
      {
        userId: 'user-3',
        name: 'Priya Verma',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'admin',
        joinedAt: '2025-03-05',
      },
    ],
    impact: {
      membersCount: 650,
      activitiesCompleted: 35,
      volunteersMobilized: 1840,
      waterBodiesMonitored: 3,
      reportsSubmitted: 142,
      rechargeStructuresMapped: 55,
      wasteRemovedKg: 12400,
      treesPlantedForShade: 1400,
      isVerifiedData: true,
    },
    photos: [heroWaterCommunityImg, heatUrbanResilienceImg],
    announcements: [
      {
        id: 'ann-3',
        title: 'Yamuna Ghat Cleanup & Heatwave Hydration Camp',
        content: 'Free drinking water kiosks deployed for construction workers and daily wage laborers alongside morning cleanup.',
        date: '2026-09-29',
      },
    ],
    posts: [
      {
        id: 'post-3',
        communityId: 'comm-3',
        userId: 'user-3',
        userName: 'Priya Verma',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content:
          'Extreme heat causes water demand to skyrocket while groundwater pumping accelerates. We must defend the river floodplain so monsoon rain can replenish our deep aquifers rather than rushing away as flash flood runoff!',
        photoUrl: heatUrbanResilienceImg,
        timestamp: '2026-09-23T14:40:00Z',
        likesCount: 56,
        comments: [],
      },
    ],
    createdAt: '2025-03-05',
  },
  {
    id: 'comm-4',
    name: 'Hyderabad Tank Responders',
    tagline: 'Restoring Qutb Shahi water heritage & aquifer health',
    description:
      'Community coalition of environmental volunteers and heritage architects restoring Hussain Sagar catchment wetlands and maintaining historical stepwells in Golconda and Bansilalpet.',
    focusAreas: ['water-body', 'groundwater', 'rainwater-harvesting'],
    location: {
      city: 'Hyderabad',
      state: 'Telangana',
      coordinates: [17.385, 78.4867],
    },
    waterBodyId: 'wb-4',
    adminIds: ['user-1'],
    members: [],
    impact: {
      membersCount: 290,
      activitiesCompleted: 15,
      volunteersMobilized: 680,
      waterBodiesMonitored: 3,
      reportsSubmitted: 45,
      rechargeStructuresMapped: 32,
      wasteRemovedKg: 3400,
      isVerifiedData: true,
    },
    photos: [waterbodyLakeRestoredImg],
    announcements: [],
    posts: [],
    createdAt: '2025-08-14',
  },
  {
    id: 'comm-5',
    name: 'Jaipur Desert Oasis Collective',
    tagline: 'Traditional rain harvesting & arid heat mitigation',
    description:
      'Mobilizing youth and traditional water masters across Jaipur to maintain desert stepwells (baolis), clean rooftop tankas, and plant drought-tolerant native canopies.',
    focusAreas: ['rainwater-harvesting', 'heat-resilience', 'groundwater'],
    location: {
      city: 'Jaipur',
      state: 'Rajasthan',
      coordinates: [26.9124, 75.7873],
    },
    waterBodyId: 'wb-5',
    adminIds: ['user-3'],
    members: [],
    impact: {
      membersCount: 310,
      activitiesCompleted: 18,
      volunteersMobilized: 750,
      waterBodiesMonitored: 2,
      reportsSubmitted: 38,
      rechargeStructuresMapped: 48,
      treesPlantedForShade: 600,
      isVerifiedData: true,
    },
    photos: [heroWaterCommunityImg],
    announcements: [],
    posts: [],
    createdAt: '2025-09-01',
  },
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    communityId: 'comm-1',
    communityName: 'Jal-Sangam Maharashtra',
    title: 'Godavari Riverbank Cleanup & Riparian Planting',
    description:
      'Join our collective along the Ramkund ghat stretch to clear entangled plastic waste and plant deep-rooting vetiver grass that stabilizes soil and phytoremediates urban greywater runoff.',
    category: 'cleanup',
    location: {
      name: 'Ramkund Ghat, Godavari Riverbank',
      address: 'Panchavati, Nashik, Maharashtra 422003',
      coordinates: [19.9975, 73.7898],
    },
    date: '2026-10-04',
    time: '07:30 AM – 10:30 AM IST',
    organizer: {
      id: 'user-1',
      name: 'Maya Sharma',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    volunteerLimit: 40,
    participants: [
      {
        userId: 'user-1',
        name: 'Maya Sharma',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        joinedAt: '2026-09-20',
      },
      {
        userId: 'user-2',
        name: 'Arjun Nambiar',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        joinedAt: '2026-09-22',
      },
    ],
    status: 'upcoming',
    waterBodyId: 'wb-1',
    photos: [waterbodyLakeRestoredImg],
    createdAt: '2026-09-20',
  },
  {
    id: 'act-2',
    communityId: 'comm-3',
    communityName: 'Yamuna Floodplain Stewards',
    title: 'Heatwave Hydration & Floodplain Sponge Walk',
    description:
      'Community walk educating residents on why unpaved river easements absorb summer thermal heat and recharge deep aquifers, while setting up two shaded clay pot drinking water kiosks for daily wage laborers.',
    category: 'heat-shelter',
    location: {
      name: 'Yamuna Bio-Diversity Park Gate 2',
      address: 'Jagatpur, Wazirabad, Delhi 110084',
      coordinates: [28.723, 77.218],
    },
    date: '2026-10-06',
    time: '09:00 AM – 12:00 PM IST',
    organizer: {
      id: 'user-3',
      name: 'Priya Verma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    volunteerLimit: 25,
    participants: [
      {
        userId: 'user-3',
        name: 'Priya Verma',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        joinedAt: '2026-09-21',
      },
    ],
    status: 'upcoming',
    waterBodyId: 'wb-3',
    photos: [heatUrbanResilienceImg],
    createdAt: '2026-09-21',
  },
  {
    id: 'act-3',
    communityId: 'comm-2',
    communityName: 'Bengaluru Lake Guardians',
    title: 'Bellandur Inlet Silt Trap & Wetland Audit',
    description:
      'Citizen water monitoring workshop. We will test dissolved oxygen, TDS, and turbidity before and after the constructed bio-swale inlet to verify wetland performance.',
    category: 'documentation',
    location: {
      name: 'Bellandur Lake Southern Weir',
      address: 'Yemalur Main Road, Bengaluru, Karnataka 560037',
      coordinates: [12.9366, 77.6713],
    },
    date: '2026-10-11',
    time: '08:00 AM – 11:00 AM IST',
    organizer: {
      id: 'user-2',
      name: 'Arjun Nambiar',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    volunteerLimit: 30,
    participants: [
      {
        userId: 'user-2',
        name: 'Arjun Nambiar',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        joinedAt: '2026-09-22',
      },
    ],
    status: 'upcoming',
    waterBodyId: 'wb-2',
    photos: [waterbodyLakeRestoredImg],
    createdAt: '2026-09-22',
  },
  {
    id: 'act-4',
    communityId: 'comm-1',
    communityName: 'Jal-Sangam Maharashtra',
    title: 'Historic Baoli Stepwell Desilting & Revival',
    description:
      'Mobilized 80 community volunteers to clear 60 years of accumulated plastic and urban debris from a 17th-century stepped tank in Kothrud, reconnecting it to natural hillside recharge channels.',
    category: 'rwh-maintenance',
    location: {
      name: 'Panchaleshwar Stepwell Complex',
      address: 'Kothrud, Pune, Maharashtra 411038',
      coordinates: [18.5074, 73.8077],
    },
    date: '2026-09-12',
    time: '07:00 AM – 01:00 PM IST',
    organizer: {
      id: 'user-1',
      name: 'Maya Sharma',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    volunteerLimit: 80,
    participants: [
      {
        userId: 'user-1',
        name: 'Maya Sharma',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        joinedAt: '2026-09-01',
      },
      {
        userId: 'user-2',
        name: 'Arjun Nambiar',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        joinedAt: '2026-09-02',
      },
    ],
    status: 'completed',
    waterBodyId: 'wb-6',
    photos: [heroWaterCommunityImg, waterbodyLakeRestoredImg],
    beforeAfter: {
      beforePhoto: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&auto=format&fit=crop&q=80',
      afterPhoto: heroWaterCommunityImg,
      description:
        'Before: Choked with solid waste, stagnant slime, and broken culverts. After: 4,200 kg debris removed, stone floor revealed, 1.8m natural spring water restored, creating a cool microclimate oasis.',
      impactSummary: '4,200 kg debris removed · 80 volunteers · Recharged 6 local borewells',
    },
    createdAt: '2026-09-01',
  },
];

export const INITIAL_REPORTS: EnvironmentalReport[] = [
  {
    id: 'rep-1',
    userId: 'user-1',
    userName: 'Maya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Untreated Commercial Greywater Inflow into Godavari Riverbank',
    category: 'sewage-inflow',
    description:
      'Observed a newly breached drainage pipe discharging dark grey effluent directly into the riverbed near Panchavati bridge, accompanied by high sulfur odor.',
    location: {
      name: 'Panchavati Riverbank Outfall',
      city: 'Nashik',
      state: 'Maharashtra',
      coordinates: [19.9982, 73.7915],
    },
    waterBodyId: 'wb-1',
    waterBodyName: 'Godavari River (Nashik Stretch)',
    photoUrl: waterbodyLakeRestoredImg,
    status: 'VERIFIED',
    statusNote: 'Ground team confirmed active discharge. Reported to local ward environmental officer for interceptor diversion.',
    submittedAt: '2026-09-19T09:40:00Z',
    isCitizenReport: true,
  },
  {
    id: 'rep-2',
    userId: 'user-2',
    userName: 'Arjun Nambiar',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Surfactant Foaming Accumulation at Bellandur Lake Outlet',
    category: 'foaming',
    description:
      'Following afternoon thunderstorm, high surfactant foam reached 1.5 meters height near the eastern spillway. Wind blowing foam across commuter roadway.',
    location: {
      name: 'Bellandur Eastern Spillway',
      city: 'Bengaluru',
      state: 'Karnataka',
      coordinates: [12.9378, 77.6745],
    },
    waterBodyId: 'wb-2',
    waterBodyName: 'Bellandur Lake',
    photoUrl: waterbodyLakeRestoredImg,
    status: 'UNDER_REVIEW',
    statusNote: 'Field volunteers inspecting sprinkler suppression system.',
    submittedAt: '2026-09-24T16:10:00Z',
    isCitizenReport: true,
  },
  {
    id: 'rep-3',
    userId: 'user-3',
    userName: 'Priya Verma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Illegal Construction Silt Dumping along Yamuna Floodplain Easement',
    category: 'garbage-dumping',
    description:
      'Trucks dumping dense construction and demolition debris on permeable floodplain sands near Mayur Vihar, paving over critical natural aquifer recharge surface.',
    location: {
      name: 'Mayur Vihar Floodplain Buffer',
      city: 'Delhi NCR',
      state: 'Delhi',
      coordinates: [28.601, 77.295],
    },
    waterBodyId: 'wb-3',
    waterBodyName: 'Yamuna River (Delhi Okhla Stretch)',
    photoUrl: heatUrbanResilienceImg,
    status: 'SUBMITTED',
    statusNote: 'Citizen observation pending community site check.',
    submittedAt: '2026-09-27T11:20:00Z',
    isCitizenReport: true,
  },
  {
    id: 'rep-4',
    userId: 'user-1',
    userName: 'Maya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Silt Blockage in Neighborhood Rainwater Percolation Pit',
    category: 'damaged-recharge-structure',
    description:
      'Heavy silt washed from unpaved road shoulder has sealed the gravel filter bed of the community recharge pit in Kothrud, preventing stormwater infiltration.',
    location: {
      name: 'Kothrud Ward 24 Park Percolation Pit',
      city: 'Pune',
      state: 'Maharashtra',
      coordinates: [18.5085, 73.811],
    },
    waterBodyId: 'wb-6',
    waterBodyName: 'Pashan Lake',
    photoUrl: diagramAquiferRechargeImg,
    status: 'RESOLVED',
    statusNote: 'Community collective cleared top 30cm silt layer and replaced coarse gravel on Sept 25.',
    submittedAt: '2026-09-21T14:00:00Z',
    isCitizenReport: true,
  },
];

export const INITIAL_EDUCATION_TOPICS: EducationTopic[] = [
  {
    id: 'edu-water-pollution',
    title: 'Water Pollution in Indian Water Bodies',
    category: 'water-pollution',
    subtitle: 'From Nullahs to Rivers: Understanding Pollutants & Community Action',
    summary:
      'Learn how municipal sewage, single-use plastics, industrial trace effluents, and agricultural runoff degrade lakes and rivers, and how citizen monitoring drives accountability.',
    iconName: 'Droplets',
    readTime: '4 min read',
    relatedMapLayer: 'surface-water',
    suggestedAction: {
      label: 'Explore Surface Water Bodies',
      actionType: 'open-map',
      filterValue: 'surface-water',
    },
    stages: [
      {
        step: 'WHAT_IS_IT',
        heading: 'What is Water Pollution?',
        content:
          'Water pollution occurs when harmful chemical, biological, or physical substances enter freshwater systems at rates exceeding the natural assimilative capacity of the water body. In India, over 70% of urban surface water is impacted by untreated domestic wastewater and plastic waste.',
        keyPoints: [
          'Point-source pollution: Outfall pipes, open drains (nullahs), and industrial spillways.',
          'Non-point source pollution: Agricultural chemical runoff and street litter washed away during early monsoon downpours.',
        ],
      },
      {
        step: 'WHY_DOES_IT_MATTER',
        heading: 'Why Does It Matter for Communities?',
        content:
          'Polluted surface water doesn’t stay isolated. Contaminants seep into shallow unconfined aquifers, contaminate borewell drinking water, destroy aquatic ecosystems, and create breeding grounds for disease vectors. During summer heatwaves, stagnant polluted water evaporates faster and concentrates toxic pollutants.',
        keyPoints: [
          'Loss of safe local water forces reliance on costly private groundwater tankers.',
          'Eutrophication triggers toxic cyanobacterial blooms, killing local fish and waterfowl.',
        ],
      },
      {
        step: 'HOW_DOES_IT_WORK',
        heading: 'How Pollutants Behave in Water',
        content:
          'When organic sewage enters a lake, decomposing microbes consume Dissolved Oxygen (DO). If DO drops below 4 mg/L, aquatic life suffocates. Meanwhile, laundry detergents containing phosphates cause water hyacinth and algal overgrowth, blocking sunlight and suffocating benthic life.',
        keyPoints: [
          'Biochemical Oxygen Demand (BOD): Measures organic pollution strength (>3 mg/L indicates pollution).',
          'Dissolved Oxygen (DO): Vital for fish and aquatic balance (>5 mg/L is healthy).',
        ],
      },
      {
        step: 'WHAT_IS_HAPPENING_LOCALLY',
        heading: 'What is Happening in Indian Cities?',
        content:
          'In cities like Bengaluru (Bellandur, Varthur), Delhi (Yamuna), and Hyderabad (Hussain Sagar), storm drainage networks have historically been misused to carry untreated sewage. Citizen science groups are deploying simple test kits to document pollution hotspots and push for decentralized treatment wetlands.',
        keyPoints: [
          'Seasonal foaming events occur at weir spillways when turbulent water churns detergent surfactants.',
          'Microplastics and synthetic fibers accumulate in riverbank sediment, entering freshwater food chains.',
        ],
      },
      {
        step: 'WHAT_CAN_PEOPLE_DO',
        heading: 'Practical Community Interventions',
        content:
          'Citizens do not need to wait for multi-crore infrastructure projects. Community groups can document outfalls, build floating reed bio-islands (using native vetiver and canna indica), organize regular trash trap desilting, and prevent garbage dumping along riparian easements.',
        keyPoints: [
          'Map and report unmapped drainage outfalls using the Jal-Dharani reporting tool.',
          'Construct floating treatment wetlands (FTWs) to absorb excess nitrogen and phosphorus naturally.',
          'Organize neighborhood awareness campaigns to switch to phosphate-free cleaning agents.',
        ],
      },
    ],
    quiz: [
      {
        question: 'What happens to Dissolved Oxygen (DO) when untreated sewage enters a water body?',
        options: [
          'DO increases because sewage feeds aquatic plants',
          'DO decreases because decomposing bacteria consume oxygen',
          'DO remains completely unchanged',
          'DO turns into pure carbon dioxide immediately',
        ],
        correctIndex: 1,
        explanation: 'Decomposing bacteria multiply rapidly to break down organic waste, consuming dissolved oxygen and suffocating fish.',
      },
      {
        question: 'Which simple community bio-solution helps absorb excess nitrates and phosphates from urban lakes?',
        options: [
          'Pouring chemical bleach into the water',
          'Installing floating treatment wetlands with native plants like Vetiver',
          'Dredging all natural shoreline vegetation with heavy machinery',
          'Covering the lake surface with plastic tarpaulins',
        ],
        correctIndex: 1,
        explanation: 'Floating treatment wetlands utilize native riparian plants whose roots absorb excess nutrients directly from the water column.',
      },
    ],
  },
  {
    id: 'edu-surface-water',
    title: 'Surface Water Systems & Connected Cascades',
    category: 'surface-water',
    subtitle: 'Rivers, Lakes, Stepwells, and Traditional Tank Networks',
    summary:
      'Explore how natural rivers and ancient cascading tank systems (Eris and Keres) naturally buffer droughts, store monsoon surplus, and feed regional aquifers.',
    iconName: 'Waves',
    readTime: '4 min read',
    relatedMapLayer: 'surface-water',
    suggestedAction: {
      label: 'View Surface Water Map',
      actionType: 'open-map',
      filterValue: 'surface-water',
    },
    stages: [
      {
        step: 'WHAT_IS_IT',
        heading: 'What is Surface Water?',
        content:
          'Surface water includes all freshwater open to the atmosphere: perennial and seasonal rivers, canals, natural wetlands, village ponds (talabs), and manmade cascading reservoir systems.',
        keyPoints: [
          'River Basins: Natural topographic catchments guiding gravity flow to the sea.',
          'Cascade Lakes: Interconnected tank chains where overflow from an upper lake feeds the next lake downstream.',
        ],
      },
      {
        step: 'WHY_DOES_IT_MATTER',
        heading: 'Why Does Surface Water Matter?',
        content:
          'Surface water bodies are the primary visible recharge mechanism for groundwater. When a lake holds clean water, hydrostatic pressure continuously pushes water downward through porous soil layers, replenishing the surrounding groundwater table for kilometers around.',
        keyPoints: [
          'Urban lakes regulate local microclimates, lowering surrounding ambient temperatures by 2°C to 4°C.',
          'Wetlands act as natural flood sponges, attenuating peak monsoon runoff and preventing neighborhood inundation.',
        ],
      },
      {
        step: 'HOW_DOES_IT_WORK',
        heading: 'The Ancient Cascade Network',
        content:
          'Traditional Indian hydrology—from the Keres of Karnataka to the Eris of Tamil Nadu and the Johads of Rajasthan—never treated water bodies as isolated ponds. They were engineered as interconnected cascades. When one tank filled, excess water gently flowed through stone sluices to the lower tank.',
        keyPoints: [
          'Breaching or encroaching one connecting feeder canal (rajakaluve) disrupts the entire basin.',
          'Silt buildup over time reduces storage volume and seals the permeable bed.',
        ],
      },
      {
        step: 'WHAT_IS_HAPPENING_LOCALLY',
        heading: 'What is Happening Today?',
        content:
          'Rapid real estate expansion has paved over natural feeder canals and concrete storm drains have replaced grassy swales. Consequently, monsoon downpours turn into flash floods instead of recharging lakes, followed by severe drought weeks later.',
        keyPoints: [
          'Over 60% of historic urban water bodies across Indian metro cities have been encroached or dried up in 4 decades.',
          'Encroachment of lake buffer zones removes natural reed filters that clean incoming runoff.',
        ],
      },
      {
        step: 'WHAT_CAN_PEOPLE_DO',
        heading: 'Community Stewardship Actions',
        content:
          'Communities can map historic lake boundaries, safeguard remaining inlet feeder channels, organize pre-monsoon weed removal, and plant native shade trees along embankments.',
        keyPoints: [
          'Adopt a local water body through Jal-Dharani community stewardship.',
          'Conduct seasonal inlet surveys before the onset of monsoon rains.',
          'Advocate for preserving natural buffer easements without concrete paving.',
        ],
      },
    ],
    quiz: [
      {
        question: 'What is the primary ecological danger of encroaching on natural feeder canals (Rajakaluves) between lakes?',
        options: [
          'Water becomes too cold for fish',
          'The cascade connection breaks, causing upstream flooding and downstream dry-outs',
          'The water table rises dangerously high across the city',
          'It causes earthquakes in the granite bedrock',
        ],
        correctIndex: 1,
        explanation: 'Encroaching connecting canals breaks the gravity cascade: water cannot flow downward safely, causing localized flash flooding and starving downstream water bodies.',
      },
    ],
  },
  {
    id: 'edu-groundwater-aquifers',
    title: 'Groundwater & Aquifers: The Hidden Lifeline',
    category: 'groundwater-aquifers',
    subtitle: 'Understanding Aquifer Layers, Stress & Depletion across India',
    summary:
      'Demystify what an aquifer is, how water moves beneath the surface, why borewells dry up, and how geological formations dictate recharge behavior.',
    iconName: 'Layers',
    readTime: '5 min read',
    relatedMapLayer: 'aquifer',
    suggestedAction: {
      label: 'Explore Aquifer Map Layer',
      actionType: 'open-map',
      filterValue: 'aquifer',
    },
    stages: [
      {
        step: 'WHAT_IS_IT',
        heading: 'What is an Aquifer?',
        content:
          'An aquifer is not an underground river or cavern of open water. It is an underground geological layer of permeable rock, gravel, sand, or fractured basalt saturated with water. Groundwater fills the microscopic pores and fracture cracks inside rocks.',
        keyPoints: [
          'Unconfined Aquifer: Shallow water table layer open to surface infiltration.',
          'Confined Aquifer: Deep water-bearing layer trapped beneath impermeable clay or solid bedrock.',
        ],
      },
      {
        step: 'WHY_DOES_IT_MATTER',
        heading: 'Why Does Groundwater Matter?',
        content:
          'Groundwater supplies over 85% of rural domestic drinking water and 60% of irrigation across India. During hot, rainless summer months, surface ponds dry up, leaving aquifers as the sole survival buffer for hundreds of millions of people.',
        keyPoints: [
          'When groundwater is over-extracted faster than rainfall replenishes it, the water table falls relentlessly.',
          'Deep extraction can trigger toxic heavy metal contamination (Fluoride, Arsenic, Salinity) as ancient minerals dissolve.',
        ],
      },
      {
        step: 'HOW_DOES_IT_WORK',
        heading: 'Geological Variations Across India',
        content:
          'Aquifer behavior depends entirely on local geology. The Gangetic plains feature thick sand beds with high storage capacity. In contrast, 65% of peninsular India (Maharashtra, Karnataka, Telangana) consists of Hard Rock and Deccan Basalt where water is stored only in thin fracture fissures with very low specific yield.',
        keyPoints: [
          'Hard Rock Basalt: Yields water quickly, but depletes within weeks if over-pumped.',
          'Alluvial Plains: Huge storage, but deep tube wells have caused widespread regional deficits.',
        ],
      },
      {
        step: 'WHAT_IS_HAPPENING_LOCALLY',
        heading: 'The Groundwater Crisis',
        content:
          'According to the Central Ground Water Board (CGWB), thousands of administrative blocks across Punjab, Rajasthan, Haryana, Delhi, and Tamil Nadu are classified as "Over-exploited" or "Critical". Borewells are regularly drilled beyond 800 to 1,200 feet into fossil water that took thousands of years to accumulate.',
        keyPoints: [
          'Subsidized electrical pumping incentivizes round-the-clock extraction without recharge obligation.',
          'Urban concrete prevents monsoon showers from penetrating down to the water table.',
        ],
      },
      {
        step: 'WHAT_CAN_PEOPLE_DO',
        heading: 'What Communities Can Do',
        content:
          'Understand your local aquifer type before intervening. Build shallow percolation pits and recharge trenches that target unconfined weathered layers. Never pump untreated surface drainage into deep borewells.',
        keyPoints: [
          'Check CGWB aquifer classifications for your district on the Jal-Dharani Map.',
          'Promote decentralized neighborhood recharge wells instead of competing to drill deeper borewells.',
          'Transition to low-water indigenous crops and household aerated faucets.',
        ],
      },
    ],
    quiz: [
      {
        question: 'Is groundwater an underground flowing river like on the surface?',
        options: [
          'Yes, it flows in massive hollow caverns beneath all cities',
          'No, it is stored in the pores of soil, sand, and tiny fractures in bedrock',
          'No, groundwater only exists inside artificial concrete pipes',
          'Yes, it originates exclusively from melting Himalayan glaciers',
        ],
        correctIndex: 1,
        explanation: 'Groundwater occupies the pore spaces between sand grains, gravel, and within cracks and fractures of solid bedrock.',
      },
      {
        question: 'Why is injecting raw, unfiltered street runoff directly into a deep borewell dangerous?',
        options: [
          'It makes the borewell motor spin backwards',
          'It directly contaminates the deep drinking aquifer without natural soil filtration',
          'It causes instant lightning strikes',
          'Borewells can only take saltwater',
        ],
        correctIndex: 1,
        explanation: 'Directly injecting unfiltered runoff bypasses natural soil and sand filtration, introducing pathogens, oils, and toxic heavy metals directly into the drinking water table.',
      },
    ],
  },
  {
    id: 'edu-rainwater-recharge',
    title: 'Rainwater Harvesting & Recharge Systems',
    category: 'rainwater-recharge',
    subtitle: 'From Rain to Aquifer: Infiltration, Recharge Pits & Geology Rules',
    summary:
      'Learn the vital difference between runoff and recharge. Discover how to build safe, effective community recharge pits without risking structural damage or groundwater pollution.',
    iconName: 'CloudRain',
    readTime: '5 min read',
    relatedMapLayer: 'aquifer',
    suggestedAction: {
      label: 'Inspect Aquifer Recharge Zones',
      actionType: 'open-map',
      filterValue: 'aquifer',
    },
    stages: [
      {
        step: 'WHAT_IS_IT',
        heading: 'Rainfall Does NOT Automatically Equal Recharge',
        content:
          'A common misconception is that heavy rain automatically replenishes groundwater. In reality, most rainfall on paved urban surfaces immediately turns into high-velocity surface runoff, rushing into drains and evaporating or causing urban flooding.',
        keyPoints: [
          'Runoff: Water that flows across the land surface without infiltrating.',
          'Infiltration: The downward movement of water into the soil and rock strata.',
          'Recharge: The volume of infiltrated water that successfully reaches the groundwater table.',
        ],
      },
      {
        step: 'WHY_DOES_IT_MATTER',
        heading: 'Why Local Infiltration Matters',
        content:
          'Capturing rainwater where it falls is the single most cost-effective way to drought-proof a community. An average 100 sq meter rooftop receiving 800 mm of annual rainfall catches approximately 80,000 liters of pure freshwater each year.',
        keyPoints: [
          'Decentralized recharge raises surrounding neighborhood borewell levels.',
          'Reduces urban flash flooding by reducing peak storm runoff volume.',
        ],
      },
      {
        step: 'HOW_DOES_IT_WORK',
        heading: 'How a Safe Recharge Pit Works',
        content:
          'A safe community recharge pit is typically 2 to 3 meters deep, filled with reverse-graded natural filter media: coarse boulders at the bottom, gravel in the middle, and clean coarse sand on top. Water enters, sediments settle out, and clean filtered water slowly percolates into permeable subsoil.',
        keyPoints: [
          'Top Layer: Coarse sand (filters fine silt and suspended particles).',
          'Middle Layer: 20mm – 40mm gravel (prevents sand from migrating downward).',
          'Bottom Layer: 60mm – 100mm clean boulders (creates void space for storage).',
        ],
      },
      {
        step: 'WHAT_IS_HAPPENING_LOCALLY',
        heading: 'Local Geology Rules!',
        content:
          'Recharge structures must match local geology! In clay-rich soils (like Black Cotton soil in Central India), water infiltrates very slowly, requiring broader retention swales. In fractured basalt or alluvium, percolation pits recharge rapidly. Never construct recharge pits within 3 meters of building foundations.',
        keyPoints: [
          'Always maintain at least 3-5 meters distance from building foundations to prevent structural settlement.',
          'Periodic desilting before the monsoon is mandatory; otherwise clogged sand blocks water entry.',
        ],
      },
      {
        step: 'WHAT_CAN_PEOPLE_DO',
        heading: 'Safe Community Action Guide',
        content:
          'Start with two practical methods: 1) First-Flush rooftop harvesting into clean storage tanks for immediate use. 2) Overflow directed into shallow gravel-filled percolation pits located in park lawns or community commons.',
        keyPoints: [
          'Install a simple manual first-flush valve to discard the first 15 minutes of roof dirt.',
          'Organize pre-monsoon neighborhood desilting drives for existing percolation trenches.',
          'Never dig unsafe deep recharge shafts without hydrogeological guidance.',
        ],
      },
    ],
    quiz: [
      {
        question: 'Why is a "First-Flush" diverter essential in rooftop rainwater harvesting?',
        options: [
          'It heats up the water before it reaches the tank',
          'It washes away the initial dust, bird droppings, and debris from the roof',
          'It adds artificial minerals to the water',
          'It connects the tank directly to the electrical grid',
        ],
        correctIndex: 1,
        explanation: 'The first rainfall washes away accumulated roof dust, leaves, and atmospheric particulates. Diverting this initial flush keeps the main storage tank clean.',
      },
    ],
  },
  {
    id: 'edu-heat-water',
    title: 'Heat & Water: The Inseparable Twin Pressures',
    category: 'heat-water',
    subtitle: 'Thermal Stress, Evaporation Spikes & Groundwater Pumping Surges',
    summary:
      'Discover how extreme summer heat accelerates water depletion, why urban heat islands strain borewells, and how shaded water resilience protects communities.',
    iconName: 'Flame',
    readTime: '4 min read',
    relatedMapLayer: 'heat-map',
    suggestedAction: {
      label: 'Explore Regional Heat Map',
      actionType: 'open-map',
      filterValue: 'heat-map',
    },
    stages: [
      {
        step: 'WHAT_IS_IT',
        heading: 'Why Heat and Water Must Be Seen Together',
        content:
          'Heat and water are deeply coupled. When temperatures soar above 40°C during Indian summer heatwaves, community water demand for drinking, cooling, livestock, and agriculture surges by 30% to 50% exactly when surface reservoirs are at their lowest levels.',
        keyPoints: [
          'Higher Temperature = Higher Evaporative Loss + Surge in Borewell Pumping.',
          'Urban Heat Island (UHI): Concrete and asphalt absorb solar radiation, releasing heat at night and keeping water stress elevated 24 hours a day.',
        ],
      },
      {
        step: 'WHY_DOES_IT_MATTER',
        heading: 'The Vicious Feedback Loop',
        content:
          'When groundwater tables fall, trees and soil moisture dry out. Dry soils lose their cooling evaporative capacity, creating even hotter local microclimates. This forces residents to run air conditioners and drill deeper borewells, worsening power and water strain.',
        keyPoints: [
          'Wet-Bulb Temperature: When temperature and humidity combine past 31°C wet-bulb, the human body cannot cool itself through sweating, making shade and water lifesaving.',
          'Outdoor informal workers face severe dehydration and heatstroke risk without public water kiosks.',
        ],
      },
      {
        step: 'HOW_DOES_IT_WORK',
        heading: 'Evaporative Dynamics & Water Bodies',
        content:
          'In hot arid zones like Rajasthan and Maharashtra, shallow open lakes lose between 8mm to 12mm of water depth every single day to evaporation during May and June. Traditional Indian stepwells (Baolis) were narrow and stepped deep underground precisely to minimize surface area exposed to solar radiation.',
        keyPoints: [
          'Deep narrow reservoirs lose far less water to evaporation than wide shallow unshaded impoundments.',
          'Riparian tree canopies along water margins dramatically lower water surface temperature.',
        ],
      },
      {
        step: 'WHAT_IS_HAPPENING_LOCALLY',
        heading: 'Heatwave Patterns in India',
        content:
          'The India Meteorological Department (IMD) reports increasing frequency, duration, and spatial extent of heatwaves across Central, Northern, and Coastal India. Cities like Ahmedabad, Nagpur, and Delhi have implemented Heat Action Plans (HAPs) prioritizing community hydration stations and cool roofs.',
        keyPoints: [
          'Heat Alert Categories: Yellow (Watch), Orange (Be Prepared), Red (Take Action for Extreme Heat).',
          'Informal settlements with tin and asbestos roofs face indoor temperatures up to 6°C hotter than ambient outdoor shade.',
        ],
      },
      {
        step: 'WHAT_CAN_PEOPLE_DO',
        heading: 'Community Heat-Water Resilience',
        content:
          'Deploy low-cost community solutions: install earthen pot (matka) drinking water stations (pyabs), paint roofs with reflective white lime wash, plant native broad-leaf shade trees along western boundaries, and create shaded water refill hubs.',
        keyPoints: [
          'Setup community-funded clay pot water stations on busy pedestrian corridors.',
          'Advocate for cool roofs (lime coating costs under ₹15 per sq foot and lowers indoor temp by 4°C).',
          'Protect urban wetlands and ponds as natural microclimatic thermal buffers.',
        ],
      },
    ],
    quiz: [
      {
        question: 'Why were historical Indian stepwells (baolis) engineered deep and narrow rather than wide and shallow?',
        options: [
          'To hide them from birds',
          'To minimize open surface area and drastically reduce water loss from solar evaporation',
          'Because stone masonry was unavailable for wide structures',
          'To make water colder for refrigeration',
        ],
        correctIndex: 1,
        explanation: 'Deep, narrow stepwell geometry protected the water surface from scorching solar radiation and hot desert winds, curbing evaporative water loss.',
      },
    ],
  },
  {
    id: 'edu-floods-droughts',
    title: 'Floods & Droughts: Two Sides of the Same Coin',
    category: 'floods-droughts',
    subtitle: 'From Urban Inundation to Parched Summers: Restoring the Sponge',
    summary:
      'Understand why the same city can experience devastating floods in August and severe water scarcity in April, and how community retention buffers both extremes.',
    iconName: 'AlertTriangle',
    readTime: '4 min read',
    relatedMapLayer: 'surface-water',
    suggestedAction: {
      label: 'Explore Flood & Water Bodies',
      actionType: 'open-map',
      filterValue: 'surface-water',
    },
    stages: [
      {
        step: 'WHAT_IS_IT',
        heading: 'The Paradox of Floods and Droughts',
        content:
          'In many Indian cities, residents wade through knee-deep floodwaters during monsoon cloudbursts, yet line up for drinking water tankers just four months later. This is not a failure of rainfall volume; it is a failure of local water retention and infiltration architecture.',
        keyPoints: [
          'Monsoon rainfall in India is highly concentrated: often over 75% of annual rainfall falls in fewer than 100 hours of intense downpours.',
          'When natural catchments are paved with concrete, water cannot soak in, rushing into street drains as flash floods.',
        ],
      },
      {
        step: 'WHY_DOES_IT_MATTER',
        heading: 'Why Both Extremes Harm Communities',
        content:
          'Flooding damages low-income informal housing, contaminates shallow open wells with sewage overflow, and spreads waterborne illnesses. Subsequent summer drought cripples livelihoods, inflates water purchasing costs, and sparks local water conflicts.',
        keyPoints: [
          'Floodwaters mixed with sewage backflow pollute neighborhood groundwater.',
          'Drought increases reliance on unregulated deep borewell tankers.',
        ],
      },
      {
        step: 'HOW_DOES_IT_WORK',
        heading: 'The "Sponge City" Hydrological Principle',
        content:
          'A healthy landscape acts like a natural sponge. Permeable topsoil, wetlands, ponds, and forested slopes absorb heavy rainfall, store water in the aquifer, and slowly release it into springs and streams throughout the dry season.',
        keyPoints: [
          'Paved urban surface: 80% Runoff, 10% Infiltration, 10% Evaporation (Flash Floods).',
          'Natural sponge surface: 15% Runoff, 50% Infiltration, 35% Evapo-transpiration (Recharges Aquifers).',
        ],
      },
      {
        step: 'WHAT_IS_HAPPENING_LOCALLY',
        heading: 'What is Happening in Indian Metros',
        content:
          'In Chennai (2015, 2023), Bengaluru (2022), and Delhi (2023), catastrophic urban flooding occurred primarily because lake cascades had been cut off, wetlands were paved over, and river floodplains were occupied by buildings.',
        keyPoints: [
          'Natural drainage valleys have been narrowed into undersized concrete box culverts that choke with debris.',
          'Storm drains are often poorly maintained and blocked with plastic solid waste before the monsoon.',
        ],
      },
      {
        step: 'WHAT_CAN_PEOPLE_DO',
        heading: 'Community Preparedness & Sponge Creation',
        content:
          'Local communities can inspect and clear stormwater culverts, convert unpaved verges into bioswales, desilt community ponds before monsoon rains, and maintain open permeable soil in parks and household compounds.',
        keyPoints: [
          'Participate in pre-monsoon neighborhood drain cleaning and silt trap clearance.',
          'Advocate against paving public school grounds and residential colony parking lots with solid concrete.',
          'Install permeable paver blocks and rain gardens that allow water to soak into the ground.',
        ],
      },
    ],
    quiz: [
      {
        question: 'Why do paved concrete cities experience severe flash flooding even during moderate rainfall?',
        options: [
          'Because concrete creates more rain clouds',
          'Because impermeable surfaces prevent water from soaking into the ground, forcing 80%+ into rapid runoff',
          'Because rivers reverse direction during summer',
          'Because borewells pump water up onto the streets',
        ],
        correctIndex: 1,
        explanation: 'Impermeable asphalt and concrete prevent natural soil infiltration, forcing up to 80-90% of rain into instantaneous surface runoff that quickly overwhelms urban drains.',
      },
    ],
  },
  {
    id: 'edu-climate-monsoon',
    title: 'Climate & Monsoon Variability',
    category: 'climate-monsoon',
    subtitle: 'The Indian Monsoon Engine: Shifting Timing, Cloudbursts & Dry Spells',
    summary:
      'Learn how the Southwest and Northeast monsoons deliver India’s water, why climate change is altering rainfall patterns into fewer but more intense spells, and how communities adapt.',
    iconName: 'CloudLightning',
    readTime: '4 min read',
    relatedMapLayer: 'surface-water',
    suggestedAction: {
      label: 'Explore Water Resources',
      actionType: 'open-map',
      filterValue: 'surface-water',
    },
    stages: [
      {
        step: 'WHAT_IS_IT',
        heading: 'The Great Indian Monsoon System',
        content:
          'The Indian Monsoon is a seasonal reversal of winds driven by differential heating between the Indian subcontinent landmass and the vast Indian Ocean. The Southwest Monsoon (June to September) supplies over 75% of India’s annual precipitation, while the Northeast Monsoon (October to December) brings vital rains to coastal Tamil Nadu, Andhra Pradesh, and Kerala.',
        keyPoints: [
          'Southwest Monsoon: Arabian Sea branch + Bay of Bengal branch.',
          'Northeast Monsoon: Retreating monsoon winds capturing moisture across the Bay of Bengal.',
        ],
      },
      {
        step: 'WHY_DOES_IT_MATTER',
        heading: 'Why Monsoon Timing Determines Survival',
        content:
          'India’s agrarian economy, food security, and municipal water supply rely on predictable monsoon replenishment of surface dams and underground aquifers. A delay of just three weeks in monsoon arrival can precipitate widespread municipal water rationing and agricultural distress.',
        keyPoints: [
          'Monsoon break periods: Extended dry spells during the active monsoon season that cause rapid soil moisture loss.',
          'Early withdrawal leaves aquifers under-recharged before the eight-month dry season begins.',
        ],
      },
      {
        step: 'HOW_DOES_IT_WORK',
        heading: 'How Climate Change is Changing the Monsoon',
        content:
          'Scientists observe that while total seasonal rainfall across India has remained relatively stable, its distribution has altered drastically. Rain now falls in fewer, more extreme cloudburst events interspersed with prolonged dry spells. Warmer air holds 7% more moisture per degree Celsius, supercharging rainfall intensity.',
        keyPoints: [
          'High-intensity cloudbursts overwhelm conventional drainage within 30 minutes.',
          'Extended dry spells increase evaporation and soil compaction, making subsequent rain harder to absorb.',
        ],
      },
      {
        step: 'WHAT_IS_HAPPENING_LOCALLY',
        heading: 'Regional Impacts Across India',
        content:
          'The Western Ghats, central Maharashtra, and the Himalayan foothills are experiencing localized heavy rain events causing mudslides and riverbank erosion. Meanwhile, parts of the Indo-Gangetic belt experience erratic rainfall deficits.',
        keyPoints: [
          'Traditional farming calendars based on ancient Nakshatra monsoon timings face climate misalignment.',
          'Groundwater recharge requires steady, gentle soaking rain rather than torrential runoff.',
        ],
      },
      {
        step: 'WHAT_CAN_PEOPLE_DO',
        heading: 'Building Monsoon-Resilient Communities',
        content:
          'Because monsoon downpours are more episodic and intense, communities must build decentralized detention basins, farm bunds, and percolation trenches capable of capturing high-volume flash runoff before it leaves the watershed.',
        keyPoints: [
          'Construct contour bunds and swales that slow down fast-moving monsoon runoff.',
          'Deepen traditional village water bodies (talabs and tankas) to increase holding capacity.',
          'Diversify water sources: combine rainwater harvesting, shallow open wells, and wastewater recycling.',
        ],
      },
    ],
    quiz: [
      {
        question: 'How is climate change primarily altering the nature of Indian monsoon rainfall?',
        options: [
          'It has caused rain to stop permanently across the entire country',
          'Rainfall is concentrated into fewer, more intense downpours with longer dry intervals',
          'It has replaced rainfall entirely with snowfall in Mumbai and Chennai',
          'It has made monsoon winds blow only from the North Pole',
        ],
        correctIndex: 1,
        explanation: 'Atmospheric warming increases moisture holding capacity, causing rain to fall in intense, high-volume cloudbursts separated by extended hot dry spells.',
      },
    ],
  },
  {
    id: 'edu-el-nino',
    title: 'El Niño & the Indian Climate: Myths vs Science',
    category: 'el-nino',
    subtitle: 'Understanding the ENSO Phenomenon, Monsoon Dynamics & Regional Realities',
    summary:
      'Understand what El Niño actually is, how Pacific Ocean warming influences the Indian monsoon, and why it is NOT an automatic forecast of drought.',
    iconName: 'Compass',
    readTime: '5 min read',
    relatedMapLayer: 'heat-map',
    suggestedAction: {
      label: 'Check Regional Heat Conditions',
      actionType: 'open-map',
      filterValue: 'heat-map',
    },
    stages: [
      {
        step: 'WHAT_IS_IT',
        heading: 'What is El Niño?',
        content:
          'El Niño is the warm phase of the El Niño-Southern Oscillation (ENSO), a natural climate pattern characterized by abnormal warming of surface waters in the central and eastern equatorial Pacific Ocean. Its counterpart, La Niña, is characterized by cooler-than-normal Pacific waters.',
        keyPoints: [
          'ENSO operates on a cycle of roughly 2 to 7 years.',
          'Atmospheric Walker Circulation shifts eastward, altering global jet streams and wind patterns thousands of miles away.',
        ],
      },
      {
        step: 'WHY_DOES_IT_MATTER',
        heading: 'Why Does It Matter for India?',
        content:
          'Historically, El Niño events have often been associated with a weakening or erratic behavior of the Indian Southwest Monsoon. The eastward shift of warm Pacific waters alters tropical convection, suppressing moisture-laden cloud formation over the Indian subcontinent.',
        keyPoints: [
          'Roughly 60% of historic drought years in India have coincided with an El Niño event.',
          'However, the reverse is NOT true: not all El Niño events cause drought in India!',
        ],
      },
      {
        step: 'HOW_DOES_IT_WORK',
        heading: 'The Indian Ocean Dipole (IOD) Balance',
        content:
          'Why does El Niño not automatically cause drought? Because other major climate systems modulate its impact! Most notably, the Indian Ocean Dipole (IOD)—often called the "Indian Niño"—can completely offset El Niño. A Positive IOD (warmer western Indian Ocean near Africa) pumps immense moisture toward India, preserving normal monsoon rainfall even during strong El Niño years (such as in 1997).',
        keyPoints: [
          'Positive IOD: Enhances Indian monsoon rainfall and can counteract El Niño drying effects.',
          'Eurasian snow cover and local land-sea thermal gradients also alter regional monsoon strength.',
        ],
      },
      {
        step: 'WHAT_IS_HAPPENING_LOCALLY',
        heading: 'Regional Variations Across India',
        content:
          'Even during an El Niño year with nationwide statistical deficits, rainfall impacts vary drastically by region. One state might receive abundant monsoon showers while an adjacent state experiences dry spells. Media headlines that equate El Niño with guaranteed catastrophe cause unnecessary panic and distort community water planning.',
        keyPoints: [
          'Never interpret an El Niño advisory as a deterministic prediction of drought.',
          'Treat El Niño as a risk signal to initiate proactive water conservation, not panic.',
        ],
      },
      {
        step: 'WHAT_CAN_PEOPLE_DO',
        heading: 'Proactive Community Resilience',
        content:
          'When climate models suggest an upcoming El Niño year, communities should proactively prepare by auditing existing water storage structures, repairing leaks in local distribution networks, maximizing rainwater harvesting, and planning water-efficient crop cycles.',
        keyPoints: [
          'Audit neighborhood water storage capacity before monsoon season begins.',
          'Maintain decentralized recharge structures regardless of climate forecasts.',
          'Rely on verified meteorological advisories from IMD rather than speculative viral rumors.',
        ],
      },
    ],
    quiz: [
      {
        question: 'Does an El Niño event automatically guarantee that India will suffer a drought?',
        options: [
          'Yes, every single El Niño in history has caused an absolute nationwide drought',
          'No, El Niño can influence monsoon circulation, but other factors like a Positive Indian Ocean Dipole (IOD) can offset it',
          'No, El Niño only affects snowfall in Antarctica',
          'Yes, because El Niño cools down the Indian Ocean completely',
        ],
        correctIndex: 1,
        explanation: 'El Niño increases the probability of monsoon suppression, but it does NOT automatically cause drought. Phenomena like a Positive Indian Ocean Dipole (IOD) frequently counteract it, delivering normal rains (e.g. 1997).',
      },
      {
        question: 'What is the Indian Ocean Dipole (IOD)?',
        options: [
          'A giant submarine volcano near Sri Lanka',
          'A difference in sea surface temperature between the western and eastern Indian Ocean that influences monsoon rainfall',
          'A type of deep-sea fishing net used in Kerala',
          'An artificial satellite launched by IMD',
        ],
        correctIndex: 1,
        explanation: 'The Indian Ocean Dipole is an ocean-atmosphere climate phenomenon characterized by differing sea surface temperatures across the western and eastern Indian Ocean, strongly modulating Indian rainfall.',
      },
    ],
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'activity_invite',
    title: 'New Activity: Godavari Riverbank Cleanup',
    message: 'Maya Sharma organized an upcoming riverbank cleanup on Oct 4. Volunteer roster is open!',
    read: false,
    timestamp: '2026-09-29T10:00:00Z',
    link: 'activities',
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'report_status',
    title: 'Report Verified: Panchavati Outfall',
    message: 'Your citizen report regarding untreated greywater discharge has been reviewed and verified by the ground team.',
    read: false,
    timestamp: '2026-09-28T14:30:00Z',
    link: 'reports',
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'community_announcement',
    title: 'Pre-Monsoon Percolation Audit',
    message: 'Jal-Sangam Maharashtra posted an announcement regarding the weekend pit audit in Kothrud.',
    read: true,
    timestamp: '2026-09-26T08:15:00Z',
    link: 'communities',
  },
];
