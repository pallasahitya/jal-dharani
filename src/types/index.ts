export type NavTab = 'home' | 'maps' | 'communities' | 'activities' | 'education' | 'profile';

export type MapLayer = 'surface-water' | 'aquifer' | 'heat-map';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'citizen' | 'volunteer' | 'community_lead' | 'hydrologist';
  location: {
    city: string;
    state: string;
    neighborhood?: string;
  };
  bio: string;
  joinedDate: string;
  impactMetrics: {
    volunteerHours: number;
    activitiesJoined: number;
    activitiesOrganized: number;
    reportsSubmitted: number;
    reportsVerified: number;
    waterBodiesMonitored: number;
  };
}

export interface WaterQualityOfficial {
  dissolvedOxygenMgL: number; // e.g., 4.5 mg/L (>5 ideal for fish)
  ph: number; // 6.5 - 8.5
  bodMgL: number; // Biochemical Oxygen Demand (<3 is clean, >10 heavily polluted)
  tdsMgL: number; // Total Dissolved Solids
  turbidityNtu: number;
  lastUpdated: string;
  officialSource: string; // e.g. "CPCB National Water Quality Monitoring Programme (NWMP)"
  complianceStatus: 'Satisfactory' | 'Moderate Concern' | 'Severe Degradation';
}

export interface Observation {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  date: string;
  note: string;
  photoUrl?: string;
  category: 'algal-bloom' | 'plastic-waste' | 'water-clarity' | 'wildlife-sighting' | 'low-flow' | 'foaming';
  isCitizenReport: true;
}

export interface WaterBody {
  id: string;
  name: string;
  localName?: string;
  type: 'river' | 'lake' | 'pond' | 'canal' | 'stepwell' | 'wetland';
  coordinates: [number, number]; // [lat, lng]
  location: {
    city: string;
    state: string;
    basin: string;
  };
  description: string;
  historicalContext?: string;
  officialData: WaterQualityOfficial;
  pollutionDetails: {
    severity: 'Low' | 'Moderate' | 'High' | 'Critical';
    primaryPollutants: string[];
    summary: string;
  };
  communityIds: string[];
  reportCount: number;
  activityCount: number;
  observations: Observation[];
  photos: string[];
}

export interface Aquifer {
  id: string;
  name: string;
  hydrogeologyType: 'Alluvial (Gangetic)' | 'Basaltic (Deccan Traps)' | 'Hard Rock / Crystalline' | 'Coastal Sandstone' | 'Karst / Limestone';
  region: string;
  coordinates: [number, number];
  bounds?: [[number, number], [number, number]]; // approx bounding box for map highlight
  cgwbCategory: 'Safe' | 'Semi-Critical' | 'Critical' | 'Over-exploited';
  currentWaterTableBglMeters: number; // below ground level
  tenYearTrend: 'Rising' | 'Stable' | 'Declining' | 'Rapidly Depleting';
  trendRateMetersPerYear: number;
  rechargePotential: 'High' | 'Moderate' | 'Low' | 'Constrained by Impervious Surfaces';
  soilInfiltrationRateMmHr: number;
  safeRechargePractices: string[];
  risksAndWarnings: string[];
  officialSource: string; // "Central Ground Water Board (CGWB) Dynamic Ground Water Resources Report"
  description: string;
}

export interface HeatZone {
  id: string;
  city: string;
  areaName: string;
  coordinates: [number, number];
  currentTempC: number;
  feelsLikeC: number;
  wetBulbTempC: number;
  relativeHumidityPercent: number;
  riskLevel: 'Normal' | 'Moderate' | 'High' | 'Severe Heatwave';
  imdAlert: 'None' | 'Yellow' | 'Orange' | 'Red';
  urbanCanopyPercent: number;
  imperviousSurfacePercent: number;
  waterStressMultiplier: '1.2x Baseline' | '1.8x Heavy Stress' | '2.5x Critical Surge';
  peakHours: string;
  communityCoolingTips: string[];
  nearbyCoolingCentres: { name: string; distance: string }[];
  officialSource: string; // "India Meteorological Department (IMD) / State Disaster Management Authority"
}

export interface CommunityMember {
  userId: string;
  name: string;
  avatar: string;
  role: 'admin' | 'moderator' | 'volunteer';
  joinedAt: string;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  photoUrl?: string;
  timestamp: string;
  likesCount: number;
  comments: {
    id: string;
    userId: string;
    userName: string;
    avatar: string;
    text: string;
    timestamp: string;
  }[];
}

export interface CommunityImpact {
  membersCount: number;
  activitiesCompleted: number;
  volunteersMobilized: number;
  waterBodiesMonitored: number;
  reportsSubmitted: number;
  rechargeStructuresMapped: number;
  wasteRemovedKg?: number;
  treesPlantedForShade?: number;
  isVerifiedData: boolean;
}

export interface Community {
  id: string;
  name: string;
  tagline: string;
  description: string;
  focusAreas: ('water-body' | 'groundwater' | 'heat-resilience' | 'rainwater-harvesting' | 'pollution-cleanup')[];
  location: {
    city: string;
    state: string;
    coordinates: [number, number];
  };
  waterBodyId?: string;
  adminIds: string[];
  members: CommunityMember[];
  impact: CommunityImpact;
  photos: string[];
  posts: CommunityPost[];
  announcements: {
    id: string;
    title: string;
    content: string;
    date: string;
  }[];
  createdAt: string;
}

export interface ActivityParticipant {
  userId: string;
  name: string;
  avatar: string;
  joinedAt: string;
}

export interface Activity {
  id: string;
  communityId: string;
  communityName: string;
  title: string;
  description: string;
  category: 'cleanup' | 'groundwater-audit' | 'rwh-maintenance' | 'heat-shelter' | 'education' | 'documentation';
  location: {
    name: string;
    address: string;
    coordinates: [number, number];
  };
  date: string; // ISO date string
  time: string;
  organizer: {
    id: string;
    name: string;
    avatar: string;
  };
  volunteerLimit: number;
  participants: ActivityParticipant[];
  status: 'upcoming' | 'in-progress' | 'completed';
  waterBodyId?: string;
  photos: string[];
  beforeAfter?: {
    beforePhoto: string;
    afterPhoto: string;
    description: string;
    impactSummary: string;
  };
  createdAt: string;
}

export interface EnvironmentalReport {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  category:
    | 'garbage-dumping'
    | 'sewage-inflow'
    | 'unusual-color'
    | 'foaming'
    | 'dead-fish'
    | 'flooding'
    | 'drying-waterbody'
    | 'blocked-drainage'
    | 'damaged-recharge-structure';
  description: string;
  location: {
    name: string;
    city: string;
    state: string;
    coordinates: [number, number];
  };
  waterBodyId?: string;
  waterBodyName?: string;
  photoUrl?: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'RESOLVED';
  statusNote?: string;
  submittedAt: string;
  isCitizenReport: true;
}

export interface LearningStage {
  step: 'WHAT_IS_IT' | 'WHY_DOES_IT_MATTER' | 'HOW_DOES_IT_WORK' | 'WHAT_IS_HAPPENING_LOCALLY' | 'WHAT_CAN_PEOPLE_DO';
  heading: string;
  content: string;
  keyPoints: string[];
  visualType?: 'diagram' | 'chart' | 'infographic' | 'comparison';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface EducationTopic {
  id: string;
  title: string;
  category:
    | 'water-pollution'
    | 'surface-water'
    | 'groundwater-aquifers'
    | 'rainwater-recharge'
    | 'heat-water'
    | 'floods-droughts'
    | 'climate-monsoon'
    | 'el-nino';
  subtitle: string;
  summary: string;
  iconName: string;
  readTime: string;
  stages: LearningStage[];
  quiz: QuizQuestion[];
  relatedMapLayer: MapLayer;
  suggestedAction: {
    label: string;
    actionType: 'open-map' | 'find-community' | 'create-activity';
    filterValue?: string;
  };
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'activity_invite' | 'activity_reminder' | 'community_announcement' | 'report_status' | 'member_joined';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  link?: string;
}
