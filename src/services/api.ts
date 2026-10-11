import {
  User,
  WaterBody,
  Aquifer,
  HeatZone,
  EnvironmentalReport,
  Community,
  Activity,
  Observation,
} from '../types';

// API Base URL - defaults to local FastAPI backend on port 8000
export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const AUTH_TOKEN_STORAGE_KEY = 'jal_dharani_jwt_token';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  try {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } catch (e) {
    console.error('Failed to save auth token to localStorage', e);
  }
}

export function clearAuthToken(): void {
  try {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to remove auth token from localStorage', e);
  }
}

/**
 * Generic helper for typed JSON fetch calls with error handling and Authorization header.
 */
async function request<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout so frontend never hangs

    const token = getAuthToken();
    const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...(options?.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      console.warn(`[Jal-Dharani API] 401 Unauthorized at ${endpoint}. Clearing expired session token.`);
      // If server explicitly rejects token as expired or invalid, remove it
      clearAuthToken();
      return null;
    }

    if (!response.ok) {
      console.warn(`[Jal-Dharani API] ${response.status} at ${endpoint}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (err) {
    // If backend is not running or unreachable, return null so local fallback takes over seamlessly
    return null;
  }
}

/**
 * Detailed request helper for Auth endpoints that returns status and error details.
 */
async function authRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const token = getAuthToken();
    const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...(options?.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg =
        data?.detail ||
        (Array.isArray(data?.detail) ? data.detail[0]?.msg : null) ||
        `Request failed with status ${response.status}`;
      return { success: false, error: errorMsg };
    }

    return { success: true, data: data as T };
  } catch (err: any) {
    return {
      success: false,
      error: err?.name === 'AbortError' ? 'Request timed out' : 'Unable to connect to authentication server',
    };
  }
}

// ============================================================================
// BIDIRECTIONAL NORMALIZATION LAYER (Backend DB Model <-> Frontend TypeScript)
// Guarantees all objects conform strictly to src/types/index.ts regardless of source
// ============================================================================

export function normalizeUser(raw: any): User {
  if (!raw) return {} as User;
  return {
    id: String(raw.id || `usr-${Date.now()}`),
    name: String(raw.name || 'Citizen User'),
    email: String(raw.email || ''),
    avatar: raw.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${raw.id || 'usr'}`,
    role: (raw.role as any) || 'citizen',
    location: {
      city: raw.location?.city || raw.city || 'Pune',
      state: raw.location?.state || raw.state || 'Maharashtra',
      neighborhood: raw.location?.neighborhood || raw.neighborhood || '',
    },
    bio: raw.bio || '',
    joinedDate: raw.created_at ? String(raw.created_at).split('T')[0] : (raw.joinedDate || new Date().toISOString().split('T')[0]),
    impactMetrics: {
      volunteerHours: raw.impactMetrics?.volunteerHours ?? raw.impact_metrics?.volunteer_hours ?? 0,
      activitiesJoined: raw.impactMetrics?.activitiesJoined ?? raw.impact_metrics?.activities_joined ?? 0,
      activitiesOrganized: raw.impactMetrics?.activitiesOrganized ?? raw.impact_metrics?.activities_organized ?? 0,
      reportsSubmitted: raw.impactMetrics?.reportsSubmitted ?? raw.impact_metrics?.reports_submitted ?? 0,
      reportsVerified: raw.impactMetrics?.reportsVerified ?? raw.impact_metrics?.reports_verified ?? 0,
      waterBodiesMonitored: raw.impactMetrics?.waterBodiesMonitored ?? raw.impact_metrics?.water_bodies_monitored ?? 0,
    },
  };
}

export function normalizeWaterBody(raw: any): WaterBody {
  if (!raw) return {} as WaterBody;

  const lat = raw.latitude ?? raw.location?.coordinates?.[0] ?? raw.coordinates?.[0] ?? 18.5284;
  const lng = raw.longitude ?? raw.location?.coordinates?.[1] ?? raw.coordinates?.[1] ?? 73.8743;

  return {
    id: String(raw.id || `wb-${Date.now()}`),
    name: String(raw.name || 'Unnamed Water Body'),
    localName: raw.local_name || raw.localName,
    type: raw.type || 'lake',
    coordinates: [Number(lat), Number(lng)],
    location: {
      city: raw.location?.city || raw.city || 'Pune',
      state: raw.location?.state || raw.state || 'Maharashtra',
      basin: raw.location?.basin || raw.basin || 'Local Catchment Basin',
    },
    description: String(raw.description || ''),
    historicalContext: raw.historical_context || raw.historicalContext,
    officialData: {
      dissolvedOxygenMgL: Number(raw.dissolved_oxygen_mg_l ?? raw.officialData?.dissolvedOxygenMgL ?? 4.2),
      ph: Number(raw.ph ?? raw.officialData?.ph ?? 7.4),
      bodMgL: Number(raw.bod_mg_l ?? raw.officialData?.bodMgL ?? 6.5),
      tdsMgL: Number(raw.tds_mg_l ?? raw.officialData?.tdsMgL ?? 450.0),
      turbidityNtu: Number(raw.turbidity_ntu ?? raw.officialData?.turbidityNtu ?? 12.0),
      officialSource: raw.official_source || raw.officialData?.officialSource || 'CPCB National Water Quality Monitoring Programme',
      complianceStatus: raw.compliance_status || raw.officialData?.complianceStatus || 'Moderate Concern',
      lastUpdated: raw.quality_last_updated || raw.officialData?.lastUpdated || '2026-09-01',
    },
    pollutionDetails: {
      severity: raw.pollution_severity || raw.pollutionDetails?.severity || 'Moderate',
      primaryPollutants: Array.isArray(raw.primary_pollutants)
        ? raw.primary_pollutants
        : Array.isArray(raw.pollutionDetails?.primaryPollutants)
        ? raw.pollutionDetails.primaryPollutants
        : ['Urban Greywater Outflows'],
      summary: raw.pollution_summary || raw.pollutionDetails?.summary || 'Monitored catchment with localized citizen reports.',
    },
    communityIds: Array.isArray(raw.communityIds) ? raw.communityIds : [],
    reportCount: Number(raw.reportCount ?? raw.reports?.length ?? 0),
    activityCount: Number(raw.activityCount ?? raw.activities?.length ?? 0),
    photos: Array.isArray(raw.photos) ? raw.photos : [],
    observations: Array.isArray(raw.observations)
      ? raw.observations.map((obs: any): Observation => ({
          id: String(obs.id || `obs-${Date.now()}`),
          userId: obs.user_id || obs.userId || 'user-anon',
          userName: obs.user_name || obs.userName || 'Citizen Observer',
          userAvatar: obs.user_avatar || obs.userAvatar || '',
          date: obs.observed_at ? String(obs.observed_at).split('T')[0] : obs.date || '2026-09-01',
          note: obs.note || '',
          photoUrl: obs.photo_url || obs.photoUrl,
          category: obs.category || 'water-clarity',
          isCitizenReport: true,
        }))
      : [],
  };
}

export function normalizeAquifer(raw: any): Aquifer {
  if (!raw) return {} as Aquifer;

  const lat = raw.latitude ?? raw.coordinates?.[0] ?? 18.5204;
  const lng = raw.longitude ?? raw.coordinates?.[1] ?? 73.8567;

  return {
    id: String(raw.id || `aq-${Date.now()}`),
    name: String(raw.name || 'Regional Aquifer System'),
    hydrogeologyType: raw.hydrogeology_type || raw.hydrogeologyType || 'Basaltic (Deccan Traps)',
    region: String(raw.region || 'Regional Catchment'),
    coordinates: [Number(lat), Number(lng)],
    bounds: raw.bounds,
    cgwbCategory: raw.cgwb_category || raw.cgwbCategory || 'Semi-Critical',
    currentWaterTableBglMeters: Number(raw.water_table_depth_bgl_meters ?? raw.currentWaterTableBglMeters ?? 18.2),
    tenYearTrend: raw.ten_year_trend || raw.tenYearTrend || 'Declining',
    trendRateMetersPerYear: Number(raw.trend_rate_meters_per_year ?? raw.trendRateMetersPerYear ?? 0.35),
    rechargePotential: raw.recharge_potential || raw.rechargePotential || 'Moderate',
    soilInfiltrationRateMmHr: Number(raw.soil_infiltration_rate_mm_hr ?? raw.soilInfiltrationRateMmHr ?? 22.0),
    safeRechargePractices: Array.isArray(raw.safe_recharge_practices)
      ? raw.safe_recharge_practices
      : Array.isArray(raw.safeRechargePractices)
      ? raw.safeRechargePractices
      : ['De-silt recharge pits prior to monsoons', 'Maintain bioswale vegetative filters'],
    risksAndWarnings: Array.isArray(raw.risks_and_warnings)
      ? raw.risks_and_warnings
      : Array.isArray(raw.risksAndWarnings)
      ? raw.risksAndWarnings
      : [],
    officialSource: raw.official_source || raw.officialSource || 'Central Ground Water Board (CGWB)',
    description: String(raw.description || 'Subsurface geological formation bearing groundwater.'),
  };
}

export function normalizeHeatZone(raw: any): HeatZone {
  if (!raw) return {} as HeatZone;

  const lat = raw.latitude ?? raw.coordinates?.[0] ?? 18.5204;
  const lng = raw.longitude ?? raw.coordinates?.[1] ?? 73.8567;

  return {
    id: String(raw.id || `hz-${Date.now()}`),
    city: String(raw.city || 'Pune'),
    areaName: String(raw.area_name || raw.areaName || 'Urban Zone'),
    coordinates: [Number(lat), Number(lng)],
    currentTempC: Number(raw.current_temp_c ?? raw.currentTempC ?? 38.5),
    feelsLikeC: Number(raw.feels_like_c ?? raw.feelsLikeC ?? 41.2),
    wetBulbTempC: Number(raw.wet_bulb_temp_c ?? raw.wetBulbTempC ?? 28.1),
    relativeHumidityPercent: Number(raw.relative_humidity_percent ?? raw.relativeHumidityPercent ?? 46.0),
    riskLevel: raw.risk_level || raw.riskLevel || 'Moderate',
    imdAlert: raw.imd_alert || raw.imdAlert || 'Yellow',
    urbanCanopyPercent: Number(raw.urban_canopy_percent ?? raw.urbanCanopyPercent ?? 14.0),
    imperviousSurfacePercent: Number(raw.impervious_surface_percent ?? raw.imperviousSurfacePercent ?? 72.0),
    waterStressMultiplier: raw.water_stress_multiplier || raw.waterStressMultiplier || '1.8x Heavy Stress',
    peakHours: raw.peak_hours || raw.peakHours || '12:00 PM – 04:30 PM',
    communityCoolingTips: Array.isArray(raw.community_cooling_tips)
      ? raw.community_cooling_tips
      : Array.isArray(raw.communityCoolingTips)
      ? raw.communityCoolingTips
      : ['Ensure hydration and maintain community cooling spots'],
    nearbyCoolingCentres: Array.isArray(raw.nearby_cooling_centres)
      ? raw.nearby_cooling_centres
      : Array.isArray(raw.nearbyCoolingCentres)
      ? raw.nearbyCoolingCentres
      : [],
    officialSource: raw.official_source || raw.officialSource || 'India Meteorological Department (IMD)',
  };
}

export function normalizeReport(raw: any): EnvironmentalReport {
  if (!raw) return {} as EnvironmentalReport;

  const lat = raw.latitude ?? raw.location?.coordinates?.[0] ?? 18.5204;
  const lng = raw.longitude ?? raw.location?.coordinates?.[1] ?? 73.8567;

  return {
    id: String(raw.id || `rep-${Date.now()}`),
    userId: raw.submitted_by_user_id || raw.userId || 'user-anon',
    userName: raw.submitted_by_user_name || raw.userName || 'Citizen Observer',
    userAvatar: raw.submitted_by_user_avatar || raw.userAvatar || '',
    title: String(raw.title || 'Field Observation'),
    category: raw.category || 'garbage-dumping',
    description: String(raw.description || ''),
    location: {
      name: raw.location_name || raw.location?.name || 'Local Site',
      city: raw.city || raw.location?.city || 'Pune',
      state: raw.state || raw.location?.state || 'Maharashtra',
      coordinates: [Number(lat), Number(lng)],
    },
    waterBodyId: raw.water_body_id || raw.waterBodyId,
    waterBodyName: raw.waterBodyName,
    photoUrl: raw.photo_url || raw.photoUrl,
    status: raw.status || 'SUBMITTED',
    statusNote: raw.status_note || raw.statusNote || 'Citizen observation submitted.',
    submittedAt: raw.submitted_at || raw.submittedAt || new Date().toISOString(),
    isCitizenReport: true,
  };
}

export function normalizeCommunity(raw: any): Community {
  if (!raw) return {} as Community;

  const lat = raw.latitude ?? raw.location?.coordinates?.[0] ?? 18.5204;
  const lng = raw.longitude ?? raw.location?.coordinates?.[1] ?? 73.8567;

  const members = Array.isArray(raw.members)
    ? raw.members.map((m: any) => ({
        userId: m.user_id || m.userId || 'user-1',
        name: m.user_name || m.name || 'Member',
        avatar: m.user_avatar || m.avatar || '',
        role: m.role || 'volunteer',
        joinedAt: m.joined_at ? String(m.joined_at).split('T')[0] : m.joinedAt || '2026-09-01',
      }))
    : [
        {
          userId: raw.created_by_user_id || 'user-1',
          name: 'Organizer',
          avatar: '',
          role: 'admin' as const,
          joinedAt: '2026-09-01',
        },
      ];

  const posts = Array.isArray(raw.posts)
    ? raw.posts.map((p: any) => ({
        id: String(p.id || `post-${Date.now()}`),
        communityId: p.community_id || p.communityId || raw.id,
        userId: p.user_id || p.userId || 'user-1',
        userName: p.user_name || p.userName || 'Member',
        userAvatar: p.user_avatar || p.userAvatar || '',
        content: p.content || '',
        photoUrl: p.photo_url || p.photoUrl,
        timestamp: p.created_at ? String(p.created_at) : p.timestamp || new Date().toISOString(),
        likesCount: Number(p.likes_count ?? p.likesCount ?? 0),
        comments: Array.isArray(p.comments)
          ? p.comments.map((c: any) => ({
              id: String(c.id || `c-${Date.now()}`),
              userId: c.user_id || c.userId || 'user-1',
              userName: c.user_name || c.userName || 'Member',
              avatar: c.user_avatar || c.avatar || '',
              text: c.text || '',
              timestamp: c.created_at ? String(c.created_at) : c.timestamp || new Date().toISOString(),
            }))
          : [],
      }))
    : [];

  return {
    id: String(raw.id || `comm-${Date.now()}`),
    name: String(raw.name || 'Citizen Collective'),
    tagline: String(raw.tagline || 'Water and heat resilience group'),
    description: String(raw.description || ''),
    focusAreas: Array.isArray(raw.focus_areas)
      ? raw.focus_areas
      : Array.isArray(raw.focusAreas)
      ? raw.focusAreas
      : ['water-body', 'groundwater'],
    location: {
      city: raw.location?.city || raw.city || 'Pune',
      state: raw.location?.state || raw.state || 'Maharashtra',
      coordinates: [Number(lat), Number(lng)],
    },
    waterBodyId: raw.water_body_id || raw.waterBodyId,
    adminIds: Array.isArray(raw.adminIds)
      ? raw.adminIds
      : raw.created_by_user_id
      ? [raw.created_by_user_id]
      : ['user-1'],
    members,
    impact: raw.impact || {
      membersCount: members.length,
      activitiesCompleted: 0,
      volunteersMobilized: members.length,
      waterBodiesMonitored: raw.water_body_id || raw.waterBodyId ? 1 : 0,
      reportsSubmitted: 0,
      rechargeStructuresMapped: 0,
      isVerifiedData: true,
    },
    photos: Array.isArray(raw.photos) ? raw.photos : [],
    posts,
    announcements: Array.isArray(raw.announcements) ? raw.announcements : [],
    createdAt: raw.created_at ? String(raw.created_at).split('T')[0] : raw.createdAt || '2026-09-01',
  };
}

export function normalizeActivity(raw: any): Activity {
  if (!raw) return {} as Activity;

  const lat = raw.latitude ?? raw.location?.coordinates?.[0] ?? 18.5204;
  const lng = raw.longitude ?? raw.location?.coordinates?.[1] ?? 73.8567;

  const participants = Array.isArray(raw.participants)
    ? raw.participants.map((p: any) => ({
        userId: p.user_id || p.userId || 'user-1',
        name: p.user_name || p.name || 'Volunteer',
        avatar: p.user_avatar || p.avatar || '',
        joinedAt: p.joined_at ? String(p.joined_at).split('T')[0] : p.joinedAt || '2026-09-01',
      }))
    : [];

  const beforeAfter = raw.impact
    ? {
        beforePhoto: raw.impact.before_photo || '',
        afterPhoto: raw.impact.after_photo || '',
        description: raw.impact.description || '',
        impactSummary: raw.impact.impact_summary || '',
      }
    : raw.beforeAfter;

  return {
    id: String(raw.id || `act-${Date.now()}`),
    communityId: raw.community_id || raw.communityId || 'comm-1',
    communityName: raw.communityName || 'Local Community Collective',
    title: String(raw.title || 'Water Resilience Event'),
    description: String(raw.description || ''),
    category: raw.category || 'cleanup',
    location: {
      name: raw.location_name || raw.location?.name || 'Catchment Project Site',
      address: raw.location_address || raw.location?.address || 'Site Location',
      coordinates: [Number(lat), Number(lng)],
    },
    date: raw.date || new Date().toISOString().split('T')[0],
    time: raw.time || '08:00 AM – 11:00 AM IST',
    organizer: {
      id: raw.organizer?.id || raw.organizer_id || 'user-1',
      name: raw.organizer?.name || raw.organizer_name || 'Community Organizer',
      avatar: raw.organizer?.avatar || raw.organizer_avatar || '',
    },
    volunteerLimit: Number(raw.volunteer_limit ?? raw.volunteerLimit ?? 30),
    participants,
    status: raw.status || 'upcoming',
    waterBodyId: raw.water_body_id || raw.waterBodyId,
    photos: Array.isArray(raw.photos) ? raw.photos : [],
    beforeAfter,
    createdAt: raw.created_at ? String(raw.created_at).split('T')[0] : raw.createdAt || '2026-09-01',
  };
}

// ---------------- WATER BODIES API ----------------
export const waterBodiesApi = {
  getAll: async (city?: string, type?: string): Promise<WaterBody[] | null> => {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (type) params.append('type', type);
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await request<any[]>(`/water-bodies${query}`);
    return res ? res.map(normalizeWaterBody) : null;
  },

  getNearby: async (lat: number, lng: number, radiusMeters = 50000): Promise<WaterBody[] | null> => {
    const res = await request<any[]>(
      `/water-bodies/nearby?lat=${lat}&lng=${lng}&radius=${radiusMeters}`
    );
    return res ? res.map(normalizeWaterBody) : null;
  },

  getGeoJSON: async () => {
    return request<any>('/water-bodies/geojson');
  },

  getById: async (id: string): Promise<WaterBody | null> => {
    const res = await request<any>(`/water-bodies/${id}`);
    return res ? normalizeWaterBody(res) : null;
  },

  create: async (data: any): Promise<WaterBody | null> => {
    // Serialize frontend format to backend schema
    const payload = {
      id: data.id,
      name: data.name,
      local_name: data.localName || data.local_name,
      type: data.type,
      city: data.location?.city || data.city,
      state: data.location?.state || data.state,
      basin: data.location?.basin || data.basin || 'Local Catchment',
      latitude: data.location?.coordinates?.[0] ?? data.latitude,
      longitude: data.location?.coordinates?.[1] ?? data.longitude,
      description: data.description,
      historical_context: data.historicalContext || data.historical_context,
      dissolved_oxygen_mg_l: data.officialData?.dissolvedOxygenMgL ?? data.dissolved_oxygen_mg_l,
      ph: data.officialData?.ph ?? data.ph,
      bod_mg_l: data.officialData?.bodMgL ?? data.bod_mg_l,
      tds_mg_l: data.officialData?.tdsMgL ?? data.tds_mg_l,
      turbidity_ntu: data.officialData?.turbidityNtu ?? data.turbidity_ntu,
      official_source: data.officialData?.officialSource || data.official_source,
      compliance_status: data.officialData?.complianceStatus || data.compliance_status,
      quality_last_updated: data.officialData?.lastUpdated || data.quality_last_updated,
      pollution_severity: data.pollutionDetails?.severity || data.pollution_severity,
      primary_pollutants: data.pollutionDetails?.primaryPollutants || data.primary_pollutants || [],
      pollution_summary: data.pollutionDetails?.summary || data.pollution_summary,
      photos: data.photos || [],
      is_demo_data: data.is_demo_data ?? true,
    };
    const res = await request<any>('/water-bodies', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res ? normalizeWaterBody(res) : null;
  },

  addObservation: async (waterBodyId: string, observation: any): Promise<Observation | null> => {
    const payload = {
      user_id: observation.userId || observation.user_id,
      user_name: observation.userName || observation.user_name,
      user_avatar: observation.userAvatar || observation.user_avatar,
      category: observation.category,
      note: observation.note,
      photo_url: observation.photoUrl || observation.photo_url,
    };
    const res = await request<any>(`/water-bodies/${waterBodyId}/observations`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!res) return null;
    return {
      id: String(res.id || `obs-${Date.now()}`),
      userId: res.user_id || observation.userId,
      userName: res.user_name || observation.userName,
      userAvatar: res.user_avatar || observation.userAvatar,
      date: res.observed_at ? String(res.observed_at).split('T')[0] : new Date().toISOString().split('T')[0],
      note: res.note,
      photoUrl: res.photo_url,
      category: res.category,
      isCitizenReport: true,
    };
  },
};

// ---------------- AQUIFERS API ----------------
export const aquifersApi = {
  getAll: async (): Promise<Aquifer[] | null> => {
    const res = await request<any[]>('/aquifers');
    return res ? res.map(normalizeAquifer) : null;
  },
  getGeoJSON: async () => request<any>('/aquifers/geojson'),
  getById: async (id: string): Promise<Aquifer | null> => {
    const res = await request<any>(`/aquifers/${id}`);
    return res ? normalizeAquifer(res) : null;
  },
};

// ---------------- HEAT ZONES API ----------------
export const heatZonesApi = {
  getAll: async (city?: string): Promise<HeatZone[] | null> => {
    const query = city ? `?city=${encodeURIComponent(city)}` : '';
    const res = await request<any[]>(`/heat-zones${query}`);
    return res ? res.map(normalizeHeatZone) : null;
  },
  getGeoJSON: async () => request<any>('/heat-zones/geojson'),
  getById: async (id: string): Promise<HeatZone | null> => {
    const res = await request<any>(`/heat-zones/${id}`);
    return res ? normalizeHeatZone(res) : null;
  },
};

// ---------------- ENVIRONMENTAL REPORTS API ----------------
export const reportsApi = {
  getAll: async (category?: string, status?: string): Promise<EnvironmentalReport[] | null> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await request<any[]>(`/reports${query}`);
    return res ? res.map(normalizeReport) : null;
  },
  getGeoJSON: async () => request<any>('/reports/geojson'),
  getById: async (id: string): Promise<EnvironmentalReport | null> => {
    const res = await request<any>(`/reports/${id}`);
    return res ? normalizeReport(res) : null;
  },
  create: async (data: any): Promise<EnvironmentalReport | null> => {
    const payload = {
      id: data.id,
      title: data.title,
      category: data.category,
      description: data.description,
      location_name: data.location?.name || data.location_name || 'Catchment Site',
      city: data.location?.city || data.city || 'Pune',
      state: data.location?.state || data.state || 'Maharashtra',
      latitude: data.location?.coordinates?.[0] ?? data.latitude ?? 18.5204,
      longitude: data.location?.coordinates?.[1] ?? data.longitude ?? 73.8567,
      water_body_id: data.waterBodyId || data.water_body_id,
      photo_url: data.photoUrl || data.photo_url,
      submitted_by_user_id: data.userId || data.submitted_by_user_id || 'user-anon',
      submitted_by_user_name: data.userName || data.submitted_by_user_name || 'Citizen Observer',
      submitted_by_user_avatar: data.userAvatar || data.submitted_by_user_avatar,
      status: data.status || 'SUBMITTED',
      status_note: data.statusNote || data.status_note,
      is_demo_data: data.is_demo_data ?? true,
    };
    const res = await request<any>('/reports', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res ? normalizeReport(res) : null;
  },
  updateStatus: async (id: string, status: string, note?: string): Promise<EnvironmentalReport | null> => {
    const res = await request<any>(`/reports/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, status_note: note }),
    });
    return res ? normalizeReport(res) : null;
  },
};

// ---------------- COMMUNITIES API ----------------
export const communitiesApi = {
  getAll: async (city?: string): Promise<Community[] | null> => {
    const query = city ? `?city=${encodeURIComponent(city)}` : '';
    const res = await request<any[]>(`/communities${query}`);
    return res ? res.map(normalizeCommunity) : null;
  },
  getGeoJSON: async () => request<any>('/communities/geojson'),
  getById: async (id: string): Promise<Community | null> => {
    const res = await request<any>(`/communities/${id}`);
    return res ? normalizeCommunity(res) : null;
  },
  create: async (data: any): Promise<Community | null> => {
    const payload = {
      id: data.id,
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      focus_areas: data.focusAreas || data.focus_areas || ['water-body', 'groundwater'],
      city: data.location?.city || data.city || 'Pune',
      state: data.location?.state || data.state || 'Maharashtra',
      latitude: data.location?.coordinates?.[0] ?? data.latitude ?? 18.5204,
      longitude: data.location?.coordinates?.[1] ?? data.longitude ?? 73.8567,
      water_body_id: data.waterBodyId || data.water_body_id,
      created_by_user_id: data.created_by_user_id || data.adminIds?.[0] || 'user-1',
      photos: data.photos || [],
      announcements: data.announcements || [],
      is_demo_data: data.is_demo_data ?? true,
    };
    const res = await request<any>('/communities', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res ? normalizeCommunity(res) : null;
  },
  join: (communityId: string, role: string = 'volunteer') => {
    return request<any>(`/communities/${communityId}/join?role=${encodeURIComponent(role)}`, {
      method: 'POST',
    });
  },
  leave: (communityId: string) => {
    return request<any>(`/communities/${communityId}/join`, {
      method: 'DELETE',
    });
  },
  addPost: (communityId: string, post: { content: string; photo_url?: string }) => {
    return request<any>(`/communities/${communityId}/posts`, {
      method: 'POST',
      body: JSON.stringify(post),
    });
  },
  addComment: (
    communityId: string,
    postId: string,
    comment: { text: string }
  ) => {
    return request<any>(`/communities/${communityId}/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  },
};

// ---------------- ACTIVITIES API ----------------
export const activitiesApi = {
  getAll: async (category?: string, status?: string): Promise<Activity[] | null> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await request<any[]>(`/activities${query}`);
    return res ? res.map(normalizeActivity) : null;
  },
  getGeoJSON: async () => request<any>('/activities/geojson'),
  getById: async (id: string): Promise<Activity | null> => {
    const res = await request<any>(`/activities/${id}`);
    return res ? normalizeActivity(res) : null;
  },
  create: async (data: any): Promise<Activity | null> => {
    const payload = {
      id: data.id,
      community_id: data.communityId || data.community_id,
      water_body_id: data.waterBodyId || data.water_body_id,
      title: data.title,
      description: data.description,
      category: data.category,
      location_name: data.location?.name || data.location_name || 'Catchment Site',
      location_address: data.location?.address || data.location_address || 'Site Location',
      latitude: data.location?.coordinates?.[0] ?? data.latitude ?? 18.5204,
      longitude: data.location?.coordinates?.[1] ?? data.longitude ?? 73.8567,
      date: data.date,
      time: data.time,
      volunteer_limit: data.volunteerLimit || data.volunteer_limit || 30,
      status: data.status || 'upcoming',
      photos: data.photos || [],
      is_demo_data: data.is_demo_data ?? true,
    };
    const res = await request<any>('/activities', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res ? normalizeActivity(res) : null;
  },
  join: (activityId: string) => {
    return request<any>(`/activities/${activityId}/join`, {
      method: 'POST',
    });
  },
  leave: (activityId: string) => {
    return request<any>(`/activities/${activityId}/join`, {
      method: 'DELETE',
    });
  },
  recordImpact: (activityId: string, impact: any) => {
    return request<any>(`/activities/${activityId}/impact`, {
      method: 'POST',
      body: JSON.stringify(impact),
    });
  },
};

// ---------------- AUTHENTICATION API ----------------
export const authApi = {
  signup: async (data: {
    email: string;
    password: string;
    name: string;
    avatar?: string;
    city?: string;
    state?: string;
    neighborhood?: string;
    bio?: string;
    role?: string;
  }): Promise<{ success: boolean; data?: { token: string; user: User }; error?: string }> => {
    const res = await authRequest<any>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.success || !res.data) {
      return { success: false, error: res.error || 'Registration failed' };
    }
    const token = res.data.access_token;
    setAuthToken(token);
    const user = normalizeUser(res.data.user);
    return { success: true, data: { token, user } };
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; data?: { token: string; user: User }; error?: string }> => {
    const res = await authRequest<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (!res.success || !res.data) {
      return { success: false, error: res.error || 'Invalid email or password' };
    }
    const token = res.data.access_token;
    setAuthToken(token);
    const user = normalizeUser(res.data.user);
    return { success: true, data: { token, user } };
  },

  getMe: async (): Promise<User | null> => {
    const token = getAuthToken();
    if (!token) return null;
    const res = await request<any>('/auth/me');
    return res ? normalizeUser(res) : null;
  },

  logout: () => {
    clearAuthToken();
  },

  health: () => request<any>('/auth/health'),
  getToken: getAuthToken,
  setToken: setAuthToken,
  clearToken: clearAuthToken,
};

// ---------------- GEMINI AI API ----------------
export const aiApi = {
  explainReport: (report: { title: string; category: string; description: string; water_body_name?: string }) => {
    return request<any>('/ai/explain-report', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  },
  heatWaterSummary: (params: {
    city: string;
    current_temp_c: number;
    wet_bulb_temp_c: number;
    water_table_depth_m?: number;
  }) => {
    return request<any>('/ai/heat-water-summary', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
};

// ---------------- HEALTH CHECK API ----------------
export const healthApi = {
  check: () => request<{ status: string; database: string; postgis?: string }>('/health'),
};

