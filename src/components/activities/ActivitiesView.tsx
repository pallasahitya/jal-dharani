import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity } from '../../types';
import { ActivityDetail } from './ActivityDetail';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Plus,
  Share2,
  CheckCircle2,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const ActivitiesView: React.FC = () => {
  const {
    activities,
    selectedActivityId,
    setSelectedActivityId,
    joinActivity,
    currentUser,
    openPromotionModal,
    createActivity,
    communities,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New activity form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Activity['category']>('cleanup');
  const [communityId, setCommunityId] = useState(communities[0]?.id || '');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('08:00 AM – 11:00 AM IST');
  const [locationName, setLocationName] = useState('');

  if (selectedActivityId) {
    return (
      <ActivityDetail
        activityId={selectedActivityId}
        onBack={() => setSelectedActivityId(null)}
      />
    );
  }

  const filteredActivities = activities.filter((act) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (act?.title && act.title.toLowerCase().includes(q)) ||
      (act?.description && act.description.toLowerCase().includes(q)) ||
      (act?.location?.name && act.location.name.toLowerCase().includes(q)) ||
      (act?.communityName && act.communityName.toLowerCase().includes(q));

    const matchesCat = categoryFilter === 'all' || act.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || act.status === statusFilter;

    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const created = createActivity({
      communityId,
      title: title.trim(),
      category,
      description: desc.trim(),
      date: date || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      time,
      location: {
        name: locationName.trim() || 'Community Project Site',
        address: `${currentUser.location.city}, ${currentUser.location.state}`,
        coordinates: [18.5204, 73.8567],
      },
    });

    setTitle('');
    setDesc('');
    setLocationName('');
    setIsCreateModalOpen(false);
    setSelectedActivityId(created.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
            Citizen Conservation Mobilization
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">
            Real-World Environmental Activities
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Join physical cleanups, audit neighborhood groundwater wells, desilt percolation pits, and install shaded hydration kiosks.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Organize Activity</span>
        </button>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="space-y-3 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities by title, location, or community..."
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white shadow-xs focus:outline-teal-600"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs shrink-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Activities ({activities.length})
            </button>
            <button
              onClick={() => setStatusFilter('upcoming')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                statusFilter === 'upcoming'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upcoming ({activities.filter((a) => a.status === 'upcoming').length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed Evidence ({activities.filter((a) => a.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* CATEGORY FILTER BAR */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'cleanup', label: 'Water Cleanups' },
            { id: 'rwh-maintenance', label: 'Recharge Pit Maintenance' },
            { id: 'groundwater-audit', label: 'Groundwater Audits' },
            { id: 'heat-shelter', label: 'Heat Shelters' },
            { id: 'documentation', label: 'Documentation Walks' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 font-medium rounded-lg whitespace-nowrap transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-white text-teal-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVITIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((act) => {
          const isJoined = (act.participants || []).some((p) => p?.userId === currentUser?.id);

          return (
            <div
              key={act.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-teal-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-teal-800 uppercase tracking-wide">
                    {act.category.replace('-', ' ')}
                  </span>
                  <span
                    className={`font-semibold text-[11px] ${
                      act.status === 'completed' ? 'text-emerald-700' : 'text-indigo-700'
                    }`}
                  >
                    {act.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-display mb-1.5">
                  {act.title}
                </h3>

                <div className="text-xs text-slate-500 mb-3">
                  Organized by <span className="font-medium text-slate-700">{act.communityName || 'Community'}</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {act.description}
                </p>

                {/* DETAILS CARD */}
                <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{act.date} ({act.time})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{act.location?.name || 'Catchment Site'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {act.participants?.length ?? 0} / {act.volunteerLimit || 30} volunteers enrolled
                    </span>
                  </div>
                </div>

                {/* BEFORE AFTER INDICATOR IF COMPLETED */}
                {act.beforeAfter && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 mb-4 flex items-center justify-between">
                    <span className="font-medium">Before/After Evidence Available</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedActivityId(act.id)}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openPromotionModal('activity', act)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 border border-slate-200 rounded-lg"
                    title="Share promotion card"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  {act.status !== 'completed' && (
                    <>
                      {isJoined ? (
                        <span className="px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 rounded">
                          Enrolled
                        </span>
                      ) : (
                        <button
                          onClick={() => joinActivity(act.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
                        >
                          Join Roster
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE ACTIVITY MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-900 font-display mb-1">
              Organize Real-World Activity
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Mobilize volunteers for water conservation, shade planting, or drain clearing.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Hosting Community
                </label>
                <select
                  value={communityId}
                  onChange={(e) => setCommunityId(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  {communities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.location.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Pre-Monsoon Percolation Trench Clearance"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="cleanup">Water Body Cleanup</option>
                    <option value="rwh-maintenance">Recharge Pit Desilting</option>
                    <option value="groundwater-audit">Well Water Table Audit</option>
                    <option value="heat-shelter">Heat Hydration Stall</option>
                    <option value="documentation">Documentation Walk</option>
                    <option value="education">Community Awareness</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Location Site</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Ramkund Ghat Embankment, Nashik"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Action Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Describe tasks, volunteer tools provided, water bottles required..."
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
