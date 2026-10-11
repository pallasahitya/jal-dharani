import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EnvironmentalReport } from '../../types';
import { aiApi } from '../../services/api';
import { X, AlertTriangle, Upload, Camera, MapPin, Sparkles, Loader2, ShieldCheck } from 'lucide-react';

export const ReportModal: React.FC = () => {
  const {
    isReportModalOpen,
    closeReportModal,
    preselectedReportWaterBodyId,
    waterBodies,
    submitReport,
    currentUser,
    isAuthenticated,
    openAuthModal,
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EnvironmentalReport['category']>('sewage-inflow');
  const [waterBodyId, setWaterBodyId] = useState<string>(preselectedReportWaterBodyId || '');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<{
    summary: string;
    scientific_context: string;
    immediate_actions: string[];
    is_ai_analysis?: boolean;
  } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  if (!isReportModalOpen) return null;

  const handleGetAiGuidance = async () => {
    setIsAiLoading(true);
    const matchedWaterBody = waterBodies.find((w) => w.id === waterBodyId);
    try {
      const result = await aiApi.explainReport({
        title: title.trim() || `Field Report: ${category}`,
        category,
        description: description.trim() || 'Observed environmental degradation requiring community investigation.',
        water_body_name: matchedWaterBody?.name,
      });
      if (result) {
        setAiAnalysis(result);
      }
    } catch (err) {
      console.warn('AI explanation fallback:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if (!title.trim() || !description.trim()) return;

    const matchedWaterBody = waterBodies.find((w) => w.id === waterBodyId);

    submitReport({
      title: title.trim(),
      category,
      description: description.trim(),
      location: {
        name: locationName.trim() || matchedWaterBody?.name || 'Local Site',
        city: matchedWaterBody?.location.city || currentUser.location.city,
        state: matchedWaterBody?.location.state || currentUser.location.state,
        coordinates: matchedWaterBody?.coordinates || [18.5204, 73.8567],
      },
      waterBodyId: waterBodyId || undefined,
      waterBodyName: matchedWaterBody?.name,
      photoUrl: photoUrl.trim() || undefined,
      status: 'SUBMITTED',
    });

    closeReportModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-fadeIn">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Report Environmental Issue
            </h3>
          </div>
          <button
            onClick={closeReportModal}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 mb-4 leading-relaxed">
          <strong>Citizen Science Vigilance:</strong> Observations are logged as community alerts, inspected by local volunteers, and distinguished from official scientific measurements until verified.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Issue Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="sewage-inflow">Untreated Sewage Inflow / Nullah Breach</option>
              <option value="garbage-dumping">Garbage & Solid Waste Dumping</option>
              <option value="foaming">Surfactant Foaming / Detergent Scum</option>
              <option value="unusual-color">Unusual Water Discoloration / Chemical Discharge</option>
              <option value="dead-fish">Dead Fish / Aquatic Wildlife Mortalities</option>
              <option value="damaged-recharge-structure">Clogged or Damaged Recharge Pit</option>
              <option value="drying-waterbody">Premature Water Body Drying / Encroachment</option>
              <option value="blocked-drainage">Stormwater Culvert Blockage / Flash Flooding</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Observation Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Raw industrial greywater flowing into southern bank"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Related Water Body
              </label>
              <select
                value={waterBodyId}
                onChange={(e) => setWaterBodyId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="">None / General Watershed</option>
                {waterBodies.map((wb) => (
                  <option key={wb.id} value={wb.id}>
                    {wb.name} ({wb.location.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Specific Location Landmark
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Under western flyover weir"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Field Observation Details
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you observed: odor, water color, pipe diameter, approximate volume, time of discharge..."
              rows={3}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Photo URL / Evidence Link
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/field-photo.jpg (or simulated upload)"
                className="flex-1 text-xs p-2.5 rounded-lg border border-slate-300"
              />
              <button
                type="button"
                onClick={() =>
                  setPhotoUrl(
                    'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&auto=format&fit=crop&q=80'
                  )
                }
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg whitespace-nowrap"
              >
                Use Demo Photo
              </button>
            </div>
          </div>

          {/* AI SCIENTIFIC GUIDANCE & SAFETY ADVISORY */}
          <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Jal-Dharani AI Science Guidance</span>
              </div>
              <button
                type="button"
                onClick={handleGetAiGuidance}
                disabled={isAiLoading}
                className="px-2.5 py-1 text-[11px] font-semibold text-teal-800 bg-white border border-teal-300 hover:bg-teal-50 rounded-lg flex items-center gap-1 transition-colors"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    <span>Get AI Analysis</span>
                  </>
                )}
              </button>
            </div>

            {aiAnalysis ? (
              <div className="space-y-2 text-xs text-slate-700 bg-white p-3 rounded-lg border border-teal-100">
                <p className="font-semibold text-teal-950">{aiAnalysis.summary}</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {aiAnalysis.scientific_context}
                </p>
                {aiAnalysis.immediate_actions && aiAnalysis.immediate_actions.length > 0 && (
                  <div className="pt-1.5 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                      Recommended Community Safety Measures:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                      {aiAnalysis.immediate_actions.map((act, idx) => (
                        <li key={idx}>{act}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-teal-800/80">
                Tap to preview hydrological science context and community safety measures before submitting.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={closeReportModal}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
