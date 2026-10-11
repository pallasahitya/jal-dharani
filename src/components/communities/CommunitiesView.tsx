import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Community } from '../../types';
import { CommunityDetail } from './CommunityDetail';
import {
  Users,
  Search,
  Plus,
  MapPin,
  ChevronRight,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Flame,
  Droplet,
} from 'lucide-react';

export const CommunitiesView: React.FC = () => {
  const {
    communities,
    selectedCommunityId,
    setSelectedCommunityId,
    joinCommunity,
    currentUser,
    createCommunity,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFocusFilter, setSelectedFocusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Create form state
  const [newCommName, setNewCommName] = useState('');
  const [newCommTagline, setNewCommTagline] = useState('');
  const [newCommCity, setNewCommCity] = useState(currentUser.location.city || 'Pune');
  const [newCommState, setNewCommState] = useState(currentUser.location.state || 'Maharashtra');
  const [newCommDesc, setNewCommDesc] = useState('');
  const [newCommFocus, setNewCommFocus] = useState<Community['focusAreas']>(['water-body', 'groundwater']);

  if (selectedCommunityId) {
    return (
      <CommunityDetail
        communityId={selectedCommunityId}
        onBack={() => setSelectedCommunityId(null)}
      />
    );
  }

  const filteredCommunities = communities.filter((comm) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (comm?.name && comm.name.toLowerCase().includes(q)) ||
      (comm?.description && comm.description.toLowerCase().includes(q)) ||
      (comm?.location?.city && comm.location.city.toLowerCase().includes(q));

    const matchesFocus =
      selectedFocusFilter === 'all' || (comm?.focusAreas && comm.focusAreas.includes(selectedFocusFilter as any));

    return matchesSearch && matchesFocus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommName.trim()) return;

    const created = createCommunity({
      name: newCommName.trim(),
      tagline: newCommTagline.trim() || 'Citizen water & heat collective',
      description: newCommDesc.trim(),
      focusAreas: newCommFocus,
      location: {
        city: newCommCity,
        state: newCommState,
        coordinates: [18.5204, 73.8567],
      },
    });

    setNewCommName('');
    setNewCommTagline('');
    setNewCommDesc('');
    setIsCreateModalOpen(false);
    setSelectedCommunityId(created.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
            Grassroots Citizen Collectives
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">
            Communities for Water & Heat Resilience
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real action starts locally. Form neighborhood groups, adopt water bodies, and restore aquifers together.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Start a Community</span>
        </button>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by community name, city, or environmental focus..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white shadow-xs focus:outline-teal-600"
          />
        </div>

        {/* FOCUS FILTER */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs shrink-0">
          {[
            { id: 'all', label: 'All Communities' },
            { id: 'water-body', label: 'Water Bodies' },
            { id: 'groundwater', label: 'Groundwater' },
            { id: 'heat-resilience', label: 'Heat Resilience' },
            { id: 'rainwater-harvesting', label: 'Rainwater' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFocusFilter(tab.id)}
              className={`px-3 py-1.5 font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedFocusFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* COMMUNITIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((comm) => {
          const isMember = (comm.members || []).some((m) => m?.userId === currentUser?.id);

          return (
            <div
              key={comm.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-teal-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="text-[11px] font-semibold text-teal-800 uppercase tracking-wide">
                      {comm.location?.city || 'Local'}, {comm.location?.state || 'India'}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-display mt-0.5">
                      {comm.name}
                    </h3>
                  </div>
                  {isMember && (
                    <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                      Member
                    </span>
                  )}
                </div>

                <p className="text-xs font-medium text-slate-600 mb-2">{comm.tagline}</p>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {comm.description}
                </p>

                {/* FOCUS METADATA */}
                <div className="text-[11px] text-slate-500 mb-4 flex flex-wrap gap-1">
                  {(comm.focusAreas || []).map((f, i) => (
                    <span key={i} className="text-slate-600">
                      {f.replace('-', ' ')}
                      {i < (comm.focusAreas?.length || 0) - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Members</span>
                    <span className="font-bold font-mono text-slate-800 tabular-nums">
                      {comm.impact?.membersCount ?? comm.members?.length ?? 1}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Activities Completed</span>
                    <span className="font-bold font-mono text-slate-800 tabular-nums">
                      {comm.impact?.activitiesCompleted ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedCommunityId(comm.id)}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                >
                  <span>Open Page & Discussions</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {!isMember ? (
                  <button
                    onClick={() => joinCommunity(comm.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
                  >
                    Join Group
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedCommunityId(comm.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    View
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE COMMUNITY MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-900 font-display mb-1">
              Start a Local Community
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Bring neighbors, students, and citizens together around a lake, stepwell, or cooling campaign.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Community Name
                </label>
                <input
                  type="text"
                  value={newCommName}
                  onChange={(e) => setNewCommName(e.target.value)}
                  placeholder="e.g. Pashan Lake Citizens Collective"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  One-Line Tagline
                </label>
                <input
                  type="text"
                  value={newCommTagline}
                  onChange={(e) => setNewCommTagline(e.target.value)}
                  placeholder="e.g. Restoring the wetland buffer and reviving aquifer percolation"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={newCommCity}
                    onChange={(e) => setNewCommCity(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">State</label>
                  <input
                    type="text"
                    value={newCommState}
                    onChange={(e) => setNewCommState(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Mission & Description
                </label>
                <textarea
                  value={newCommDesc}
                  onChange={(e) => setNewCommDesc(e.target.value)}
                  placeholder="What water body or environmental challenge will this community tackle?"
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Focus Areas</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'water-body', label: 'Water Body Restoration' },
                    { id: 'groundwater', label: 'Groundwater & Wells' },
                    { id: 'heat-resilience', label: 'Heat Mitigation & Shade' },
                    { id: 'rainwater-harvesting', label: 'Rainwater Harvesting' },
                    { id: 'pollution-cleanup', label: 'Pollution & Plastic' },
                  ].map((f) => (
                    <label key={f.id} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newCommFocus.includes(f.id as any)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewCommFocus([...newCommFocus, f.id as any]);
                          } else {
                            setNewCommFocus(newCommFocus.filter((item) => item !== f.id));
                          }
                        }}
                        className="rounded accent-teal-700"
                      />
                      <span>{f.label}</span>
                    </label>
                  ))}
                </div>
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
                  Create Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
