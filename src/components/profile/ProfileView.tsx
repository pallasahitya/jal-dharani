import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCircle2,
  MapPin,
  Calendar,
  Clock,
  Award,
  Users,
  AlertTriangle,
  Camera,
  Edit3,
  Check,
  ChevronRight,
  LogOut,
  Droplet,
  Layers,
  ShieldCheck,
  LogIn,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    isAuthenticated,
    openAuthModal,
    logout,
    communities,
    activities,
    reports,
    navigateToCommunity,
    navigateToActivity,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [bio, setBio] = useState(currentUser.bio);
  const [city, setCity] = useState(currentUser.location.city);
  const [state, setState] = useState(currentUser.location.state);
  const [neighborhood, setNeighborhood] = useState(currentUser.location.neighborhood || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);

  // Profile data filtering
  const joinedCommunities = communities.filter((c) =>
    (c.members || []).some((m) => m?.userId === currentUser.id)
  );
  const createdCommunities = communities.filter((c) =>
    (c.adminIds || []).includes(currentUser.id)
  );

  const joinedActivities = activities.filter((a) =>
    (a.participants || []).some((p) => p?.userId === currentUser.id)
  );
  const createdActivities = activities.filter(
    (a) => a.organizer?.id === currentUser.id
  );

  const userReports = reports.filter((r) => r.userId === currentUser.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name,
      email,
      bio,
      avatar,
      location: {
        city,
        state,
        neighborhood,
      },
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* AUTHENTICATION SESSION STATUS BAR (REPLACED DEMO PERSONA SWITCHER) */}
      {isAuthenticated ? (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 p-3.5 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5 text-teal-900">
            <div className="p-1.5 bg-teal-600 text-white rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-teal-950">Active Authenticated Session:</span>{' '}
              <span className="text-teal-700 font-medium">{currentUser.email}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 hover:border-red-200 rounded-xl font-bold transition-all shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5 text-red-600" />
            <span>Sign Out</span>
          </button>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5 text-amber-900">
            <UserCircle2 className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <span className="font-bold text-amber-950">Guest Mode:</span> You are currently viewing public conservation records. Sign in to submit observations and organize community events.
            </div>
          </div>
          <button
            onClick={() => openAuthModal('login')}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold transition-all shadow-xs shrink-0"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </button>
        </div>
      )}

      {/* USER PROFILE HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover border-2 border-teal-600 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 font-display">
                  {currentUser.name}
                </h1>
                <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded capitalize border border-teal-200">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>

              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser.location.neighborhood ? `${currentUser.location.neighborhood}, ` : ''}
                  {currentUser.location.city}, {currentUser.location.state}
                </span>
                <span aria-hidden="true">·</span>
                <span>Member since {currentUser.joinedDate}</span>
              </div>

              <p className="text-xs text-slate-600 mt-2.5 max-w-2xl leading-relaxed">
                {currentUser.bio}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* EDIT PROFILE FORM */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* IMPACT & CONTRIBUTION HISTORY METRICS */}
      <div className="mb-8">
        <h2 className="text-base font-bold text-slate-900 font-display mb-3">
          Contribution & Impact History
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              Volunteer Hours
            </span>
            <span className="text-2xl font-bold font-mono text-teal-800 tabular-nums">
              {currentUser.impactMetrics.volunteerHours}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              Actions Joined
            </span>
            <span className="text-2xl font-bold font-mono text-slate-800 tabular-nums">
              {currentUser.impactMetrics.activitiesJoined}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              Events Organized
            </span>
            <span className="text-2xl font-bold font-mono text-indigo-700 tabular-nums">
              {currentUser.impactMetrics.activitiesOrganized}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              Reports Submitted
            </span>
            <span className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
              {currentUser.impactMetrics.reportsSubmitted}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              Reports Verified
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
              {currentUser.impactMetrics.reportsVerified}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              Water Bodies Monitored
            </span>
            <span className="text-2xl font-bold font-mono text-sky-700 tabular-nums">
              {currentUser.impactMetrics.waterBodiesMonitored}
            </span>
          </div>
        </div>
      </div>

      {/* DETAILED ACTIVITY & COMMUNITY SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* JOINED & CREATED COMMUNITIES */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-700" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Your Communities ({joinedCommunities.length})
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {joinedCommunities.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-6">
                You haven't joined any communities yet.
              </div>
            ) : (
              joinedCommunities.map((comm) => (
                <div
                  key={comm.id}
                  onClick={() => navigateToCommunity(comm.id)}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-teal-500 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{comm.name}</h4>
                    <div className="text-[11px] text-slate-500">{comm.location.city} · {comm.impact.membersCount} members</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* JOINED ACTIVITIES */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-700" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Activities Joined & Organized ({joinedActivities.length})
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {joinedActivities.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-6">
                No scheduled activities yet. Browse the Activities tab!
              </div>
            ) : (
              joinedActivities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => navigateToActivity(act.id)}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-400 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-[10px] text-indigo-700 font-bold uppercase">
                      {act.category} · {act.date}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SUBMITTED CITIZEN REPORTS */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Your Environmental Observations ({userReports.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">Citizen vigilance history</span>
        </div>

        <div className="space-y-3">
          {userReports.length === 0 ? (
            <div className="text-xs text-slate-400 text-center py-6">
              You haven't submitted any reports yet. Use "Report Observation" when you spot an issue!
            </div>
          ) : (
            userReports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">
                      {rep.category.replace('-', ' ')}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-[11px] font-bold text-slate-800">
                      Status: {rep.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{rep.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{rep.description}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {new Date(rep.submittedAt).toLocaleDateString('en-IN')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
