import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { MapLayer, WaterBody, Aquifer, HeatZone, Community, Activity, EnvironmentalReport } from '../../types';
import {
  Layers,
  Droplet,
  Flame,
  BookOpen,
  MapPin,
  Users,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Filter,
  Eye,
  Info,
} from 'lucide-react';

interface InteractiveMapProps {
  initialLayer?: MapLayer;
  selectedEntityId?: string | null;
  onSelectWaterBody?: (id: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  initialLayer,
  selectedEntityId,
  onSelectWaterBody,
}) => {
  const {
    mapLayer,
    setMapLayer,
    waterBodies,
    aquifers,
    heatZones,
    communities,
    activities,
    reports,
    navigateToWaterBody,
    navigateToCommunity,
    navigateToActivity,
    navigateToTopic,
    openReportModal,
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  // Overlay marker filters (NOT environmental layers, just visibility toggles for community points)
  const [showCommunities, setShowCommunities] = useState(true);
  const [showActivities, setShowActivities] = useState(true);
  const [showReports, setShowReports] = useState(true);

  // Selected item modal/drawer on map
  const [activeItem, setActiveItem] = useState<{
    type: 'water-body' | 'aquifer' | 'heat-zone' | 'community' | 'activity' | 'report';
    data: WaterBody | Aquifer | HeatZone | Community | Activity | EnvironmentalReport;
  } | null>(null);

  // Set layer if prop provided
  useEffect(() => {
    if (initialLayer) {
      setMapLayer(initialLayer);
    }
  }, [initialLayer, setMapLayer]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center map on Central India (approx [21.5, 78.5])
    const map = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false,
    });

    // Clean subtle basemap tiles (CartoDB Positron)
    
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
}).addTo(map);


    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map contents whenever layer or entities change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. RENDER STRICT ENVIRONMENTAL LAYER
    if (mapLayer === 'surface-water') {
      // SURFACE WATER LAYER: Rivers, Canals, Lakes, Ponds
      waterBodies.forEach((wb) => {
        const coords = wb?.coordinates || [18.5284, 73.8743];
        const [lat, lng] = coords;

        // Custom water icon
        const waterIcon = L.divIcon({
          className: 'custom-water-marker',
          html: `
            <div class="w-8 h-8 rounded-full bg-sky-500/90 border-2 border-white shadow-md flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([lat, lng], { icon: waterIcon }).addTo(group);

        marker.on('click', () => {
          setActiveItem({ type: 'water-body', data: wb });
        });

        // Add a soft water body influence ripple circle
        L.circle([lat, lng], {
          radius: 18000,
          color: '#0284c7',
          fillColor: '#38bdf8',
          fillOpacity: 0.15,
          weight: 1.5,
          dashArray: '4, 4',
        }).addTo(group);
      });
    } else if (mapLayer === 'aquifer') {
      // AQUIFER LAYER: Groundwater levels, stress, recharge potential
      aquifers.forEach((aq) => {
        const coords = aq?.coordinates || [18.5204, 73.8567];
        const [lat, lng] = coords;

        // Color based on CGWB stress category
        let color = '#10b981'; // Safe
        let fillColor = '#34d399';
        if (aq.cgwbCategory === 'Semi-Critical') {
          color = '#f59e0b';
          fillColor = '#fbbf24';
        } else if (aq.cgwbCategory === 'Critical') {
          color = '#ea580c';
          fillColor = '#fb923c';
        } else if (aq.cgwbCategory === 'Over-exploited') {
          color = '#dc2626';
          fillColor = '#f87171';
        }

        // Broad regional aquifer basin polygon circle
        const aquiferZone = L.circle([lat, lng], {
          radius: 85000,
          color: color,
          fillColor: fillColor,
          fillOpacity: 0.22,
          weight: 2,
        }).addTo(group);

        aquiferZone.on('click', () => {
          setActiveItem({ type: 'aquifer', data: aq });
        });

        // Center well / aquifer node marker
        const aquiferIcon = L.divIcon({
          className: 'custom-aquifer-marker',
          html: `
            <div class="px-2.5 py-1 rounded-md text-xs font-semibold shadow-md flex items-center gap-1 cursor-pointer border border-white" style="background-color: ${color}; color: white;">
              <span>${aq.currentWaterTableBglMeters}m bgl</span>
            </div>
          `,
          iconSize: [68, 26],
          iconAnchor: [34, 13],
        });

        const marker = L.marker([lat, lng], { icon: aquiferIcon }).addTo(group);
        marker.on('click', () => {
          setActiveItem({ type: 'aquifer', data: aq });
        });
      });
    } else if (mapLayer === 'heat-map') {
      // HEAT MAP: Temperature, Heat Risk, Wet-Bulb, IMD Alerts
      heatZones.forEach((hz) => {
        const coords = hz?.coordinates || [18.5204, 73.8567];
        const [lat, lng] = coords;

        let circleColor = '#f97316';
        let fillColor = '#fdba74';
        if (hz.riskLevel === 'Severe Heatwave' || hz.imdAlert === 'Red' || hz.imdAlert === 'Orange') {
          circleColor = '#dc2626';
          fillColor = '#f87171';
        } else if (hz.riskLevel === 'Moderate') {
          circleColor = '#eab308';
          fillColor = '#fde047';
        }

        // Thermal radiation heat island zone
        const heatCircle = L.circle([lat, lng], {
          radius: 65000,
          color: circleColor,
          fillColor: fillColor,
          fillOpacity: 0.35,
          weight: 2.5,
        }).addTo(group);

        heatCircle.on('click', () => {
          setActiveItem({ type: 'heat-zone', data: hz });
        });

        const heatIcon = L.divIcon({
          className: 'custom-heat-marker',
          html: `
            <div class="w-10 h-10 rounded-full shadow-lg flex flex-col items-center justify-center text-white cursor-pointer border-2 border-white font-mono font-bold text-xs" style="background-color: ${circleColor};">
              <span>${hz.currentTempC}°</span>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const marker = L.marker([lat, lng], { icon: heatIcon }).addTo(group);
        marker.on('click', () => {
          setActiveItem({ type: 'heat-zone', data: hz });
        });
      });
    }

    // 2. OVERLAY USER COMMUNITIES, ACTIVITIES & CITIZEN REPORTS
    // (As required by spec: these appear as markers/interactive objects, NOT environmental layers)

    if (showCommunities) {
      communities.forEach((comm) => {
        const coords = comm?.location?.coordinates || [18.5204, 73.8567];
        const [lat, lng] = coords;
        const commIcon = L.divIcon({
          className: 'comm-pin',
          html: `
            <div class="w-6 h-6 rounded-full bg-emerald-600 border border-white shadow-sm flex items-center justify-center text-white cursor-pointer hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([lat, lng], { icon: commIcon }).addTo(group);
        marker.on('click', () => {
          setActiveItem({ type: 'community', data: comm });
        });
      });
    }

    if (showActivities) {
      activities.forEach((act) => {
        const coords = act?.location?.coordinates || [18.5204, 73.8567];
        const [lat, lng] = coords;
        const actIcon = L.divIcon({
          className: 'act-pin',
          html: `
            <div class="w-6 h-6 rounded-full bg-indigo-600 border border-white shadow-sm flex items-center justify-center text-white cursor-pointer hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([lat, lng], { icon: actIcon }).addTo(group);
        marker.on('click', () => {
          setActiveItem({ type: 'activity', data: act });
        });
      });
    }

    if (showReports) {
      reports.forEach((rep) => {
        const coords = rep?.location?.coordinates || [18.5204, 73.8567];
        const [lat, lng] = coords;
        const repIcon = L.divIcon({
          className: 'rep-pin',
          html: `
            <div class="w-5 h-5 rounded-full bg-amber-500 border border-white shadow-xs flex items-center justify-center text-white cursor-pointer hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([lat, lng], { icon: repIcon }).addTo(group);
        marker.on('click', () => {
          setActiveItem({ type: 'report', data: rep });
        });
      });
    }
  }, [mapLayer, waterBodies, aquifers, heatZones, communities, activities, reports, showCommunities, showActivities, showReports]);

  // Center on water body if requested
  useEffect(() => {
    if (selectedEntityId && mapInstanceRef.current) {
      const wb = waterBodies.find((w) => w.id === selectedEntityId);
      if (wb) {
        mapInstanceRef.current.flyTo(wb.coordinates, 10, { duration: 1.2 });
        setActiveItem({ type: 'water-body', data: wb });
      }
    }
  }, [selectedEntityId, waterBodies]);

  // Educational prompt contextual triggers
  const getEducationPrompt = () => {
    if (mapLayer === 'surface-water') {
      return {
        question: 'Why does surface water matter?',
        topicId: 'edu-surface-water',
        description: 'Understand how interconnected river cascades buffer droughts and recharge local water tables.',
      };
    }
    if (mapLayer === 'aquifer') {
      return {
        question: 'What is an aquifer?',
        topicId: 'edu-groundwater-aquifers',
        description: 'Discover how water is stored in rock pores, why borewells dry up, and how rainfall recharges aquifers.',
      };
    }
    return {
      question: 'Why does heat affect water?',
      topicId: 'edu-heat-water',
      description: 'Learn how extreme summer heat accelerates evaporative loss and causes critical groundwater pumping surges.',
    };
  };

  const eduPrompt = getEducationPrompt();

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden bg-slate-100">
      {/* MAP CONTROLS & THREE STRICT ENVIRONMENTAL LAYERS SWITCHER */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 max-w-sm w-full">
        {/* EXACT THREE ENVIRONMENTAL LAYERS TABS */}
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-md">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
            <span>3 Environmental Layers</span>
            <span className="text-slate-400">Official Data</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setMapLayer('surface-water')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
                mapLayer === 'surface-water'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Droplet className="w-3.5 h-3.5" />
              <span>Surface Water</span>
            </button>

            <button
              onClick={() => setMapLayer('aquifer')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
                mapLayer === 'aquifer'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Aquifer</span>
            </button>

            <button
              onClick={() => setMapLayer('heat-map')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
                mapLayer === 'heat-map'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Heat Map</span>
            </button>
          </div>
        </div>

        {/* DIRECT EDUCATION LINK CONNECTED TO THE CURRENT LAYER */}
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-teal-50 text-teal-700 rounded-lg shrink-0 mt-0.5">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <button
                onClick={() => navigateToTopic(eduPrompt.topicId)}
                className="text-xs font-bold text-teal-900 hover:text-teal-700 hover:underline text-left block"
              >
                {eduPrompt.question}
              </button>
              <div className="text-[11px] text-slate-500 leading-snug">
                {eduPrompt.description}
              </div>
            </div>
          </div>
          <button
            onClick={() => navigateToTopic(eduPrompt.topicId)}
            className="p-1.5 text-teal-700 hover:bg-teal-50 rounded-lg transition-colors shrink-0"
            title="Read education module"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* OVERLAY MARKERS TOGGLE (Communities, Activities, Reports) */}
        <div className="bg-white/95 backdrop-blur-md p-2 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs text-slate-600">
          <span className="text-[11px] font-semibold text-slate-500 uppercase px-1">Markers:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowCommunities(!showCommunities)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                showCommunities ? 'bg-emerald-50 text-emerald-800' : 'text-slate-400 line-through'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Groups ({communities.length})</span>
            </button>

            <button
              onClick={() => setShowActivities(!showActivities)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                showActivities ? 'bg-indigo-50 text-indigo-800' : 'text-slate-400 line-through'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>Action ({activities.length})</span>
            </button>

            <button
              onClick={() => setShowReports(!showReports)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                showReports ? 'bg-amber-50 text-amber-800' : 'text-slate-400 line-through'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Alerts ({reports.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK FLOATING ACTION */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => openReportModal()}
          className="bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 shadow-md flex items-center gap-1.5 transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Report Map Issue</span>
        </button>
      </div>

      {/* LEAFLET CANVAS */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* ITEM DETAIL SIDE DRAWER / MODAL */}
      {activeItem && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:top-4 md:bottom-4 md:w-96 z-30 bg-white border border-slate-200 rounded-xl shadow-2xl p-5 overflow-y-auto flex flex-col justify-between max-h-[85vh] md:max-h-none">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {activeItem.type === 'water-body' && (
                  <>
                    <Droplet className="w-4 h-4 text-sky-600" />
                    <span>Surface Water Body</span>
                  </>
                )}
                {activeItem.type === 'aquifer' && (
                  <>
                    <Layers className="w-4 h-4 text-emerald-700" />
                    <span>Aquifer & Groundwater</span>
                  </>
                )}
                {activeItem.type === 'heat-zone' && (
                  <>
                    <Flame className="w-4 h-4 text-rose-600" />
                    <span>Heat Risk Area</span>
                  </>
                )}
                {activeItem.type === 'community' && (
                  <>
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Citizen Community</span>
                  </>
                )}
                {activeItem.type === 'activity' && (
                  <>
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>Real-World Activity</span>
                  </>
                )}
                {activeItem.type === 'report' && (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Citizen Report</span>
                  </>
                )}
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="text-slate-400 hover:text-slate-700 p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* WATER BODY DETAIL */}
            {activeItem.type === 'water-body' && (() => {
              const wb = activeItem.data as WaterBody;
              return (
                <div className="space-y-4">
                  {wb.photos.length > 0 && (
                    <img
                      src={wb.photos[0]}
                      alt={wb.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-36 object-cover rounded-lg border border-slate-200"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-display">{wb.name}</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{wb.type.toUpperCase()}</span>
                      <span aria-hidden="true">·</span>
                      <span>{wb.location.city}, {wb.location.state}</span>
                      <span aria-hidden="true">·</span>
                      <span>{wb.location.basin}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{wb.description}</p>

                  {/* OFFICIAL WATER QUALITY DATA */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                        Official Water Quality Data
                      </span>
                      <span className="text-[10px] text-slate-400">CPCB / NWMP</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Dissolved Oxygen (DO)</span>
                        <span className="font-mono font-semibold text-slate-800">
                          {wb.officialData.dissolvedOxygenMgL} mg/L
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">BOD (Organic Load)</span>
                        <span className="font-mono font-semibold text-slate-800">
                          {wb.officialData.bodMgL} mg/L
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">pH Balance</span>
                        <span className="font-mono font-semibold text-slate-800">
                          {wb.officialData.ph}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Total Dissolved Solids</span>
                        <span className="font-mono font-semibold text-slate-800">
                          {wb.officialData.tdsMgL} mg/L
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* POLLUTION DETAILS */}
                  <div>
                    <div className="text-xs font-semibold text-slate-800 mb-1">Pollution Assessment</div>
                    <div className="text-xs text-slate-600 mb-2">{wb.pollutionDetails.summary}</div>
                    <div className="flex flex-wrap gap-1 text-[11px] text-slate-500">
                      {wb.pollutionDetails.primaryPollutants.map((p, i) => (
                        <span key={i} className="text-slate-600">
                          {p}{i < wb.pollutionDetails.primaryPollutants.length - 1 ? ' · ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CITIZEN OBSERVATION COUNT */}
                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span>{wb.reportCount} citizen reports</span>
                    <span aria-hidden="true">·</span>
                    <span>{wb.activityCount} community actions</span>
                  </div>
                </div>
              );
            })()}

            {/* AQUIFER DETAIL */}
            {activeItem.type === 'aquifer' && (() => {
              const aq = activeItem.data as Aquifer;
              return (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-display">{aq.name}</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{aq.hydrogeologyType}</span>
                      <span aria-hidden="true">·</span>
                      <span>{aq.region}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{aq.description}</p>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-2">
                      CGWB Groundwater Metrics
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">CGWB Status</span>
                        <span className="font-semibold text-slate-800">{aq.cgwbCategory}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Water Table Depth</span>
                        <span className="font-mono font-semibold text-slate-800">
                          {aq.currentWaterTableBglMeters} m bgl
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">10-Yr Trend</span>
                        <span className="font-semibold text-slate-800">{aq.tenYearTrend}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Infiltration Rate</span>
                        <span className="font-mono font-semibold text-slate-800">
                          {aq.soilInfiltrationRateMmHr} mm/hr
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-800 mb-1">Safe Recharge Practices</div>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                      {aq.safeRechargePractices.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900">
                    <div className="font-bold flex items-center gap-1 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Risks & Warnings</span>
                    </div>
                    <div className="text-[11px] leading-relaxed">
                      {aq.risksAndWarnings[0]}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* HEAT ZONE DETAIL */}
            {activeItem.type === 'heat-zone' && (() => {
              const hz = activeItem.data as HeatZone;
              return (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-display">{hz.city}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">{hz.areaName}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-sans">Current Temp</span>
                      <span className="text-lg font-bold text-rose-600">{hz.currentTempC}°C</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block font-sans">Feels Like</span>
                      <span className="text-lg font-bold text-slate-800">{hz.feelsLikeC}°C</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block font-sans">Wet-Bulb</span>
                      <span className="text-lg font-bold text-amber-600">{hz.wetBulbTempC}°C</span>
                    </div>
                  </div>

                  <div className="text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-700">
                      <span>IMD Heat Alert:</span>
                      <span className="font-bold">{hz.imdAlert} Alert ({hz.riskLevel})</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span>Water Stress Multiplier:</span>
                      <span className="font-bold text-rose-700">{hz.waterStressMultiplier}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span>Peak Risk Window:</span>
                      <span className="font-mono text-slate-800">{hz.peakHours}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-800 mb-1.5">
                      Community Cooling Interventions
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      {hz.communityCoolingTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">·</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}

            {/* COMMUNITY DETAIL */}
            {activeItem.type === 'community' && (() => {
              const comm = activeItem.data as Community;
              return (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-display">{comm.name}</h3>
                    <div className="text-xs text-slate-500">{comm.location.city}, {comm.location.state}</div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{comm.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Members</span>
                      <span className="font-semibold text-slate-800 tabular-nums">{comm.impact.membersCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Activities Completed</span>
                      <span className="font-semibold text-slate-800 tabular-nums">{comm.impact.activitiesCompleted}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ACTIVITY DETAIL */}
            {activeItem.type === 'activity' && (() => {
              const act = activeItem.data as Activity;
              return (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-display">{act.title}</h3>
                    <div className="text-xs text-slate-500">{act.communityName} · {act.category}</div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{act.description}</p>
                  <div className="text-xs space-y-1 text-slate-700">
                    <div><strong>Date & Time:</strong> {act.date} ({act.time})</div>
                    <div><strong>Location:</strong> {act.location.name}</div>
                    <div><strong>Volunteers:</strong> {act.participants.length} / {act.volunteerLimit}</div>
                  </div>
                </div>
              );
            })()}

            {/* CITIZEN REPORT DETAIL */}
            {activeItem.type === 'report' && (() => {
              const rep = activeItem.data as EnvironmentalReport;
              return (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-display">{rep.title}</h3>
                    <div className="text-xs text-slate-500">
                      Reported by {rep.userName} · {new Date(rep.submittedAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  <div className="inline-block text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    Status: {rep.status}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rep.description}</p>
                  {rep.photoUrl && (
                    <img
                      src={rep.photoUrl}
                      alt={rep.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-32 object-cover rounded-lg border border-slate-200"
                    />
                  )}
                  {rep.statusNote && (
                    <div className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded border border-amber-200">
                      <strong>Ground note:</strong> {rep.statusNote}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* ACTION BUTTONS AT BOTTOM OF DRAWER */}
          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 mt-4">
            {activeItem.type === 'water-body' && (
              <>
                <button
                  onClick={() => {
                    const wb = activeItem.data as WaterBody;
                    if (onSelectWaterBody) {
                      onSelectWaterBody(wb.id);
                    } else {
                      navigateToWaterBody(wb.id);
                    }
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors text-center"
                >
                  View Full Water Body Page
                </button>
                <button
                  onClick={() => {
                    const wb = activeItem.data as WaterBody;
                    openReportModal(wb.id);
                  }}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Report Issue
                </button>
              </>
            )}

            {activeItem.type === 'aquifer' && (
              <button
                onClick={() => navigateToTopic('edu-groundwater-aquifers')}
                className="w-full py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors text-center"
              >
                Learn About This Aquifer System
              </button>
            )}

            {activeItem.type === 'heat-zone' && (
              <button
                onClick={() => navigateToTopic('edu-heat-water')}
                className="w-full py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors text-center"
              >
                Learn Heat-Water Dynamics
              </button>
            )}

            {activeItem.type === 'community' && (
              <button
                onClick={() => {
                  const comm = activeItem.data as Community;
                  navigateToCommunity(comm.id);
                }}
                className="w-full py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors text-center"
              >
                Open Community Page
              </button>
            )}

            {activeItem.type === 'activity' && (
              <button
                onClick={() => {
                  const act = activeItem.data as Activity;
                  navigateToActivity(act.id);
                }}
                className="w-full py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors text-center"
              >
                View Activity & Join Roster
              </button>
            )}

            {activeItem.type === 'report' && (
              <button
                onClick={() => {
                  openReportModal();
                }}
                className="w-full py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
              >
                Add Follow-up Observation
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
