import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSET_IMAGES } from '../../data/seedData';
import { aiApi } from '../../services/api';
import {
  Flame,
  Droplet,
  Layers,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Plus,
  Users,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  TrendingDown,
  SunMedium,
  Wind,
  Sparkles,
  Loader2,
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const {
    currentUser,
    setNavTab,
    setMapLayer,
    waterBodies,
    aquifers,
    heatZones,
    communities,
    activities,
    reports,
    selectedCity,
    setSelectedCity,
    navigateToWaterBody,
    navigateToCommunity,
    navigateToActivity,
    navigateToTopic,
    openReportModal,
  } = useApp();

  const [heatWaterInsight, setHeatWaterInsight] = useState<{
    heat_water_nexus_explanation: string;
    risk_level_interpretation: string;
    community_cooling_recommendations: string[];
    is_ai_analysis?: boolean;
  } | null>(null);
  const [isLoadingNexus, setIsLoadingNexus] = useState(false);

  // Fallback environmental models if region has unmapped telemetry
  const fallbackHeatZone = heatZones[0] || {
    id: 'hz-fallback',
    city: selectedCity,
    areaName: 'Urban Zone',
    coordinates: [18.5204, 73.8567] as [number, number],
    currentTempC: 38.5,
    feelsLikeC: 41.2,
    wetBulbTempC: 28.1,
    relativeHumidityPercent: 46,
    riskLevel: 'Moderate' as const,
    imdAlert: 'Yellow' as const,
    urbanCanopyPercent: 14,
    imperviousSurfacePercent: 72,
    waterStressMultiplier: '1.8x Heavy Stress' as const,
    peakHours: '12:00 PM – 04:30 PM',
    communityCoolingTips: ['Maintain active community water points', 'Provide covered shade around public wells'],
    nearbyCoolingCentres: [],
    officialSource: 'India Meteorological Department (IMD)',
  };

  const fallbackAquifer = aquifers[0] || {
    id: 'aq-fallback',
    name: 'Regional Shallow Aquifer System',
    hydrogeologyType: 'Basaltic (Deccan Traps)' as const,
    region: selectedCity,
    coordinates: [18.5204, 73.8567] as [number, number],
    cgwbCategory: 'Semi-Critical' as const,
    currentWaterTableBglMeters: 18.2,
    tenYearTrend: 'Declining' as const,
    trendRateMetersPerYear: 0.35,
    rechargePotential: 'Moderate' as const,
    soilInfiltrationRateMmHr: 22,
    safeRechargePractices: ['De-silt recharge pits before pre-monsoon showers', 'Maintain dual-chamber settlement filters'],
    risksAndWarnings: ['Borewell abstraction rates exceed natural aquifer recharge'],
    officialSource: 'Central Ground Water Board (CGWB)',
    description: 'Subsurface fractured rock aquifer formation.',
  };

  // Find local environmental context based on selected city with safe null guards
  const localHeat =
    heatZones.find((h) => h?.city && h.city.toLowerCase().includes(selectedCity.toLowerCase())) ||
    fallbackHeatZone;

  const localWaterBodies = waterBodies.filter(
    (w) => w?.location?.city && w.location.city.toLowerCase() === selectedCity.toLowerCase()
  );

  const localCommunities = communities.filter(
    (c) => c?.location?.city && c.location.city.toLowerCase() === selectedCity.toLowerCase()
  );

  const upcomingActivities = activities.filter((a) => a?.status === 'upcoming').slice(0, 3);
  const recentReports = reports.slice(0, 3);

  // Relevant regional aquifer for selected city
  const localAquifer =
    aquifers.find((a) => a?.region && a.region.toLowerCase().includes(selectedCity.toLowerCase())) ||
    fallbackAquifer;

  const handleAnalyzeNexus = async () => {
    setIsLoadingNexus(true);
    try {
      const res = await aiApi.heatWaterSummary({
        city: selectedCity,
        current_temp_c: localHeat.currentTempC,
        wet_bulb_temp_c: localHeat.wetBulbTempC,
        water_table_depth_m: localAquifer?.currentWaterTableBglMeters,
      });
      if (res) {
        setHeatWaterInsight(res);
      }
    } catch (err) {
      console.warn('Nexus analysis fallback:', err);
    } finally {
      setIsLoadingNexus(false);
    }
  };

  const cityOptions = ['Pune', 'Bengaluru', 'Delhi NCR', 'Hyderabad', 'Jaipur', 'Nagpur'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-10">
      {/* HERO BANNER SECTION */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 text-white">
        <img
          src={ASSET_IMAGES.heroWaterCommunity}
          alt="Community Water Resilience India"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="relative z-10 p-6 sm:p-10 md:p-12 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-300 uppercase tracking-wider mb-2">
            <span>Community-Led Heat & Water Resilience</span>
            <span aria-hidden="true">·</span>
            <span>India</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight leading-tight mb-4">
            Do not wait for action. Restore our waters together.
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6 font-sans">
            Understand local aquifers, rivers, and summer heatwaves in your neighborhood. Connect with local citizen collectives, organize safe real-world conservation, and document tangible before-and-after change.
          </p>

          {/* CORE ACTION SHORTCUTS (Clear, actionable, non-pill) */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setMapLayer('surface-water');
                setNavTab('maps');
              }}
              className="px-4 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors shadow-xs"
            >
              Explore Map
            </button>
            <button
              onClick={() => setNavTab('communities')}
              className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors shadow-xs"
            >
              Join a Community
            </button>
            <button
              onClick={() => setNavTab('education')}
              className="px-4 py-2 text-xs font-bold text-teal-100 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
            >
              Education Guide
            </button>
            <button
              onClick={() => openReportModal()}
              className="px-4 py-2 text-xs font-bold text-amber-200 hover:text-white bg-amber-950/70 hover:bg-amber-900/80 rounded-lg border border-amber-800/50 transition-colors flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Report Issue</span>
            </button>
          </div>
        </div>
      </div>

      {/* LOCALIZED OVERVIEW BAR WITH CITY SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Local Environmental Conditions Overview
          </h2>
          <div className="text-xs text-slate-500">
            Real-time heat, surface water, and groundwater stress for your catchment
          </div>
        </div>

        {/* CITY SELECTOR */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Select Region:</span>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 shadow-xs cursor-pointer focus:outline-teal-600"
          >
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* THREE BALANCED ENVIRONMENTAL PILLARS (Heat, Surface Water, Groundwater) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PILLAR 1: CURRENT HEAT CONDITIONS */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-rose-400 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
              <span className="font-semibold text-rose-800 uppercase tracking-wide flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-600" />
                Heat Conditions
              </span>
              <span className="font-mono text-[11px] font-semibold text-rose-700">
                {localHeat.imdAlert} Alert
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-2 font-mono">
              <span className="text-4xl font-extrabold text-slate-900">
                {localHeat.currentTempC}°C
              </span>
              <span className="text-xs text-slate-500 font-sans">
                Feels like {localHeat.feelsLikeC}°C
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 mb-4">
              <div className="flex items-center justify-between">
                <span>Wet-Bulb Temperature:</span>
                <span className="font-mono font-semibold text-slate-800">{localHeat.wetBulbTempC}°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Water Demand Multiplier:</span>
                <span className="font-semibold text-rose-700">{localHeat.waterStressMultiplier}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Peak Thermal Hours:</span>
                <span className="font-mono text-slate-700">{localHeat.peakHours}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
              {localHeat.communityCoolingTips?.[0] || 'Stay hydrated and protect open water bodies during peak thermal hours.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
            <button
              onClick={() => {
                setMapLayer('heat-map');
                setNavTab('maps');
              }}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1"
            >
              <span>Explore Heat Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigateToTopic('edu-heat-water')}
              className="text-[11px] text-slate-500 hover:text-teal-800"
            >
              Why Heat Affects Water?
            </button>
          </div>
        </div>

        {/* PILLAR 2: SURFACE WATER CONDITIONS */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-sky-400 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
              <span className="font-semibold text-sky-800 uppercase tracking-wide flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-sky-600" />
                Surface Water
              </span>
              <span className="text-[11px] font-semibold text-sky-700">
                {localWaterBodies.length} Water Bodies Monitored
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-2 font-mono">
              <span className="text-2xl font-bold text-slate-900 font-sans">
                {localWaterBodies[0]?.name?.split('(')[0] || 'Regional Catchment'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 mb-4">
              <div className="flex items-center justify-between">
                <span>Dissolved Oxygen (DO):</span>
                <span className="font-mono font-semibold text-slate-800">
                  {localWaterBodies[0]?.officialData?.dissolvedOxygenMgL ?? 4.2} mg/L
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>BOD Pollution Index:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {localWaterBodies[0]?.officialData?.bodMgL ?? 7.5} mg/L
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Water Quality Compliance:</span>
                <span className="font-semibold text-amber-700">
                  {localWaterBodies[0]?.officialData?.complianceStatus || 'Moderate Concern'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
              {localWaterBodies[0]?.pollutionDetails?.summary || 'Catchment subject to urban greywater inflows and seasonal siltation.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
            <button
              onClick={() => {
                if (localWaterBodies[0]) {
                  navigateToWaterBody(localWaterBodies[0].id);
                } else {
                  setMapLayer('surface-water');
                  setNavTab('maps');
                }
              }}
              className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1"
            >
              <span>View Water Body Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigateToTopic('edu-surface-water')}
              className="text-[11px] text-slate-500 hover:text-teal-800"
            >
              Why Surface Water Matters?
            </button>
          </div>
        </div>

        {/* PILLAR 3: GROUNDWATER & AQUIFER STRESS */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-400 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
              <span className="font-semibold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-700" />
                Aquifer Status
              </span>
              <span className="text-[11px] font-semibold text-emerald-800">
                CGWB: {localAquifer.cgwbCategory || 'Semi-Critical'}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-2 font-mono">
              <span className="text-4xl font-extrabold text-slate-900">
                {localAquifer.currentWaterTableBglMeters}m
              </span>
              <span className="text-xs text-slate-500 font-sans">
                below ground level (bgl)
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 mb-4">
              <div className="flex items-center justify-between">
                <span>Hydrogeology:</span>
                <span className="font-medium text-slate-800">{(localAquifer.hydrogeologyType || 'Basaltic').split('(')[0]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>10-Year Water Table Trend:</span>
                <span className="font-semibold text-rose-700 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  {localAquifer.tenYearTrend} (-{localAquifer.trendRateMetersPerYear}m/yr)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Recharge Infiltration Rate:</span>
                <span className="font-mono text-slate-800">{localAquifer.soilInfiltrationRateMmHr} mm/hr</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
              {localAquifer.safeRechargePractices?.[0] || 'De-silt recharge pits before pre-monsoon showers.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
            <button
              onClick={() => {
                setMapLayer('aquifer');
                setNavTab('maps');
              }}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              <span>Explore Aquifer Layer</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigateToTopic('edu-groundwater-aquifers')}
              className="text-[11px] text-slate-500 hover:text-teal-800"
            >
              What is an Aquifer?
            </button>
          </div>
        </div>
      </div>

      {/* NATURAL CONNECTION: COUPLED HEAT & WATER RESILIENCE NEXUS */}
      <div className="bg-linear-to-r from-amber-50/80 via-white to-teal-50/80 border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Coupled Heat & Water Nexus Analysis · {selectedCity}
              </h3>
              <p className="text-xs text-slate-500">
                How summer heat and aquifer depletion reinforce each other in this catchment
              </p>
            </div>
          </div>

          <button
            onClick={handleAnalyzeNexus}
            disabled={isLoadingNexus}
            className="px-3.5 py-2 text-xs font-bold text-teal-900 bg-white border border-teal-300 hover:bg-teal-50 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
          >
            {isLoadingNexus ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-700" />
                <span>Generating Scientific Nexus...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>{heatWaterInsight ? 'Refresh AI Nexus Insight' : 'Analyze Heat-Water Nexus with AI'}</span>
              </>
            )}
          </button>
        </div>

        {heatWaterInsight ? (
          <div className="mt-4 space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Thermal Risk Assessment:
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                {heatWaterInsight.risk_level_interpretation}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-sans bg-white/80 p-4 rounded-xl border border-slate-200">
              {heatWaterInsight.heat_water_nexus_explanation}
            </p>

            <div>
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block mb-2">
                Immediate Community Cooling & Water Protection Recommendations:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {heatWaterInsight.community_cooling_recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-lg border border-teal-200 text-xs text-slate-700 flex items-start gap-2 shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-3">
            <p>
              When ambient temperatures rise beyond 40°C, open water bodies lose up to 10mm daily to evaporation while municipal abstraction surges 35%. Click to run a coupled hydrological model with Gemini AI.
            </p>
            <button
              onClick={() => navigateToTopic('edu-heat-water')}
              className="text-teal-700 hover:text-teal-900 font-semibold underline shrink-0"
            >
              Learn the science →
            </button>
          </div>
        )}
      </div>

      {/* UPCOMING REAL-WORLD ACTIVITIES & NEIGHBORHOOD COMMUNITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* UPCOMING ACTIVITIES */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-700" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Upcoming Community Conservation Events
              </h3>
            </div>
            <button
              onClick={() => setNavTab('activities')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-0.5"
            >
              <span>All Activities</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingActivities.map((act) => (
              <div
                key={act.id}
                onClick={() => navigateToActivity(act.id)}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-indigo-500 cursor-pointer transition-colors bg-slate-50/50 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wide">
                    {act.category.replace('-', ' ')} · {act.date}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5">{act.title}</h4>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {act.location?.name || 'Catchment Site'} · {act.participants?.length ?? 0} / {act.volunteerLimit || 30} volunteers
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToActivity(act.id);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded shrink-0"
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* NEARBY COMMUNITIES */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Nearby Citizen Collectives ({communities.length})
              </h3>
            </div>
            <button
              onClick={() => setNavTab('communities')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {communities.slice(0, 3).map((comm) => (
              <div
                key={comm.id}
                onClick={() => navigateToCommunity(comm.id)}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-teal-500 cursor-pointer transition-colors bg-slate-50/50 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="text-[10px] font-semibold text-teal-800 uppercase tracking-wide">
                    {comm.location?.city || 'Local Region'}, {comm.location?.state || 'India'}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5">{comm.name}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{comm.tagline}</p>
                </div>
                <span className="text-xs text-slate-500 shrink-0 font-medium">
                  {comm.impact?.membersCount ?? comm.members?.length ?? 1} members
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT FIELD OBSERVATIONS & COMMUNITY LOGS */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Recent Citizen Environmental Observations
            </h3>
          </div>
          <button
            onClick={() => openReportModal()}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800"
          >
            + Log New Observation
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentReports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span className="uppercase font-semibold">{rep.category.replace('-', ' ')}</span>
                  <span className="font-semibold text-slate-700">{rep.status}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">{rep.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {rep.description}
                </p>
              </div>

              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span>By {rep.userName}</span>
                <span>{new Date(rep.submittedAt).toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
