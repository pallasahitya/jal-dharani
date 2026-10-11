import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WaterBody, Observation } from '../../types';
import {
  Droplets,
  ArrowLeft,
  AlertTriangle,
  Upload,
  Users,
  Calendar,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  ChevronRight,
} from 'lucide-react';

interface WaterBodyDetailProps {
  waterBodyId: string;
  onBack: () => void;
}

export const WaterBodyDetail: React.FC<WaterBodyDetailProps> = ({ waterBodyId, onBack }) => {
  const {
    waterBodies,
    communities,
    activities,
    reports,
    openReportModal,
    addWaterBodyObservation,
    navigateToCommunity,
    navigateToActivity,
    navigateToTopic,
    joinCommunity,
    currentUser,
  } = useApp();

  const waterBody = waterBodies.find((wb) => wb.id === waterBodyId);

  // Local state for adding quick citizen field observation
  const [isObservationFormOpen, setIsObservationFormOpen] = useState(false);
  const [obsNote, setObsNote] = useState('');
  const [obsCategory, setObsCategory] = useState<Observation['category']>('water-clarity');
  const [obsPhotoUrl, setObsPhotoUrl] = useState('');

  if (!waterBody) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="text-slate-600 mb-4">Water body not found.</div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg"
        >
          Return to Map
        </button>
      </div>
    );
  }

  // Related communities and activities
  const relatedCommunities = communities.filter(
    (c) =>
      c.waterBodyId === waterBody.id ||
      (c?.location?.city && waterBody?.location?.city && c.location.city.toLowerCase() === waterBody.location.city.toLowerCase())
  );
  const relatedActivities = activities.filter(
    (a) =>
      a.waterBodyId === waterBody.id ||
      (a?.location?.name && a.location.name.toLowerCase().includes(waterBody.name.toLowerCase()))
  );
  const relatedReports = reports.filter((r) => r.waterBodyId === waterBody.id);

  const handleObservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!obsNote.trim()) return;

    addWaterBodyObservation(waterBody.id, {
      note: obsNote,
      category: obsCategory,
      photoUrl: obsPhotoUrl.trim() || undefined,
    });

    setObsNote('');
    setObsPhotoUrl('');
    setIsObservationFormOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* TOP BREADCRUMB & BACK BUTTON */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Interactive Map</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openReportModal(waterBody.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Report Water Issue</span>
          </button>

          <button
            onClick={() => setIsObservationFormOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Observation</span>
          </button>
        </div>
      </div>

      {/* HEADER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 text-xs text-teal-800 font-semibold uppercase tracking-wider mb-1">
            <span>{waterBody.type}</span>
            <span aria-hidden="true">·</span>
            <span>{waterBody.location.city}, {waterBody.location.state}</span>
            <span aria-hidden="true">·</span>
            <span>{waterBody.location.basin}</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 font-display mb-2">
            {waterBody.name}
            {waterBody.localName && (
              <span className="text-xl font-normal text-slate-500 ml-2 font-sans">
                ({waterBody.localName})
              </span>
            )}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-3xl">
            {waterBody.description}
          </p>

          {waterBody.historicalContext && (
            <div className="p-4 bg-teal-50/50 border border-teal-200/60 rounded-xl text-xs text-teal-950 mb-6">
              <span className="font-bold text-teal-900 block mb-1">Historical & Ecological Context:</span>
              <p className="leading-relaxed">{waterBody.historicalContext}</p>
            </div>
          )}

          {/* QUICK ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigateToTopic('edu-water-pollution')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-teal-800 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Learn About Water Pollution</span>
            </button>

            <button
              onClick={() => navigateToTopic('edu-surface-water')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-teal-800 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Droplets className="w-4 h-4 text-sky-600" />
              <span>Cascade Hydrology Science</span>
            </button>
          </div>
        </div>

        {/* WATER BODY PHOTO GALLERY */}
        <div className="space-y-3">
          {waterBody.photos.length > 0 ? (
            <img
              src={waterBody.photos[0]}
              alt={waterBody.name}
              referrerPolicy="no-referrer"
              className="w-full h-56 object-cover rounded-xl border border-slate-200 shadow-sm"
            />
          ) : (
            <div className="w-full h-56 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs">
              No photos available
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Coordinates: {waterBody.coordinates[0].toFixed(4)}°N, {waterBody.coordinates[1].toFixed(4)}°E</span>
            <span>{waterBody.photos.length} photos</span>
          </div>
        </div>
      </div>

      {/* CORE ENVIRONMENTAL DATA: STRICT SEPARATION OF OFFICIAL DATA VS CITIZEN OBSERVATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* OFFICIAL / VERIFIED SCIENTIFIC DATA */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Official Verified Environmental Data
                </h3>
                <div className="text-[11px] text-slate-500">
                  Source: {waterBody.officialData.officialSource}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-700 block">
                {waterBody.officialData.complianceStatus}
              </span>
              <span className="text-[10px] text-slate-400">
                Updated: {waterBody.officialData.lastUpdated}
              </span>
            </div>
          </div>

          {/* KEY METRICS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-[11px] text-slate-500 block mb-0.5">Dissolved Oxygen</span>
              <span className="text-lg font-mono font-bold text-slate-900">
                {waterBody.officialData.dissolvedOxygenMgL}
              </span>
              <span className="text-[11px] text-slate-500 ml-1">mg/L</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {waterBody.officialData.dissolvedOxygenMgL < 4 ? 'Suffocating for fish' : 'Adequate for aquatic life'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-[11px] text-slate-500 block mb-0.5">BOD (Organic Load)</span>
              <span className="text-lg font-mono font-bold text-slate-900">
                {waterBody.officialData.bodMgL}
              </span>
              <span className="text-[11px] text-slate-500 ml-1">mg/L</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Standard: &lt; 3 mg/L
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-[11px] text-slate-500 block mb-0.5">pH Level</span>
              <span className="text-lg font-mono font-bold text-slate-900">
                {waterBody.officialData.ph}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Neutral range: 6.5–8.5
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-[11px] text-slate-500 block mb-0.5">Total Dissolved Solids</span>
              <span className="text-lg font-mono font-bold text-slate-900">
                {waterBody.officialData.tdsMgL}
              </span>
              <span className="text-[11px] text-slate-500 ml-1">mg/L</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Salts and minerals
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-[11px] text-slate-500 block mb-0.5">Turbidity</span>
              <span className="text-lg font-mono font-bold text-slate-900">
                {waterBody.officialData.turbidityNtu}
              </span>
              <span className="text-[11px] text-slate-500 ml-1">NTU</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Suspended clarity
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg flex flex-col justify-center">
              <span className="text-[11px] text-slate-500 block mb-0.5">Pollution Severity</span>
              <span className="text-sm font-bold text-rose-700">
                {waterBody.pollutionDetails.severity}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Requires intervention
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
              Pollution & Degradation Assessment
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {waterBody.pollutionDetails.summary}
            </p>
            <div className="text-xs text-slate-700">
              <span className="font-semibold">Observed Primary Pollutants: </span>
              {waterBody.pollutionDetails.primaryPollutants.join(' · ')}
            </div>
          </div>
        </div>

        {/* COMMUNITY-SUBMITTED OBSERVATIONS & FIELD EVIDENCE */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Community-Submitted Observations
                  </h3>
                  <div className="text-[11px] text-slate-500">
                    Citizen field logs & photo evidence (Not government data)
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsObservationFormOpen(!isObservationFormOpen)}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                + Add Observation
              </button>
            </div>

            {/* QUICK FORM TO ADD OBSERVATION */}
            {isObservationFormOpen && (
              <form onSubmit={handleObservationSubmit} className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4 space-y-3">
                <div className="text-xs font-bold text-slate-800">New Field Observation</div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Category</label>
                  <select
                    value={obsCategory}
                    onChange={(e) => setObsCategory(e.target.value as Observation['category'])}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                  >
                    <option value="water-clarity">Water Clarity / Turbidity</option>
                    <option value="plastic-waste">Plastic & Solid Waste</option>
                    <option value="algal-bloom">Algal Bloom / Weed Hyacinth</option>
                    <option value="low-flow">Low Flow / Silt Blockage</option>
                    <option value="wildlife-sighting">Aquatic Wildlife / Birds</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Observation Note</label>
                  <textarea
                    value={obsNote}
                    onChange={(e) => setObsNote(e.target.value)}
                    placeholder="Describe water condition, smell, clarity, volunteer progress..."
                    rows={2}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Photo URL (Optional)</label>
                  <input
                    type="url"
                    value={obsPhotoUrl}
                    onChange={(e) => setObsPhotoUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsObservationFormOpen(false)}
                    className="px-3 py-1 text-xs text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded"
                  >
                    Save Log
                  </button>
                </div>
              </form>
            )}

            {/* OBSERVATIONS FEED */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {waterBody.observations.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No citizen observations recorded yet. Be the first to log a field note!
                </div>
              ) : (
                waterBody.observations.map((obs) => (
                  <div key={obs.id} className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/80">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={obs.userAvatar}
                          alt={obs.userName}
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold text-slate-800">{obs.userName}</span>
                        <span className="text-[10px] text-slate-400">· Citizen Observation</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{obs.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">{obs.note}</p>
                    {obs.photoUrl && (
                      <img
                        src={obs.photoUrl}
                        alt="Evidence"
                        referrerPolicy="no-referrer"
                        className="w-full h-32 object-cover rounded-md border border-slate-200"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-4">
            <span>{relatedReports.length} Environmental issues reported</span>
            <button
              onClick={() => openReportModal(waterBody.id)}
              className="text-teal-700 hover:underline font-semibold"
            >
              Submit Detailed Issue
            </button>
          </div>
        </div>
      </div>

      {/* CONNECTED COMMUNITIES & ACTIVITIES ON THIS WATER BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* COMMUNITIES STEWARDING THIS WATER BODY */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Nearby Communities & Networks
              </h3>
            </div>
            <span className="text-xs text-slate-500">{relatedCommunities.length} Active</span>
          </div>

          <div className="space-y-4">
            {relatedCommunities.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                No local community registered for this water body yet.
              </div>
            ) : (
              relatedCommunities.map((comm) => (
                <div
                  key={comm.id}
                  className="p-4 rounded-lg border border-slate-200 hover:border-teal-500 transition-colors bg-slate-50/50"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{comm.name}</h4>
                      <p className="text-xs text-slate-500">{comm.tagline}</p>
                    </div>
                    <button
                      onClick={() => navigateToCommunity(comm.id)}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-0.5 whitespace-nowrap"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {comm.description}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                    <span>{comm.impact.membersCount} members</span>
                    <span aria-hidden="true">·</span>
                    <span>{comm.impact.activitiesCompleted} activities completed</span>
                    <button
                      onClick={() => joinCommunity(comm.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors"
                    >
                      Join Community
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RELATED ACTIVITIES & CLEANUP ACTIONS */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Upcoming & Recent Community Activities
              </h3>
            </div>
            <span className="text-xs text-slate-500">{relatedActivities.length} Actions</span>
          </div>

          <div className="space-y-4">
            {relatedActivities.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                No activities currently scheduled on this water body.
              </div>
            ) : (
              relatedActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-4 rounded-lg border border-slate-200 hover:border-indigo-400 transition-colors bg-slate-50/50"
                >
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div>
                      <span className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wider block">
                        {act.category} · {act.status.toUpperCase()}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{act.title}</h4>
                    </div>
                    <button
                      onClick={() => navigateToActivity(act.id)}
                      className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-0.5 whitespace-nowrap"
                    >
                      <span>Join</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">{act.description}</p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                    <span>{act.date} ({act.time})</span>
                    <span aria-hidden="true">·</span>
                    <span>{act.participants.length} / {act.volunteerLimit} volunteers</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
