import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity } from '../../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { ASSET_IMAGES } from '../../data/seedData';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Camera,
  ShieldAlert,
} from 'lucide-react';

interface ActivityDetailProps {
  activityId: string;
  onBack: () => void;
}

export const ActivityDetail: React.FC<ActivityDetailProps> = ({ activityId, onBack }) => {
  const {
    activities,
    currentUser,
    joinActivity,
    leaveActivity,
    completeActivity,
    openPromotionModal,
    navigateToCommunity,
  } = useApp();

  const activity = activities.find((a) => a.id === activityId);

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [beforePhotoInput, setBeforePhotoInput] = useState('');
  const [afterPhotoInput, setAfterPhotoInput] = useState('');
  const [docDescription, setDocDescription] = useState('');
  const [docImpact, setDocImpact] = useState('');

  if (!activity) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="text-slate-600 mb-4">Activity not found.</div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg"
        >
          Return to Activities
        </button>
      </div>
    );
  }

  const isJoined = (activity.participants || []).some((p) => p?.userId === currentUser?.id);
  const isOrganizer = activity.organizer?.id === currentUser?.id;

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeActivity(
      activity.id,
      beforePhotoInput.trim() || 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&auto=format&fit=crop&q=80',
      afterPhotoInput.trim() || ASSET_IMAGES.waterbodyLakeRestored,
      docDescription.trim() || 'Volunteers successfully completed the restoration activity and cleared all debris.',
      docImpact.trim() || `${activity.participants?.length ?? 0} volunteers mobilized`
    );
    setIsCompleteModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Activities</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openPromotionModal('activity', activity)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Generate Share Card</span>
          </button>

          {activity.status !== 'completed' && (
            <>
              {isJoined ? (
                <button
                  onClick={() => leaveActivity(activity.id)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                >
                  Leave Roster
                </button>
              ) : (
                <button
                  onClick={() => joinActivity(activity.id)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
                >
                  Join as Volunteer
                </button>
              )}
            </>
          )}

          {activity.status !== 'completed' && (
            <button
              onClick={() => setIsCompleteModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Document Completion</span>
            </button>
          )}
        </div>
      </div>

      {/* HEADER CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-2">
          <span>{activity.category.replace('-', ' ')}</span>
          <span aria-hidden="true">·</span>
          <span>{activity.status.toUpperCase()}</span>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => navigateToCommunity(activity.communityId)}
            className="hover:underline text-teal-900"
          >
            {activity.communityName}
          </button>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 font-display mb-4">
          {activity.title}
        </h1>

        <p className="text-sm text-slate-700 leading-relaxed max-w-3xl mb-6">
          {activity.description}
        </p>

        {/* METADATA BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-teal-700 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">Scheduled Date</span>
              <span className="font-bold text-slate-900">{activity.date}</span>
              <span className="text-slate-500 block text-[11px]">{activity.time}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-teal-700 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">Location Site</span>
              <span className="font-bold text-slate-900">{activity.location?.name || 'Catchment Site'}</span>
              <span className="text-slate-500 block text-[11px]">{activity.location?.address || 'Site Location'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-teal-700 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">Volunteers Mobilized</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {activity.participants?.length ?? 0} / {activity.volunteerLimit || 30}
              </span>
              <span className="text-slate-500 block text-[11px]">
                {Math.max(0, (activity.volunteerLimit || 30) - (activity.participants?.length ?? 0))} open slots remaining
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SAFETY NOTICE (as required by prompt rules: never encourage dangerous technical interventions) */}
      <div className="mb-8 p-4 bg-amber-50/60 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-950">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="block mb-0.5">Citizen Safety & Hydrogeological Discipline:</strong>
          All community activities follow safe grassroots guidelines: wear protective gloves during cleanups, stay hydrated during heat hours, and focus on surface silt clearance and natural vegetative filters. Never drill or inject unfiltered urban runoff into deep borewells without certified hydrogeological testing.
        </div>
      </div>

      {/* BEFORE / AFTER EVIDENCE SECTION (IF COMPLETED) */}
      {activity.beforeAfter && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide block">
                Documented Field Evidence
              </span>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                Before & After Interactive Comparison
              </h3>
            </div>
            <button
              onClick={() => openPromotionModal('activity', activity)}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Impact Card</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            {activity.beforeAfter.description}
          </p>

          <BeforeAfterSlider
            beforePhoto={activity.beforeAfter.beforePhoto}
            afterPhoto={activity.beforeAfter.afterPhoto}
          />

          <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center justify-between">
            <span>Impact Measured: {activity.beforeAfter.impactSummary}</span>
            <span className="text-emerald-700">Verified by Community Roster</span>
          </div>
        </div>
      )}

      {/* VOLUNTEER ROSTER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 font-display">
            Volunteer Participants Roster ({activity.participants.length})
          </h3>
          <span className="text-xs text-slate-500">
            Organized by {activity.organizer.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {activity.participants.map((p) => (
            <div
              key={p.userId}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3"
            >
              <img
                src={p.avatar}
                alt={p.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-slate-300"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">{p.name}</div>
                <div className="text-[10px] text-slate-400">Signed up {p.joinedAt}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COMPLETE ACTIVITY MODAL */}
      {isCompleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-900 font-display mb-1">
              Document Activity Completion
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Upload before/after photos and document the measured impact of this event.
            </p>

            <form onSubmit={handleCompleteSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Before Action Photo URL
                </label>
                <input
                  type="url"
                  value={beforePhotoInput}
                  onChange={(e) => setBeforePhotoInput(e.target.value)}
                  placeholder="https://example.com/before-photo.jpg (leave blank for demo)"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  After Action Photo URL
                </label>
                <input
                  type="url"
                  value={afterPhotoInput}
                  onChange={(e) => setAfterPhotoInput(e.target.value)}
                  placeholder="https://example.com/after-photo.jpg (leave blank for demo)"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Measured Impact Metric Summary
                </label>
                <input
                  type="text"
                  value={docImpact}
                  onChange={(e) => setDocImpact(e.target.value)}
                  placeholder="e.g. 850 kg plastic debris removed · 15 percolation trenches desilted"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Documentary Summary & Outcomes
                </label>
                <textarea
                  value={docDescription}
                  onChange={(e) => setDocDescription(e.target.value)}
                  placeholder="Describe the condition of the water body or site before and after the community took action..."
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCompleteModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
                >
                  Publish Impact Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
