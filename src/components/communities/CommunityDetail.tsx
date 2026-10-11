import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Community, Activity } from '../../types';
import {
  Users,
  ArrowLeft,
  Calendar,
  MessageSquare,
  Share2,
  CheckCircle2,
  Plus,
  Send,
  Heart,
  Image as ImageIcon,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface CommunityDetailProps {
  communityId: string;
  onBack: () => void;
}

export const CommunityDetail: React.FC<CommunityDetailProps> = ({ communityId, onBack }) => {
  const {
    communities,
    activities,
    reports,
    currentUser,
    joinCommunity,
    leaveCommunity,
    addCommunityPost,
    addPostComment,
    openPromotionModal,
    navigateToActivity,
    setNavTab,
    createActivity,
  } = useApp();

  const community = communities.find((c) => c.id === communityId);

  const [activeTab, setActiveTab] = useState<'posts' | 'activities' | 'members' | 'impact'>('posts');
  const [newPostText, setNewPostText] = useState('');
  const [newPostPhoto, setNewPostPhoto] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isCreateActivityOpen, setIsCreateActivityOpen] = useState(false);

  // New activity form state
  const [newActTitle, setNewActTitle] = useState('');
  const [newActCategory, setNewActCategory] = useState<Activity['category']>('cleanup');
  const [newActDesc, setNewActDesc] = useState('');
  const [newActDate, setNewActDate] = useState('');
  const [newActTime, setNewActTime] = useState('08:00 AM – 11:00 AM IST');
  const [newActLocation, setNewActLocation] = useState('');

  if (!community) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="text-slate-600 mb-4">Community not found.</div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg"
        >
          Return to Communities
        </button>
      </div>
    );
  }

  const isMember = (community.members || []).some((m) => m?.userId === currentUser?.id);
  const communityActivities = activities.filter((a) => a?.communityId === community.id);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    addCommunityPost(community.id, newPostText.trim(), newPostPhoto.trim() || undefined);
    setNewPostText('');
    setNewPostPhoto('');
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    addPostComment(community.id, postId, text.trim());
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleCreateActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActTitle.trim()) return;

    createActivity({
      communityId: community.id,
      title: newActTitle.trim(),
      category: newActCategory,
      description: newActDesc.trim(),
      date: newActDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      time: newActTime,
      location: {
        name: newActLocation.trim() || `${community.location?.city || 'Local'} Field Site`,
        address: `${community.location?.city || 'Local'}, ${community.location?.state || 'India'}`,
        coordinates: community.location?.coordinates || [18.5204, 73.8567],
      },
    });

    setNewActTitle('');
    setNewActDesc('');
    setNewActLocation('');
    setIsCreateActivityOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* BACK NAVIGATION & ACTIONS */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Communities</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openPromotionModal('community', community)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Promote Community</span>
          </button>

          {isMember ? (
            <button
              onClick={() => leaveCommunity(community.id)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-700 border border-slate-300 rounded-lg transition-colors"
            >
              Joined (Leave)
            </button>
          ) : (
            <button
              onClick={() => joinCommunity(community.id)}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
            >
              Join Community
            </button>
          )}
        </div>
      </div>

      {/* COMMUNITY HEADER BANNER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 mb-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-2">
              <span>{community.location?.city || 'Local'}, {community.location?.state || 'India'}</span>
              <span aria-hidden="true">·</span>
              <span>Founded {community.createdAt}</span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 font-display mb-2">
              {community.name}
            </h1>

            <p className="text-sm font-medium text-slate-700 mb-3">{community.tagline}</p>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl mb-4">
              {community.description}
            </p>

            {/* FOCUS PILLS (functional metadata rendered cleanly) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Focus Areas:</span>
              {(community.focusAreas || []).map((area, idx) => (
                <span key={idx} className="text-slate-600">
                  {area.replace('-', ' ')}
                  {idx < (community.focusAreas?.length || 0) - 1 ? ' ·' : ''}
                </span>
              ))}
            </div>
          </div>

          {/* IMPACT SNAPSHOT */}
          <div className="lg:col-span-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Community Impact Stats
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Members</span>
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {community.impact?.membersCount ?? community.members?.length ?? 1}
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Actions Done</span>
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {community.impact?.activitiesCompleted ?? 0}
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Volunteers</span>
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {community.impact?.volunteersMobilized ?? community.members?.length ?? 1}
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Recharge Pits</span>
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {community.impact?.rechargeStructuresMapped ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ANNOUNCEMENTS */}
      {community.announcements.length > 0 && (
        <div className="mb-8 p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-3">
          <div className="p-1.5 bg-teal-600 text-white rounded-lg mt-0.5">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-bold text-teal-950 block">
              Announcement: {community.announcements[0].title}
            </span>
            <p className="text-xs text-teal-900 leading-relaxed mt-0.5">
              {community.announcements[0].content}
            </p>
          </div>
        </div>
      )}

      {/* COMMUNITY TABS */}
      <div className="flex items-center gap-6 border-b border-slate-200 mb-8 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'posts' ? 'text-teal-900 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Discussion & Updates ({community.posts.length})
          {activeTab === 'posts' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-700" />}
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'activities' ? 'text-teal-900 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Real-World Activities ({communityActivities.length})
          {activeTab === 'activities' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-700" />}
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'members' ? 'text-teal-900 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Members Roster ({community.members.length})
          {activeTab === 'members' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-700" />}
        </button>

        <button
          onClick={() => setActiveTab('impact')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'impact' ? 'text-teal-900 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Impact & Documentation
          {activeTab === 'impact' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-700" />}
        </button>
      </div>

      {/* TAB 1: POSTS & DISCUSSIONS */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {/* CREATE POST FORM */}
            <form onSubmit={handlePostSubmit} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <textarea
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Share environmental observations, well water depth readings, or upcoming ideas with the community..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-teal-600 bg-slate-50/50"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <input
                  type="url"
                  value={newPostPhoto}
                  onChange={(e) => setNewPostPhoto(e.target.value)}
                  placeholder="Optional image URL (e.g. photo of cleaned pond)..."
                  className="text-xs px-3 py-1.5 rounded border border-slate-200 w-full sm:w-80"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Update</span>
                </button>
              </div>
            </form>

            {/* POSTS LIST */}
            <div className="space-y-6">
              {community.posts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-xs text-slate-400">
                  No posts yet in this community. Start the conversation!
                </div>
              ) : (
                community.posts.map((post) => (
                  <div key={post.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.userAvatar}
                          alt={post.userName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{post.userName}</div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(post.timestamp).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed mb-4 whitespace-pre-line">
                      {post.content}
                    </p>

                    {post.photoUrl && (
                      <img
                        src={post.photoUrl}
                        alt="Community post attachment"
                        referrerPolicy="no-referrer"
                        className="w-full h-64 object-cover rounded-xl border border-slate-200 mb-4"
                      />
                    )}

                    {/* COMMENTS LIST */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                          <img
                            src={comment.avatar}
                            alt={comment.userName}
                            referrerPolicy="no-referrer"
                            className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                          />
                          <div className="bg-slate-50 p-2.5 rounded-lg flex-1 border border-slate-100">
                            <span className="font-semibold text-slate-900 mr-2">{comment.userName}</span>
                            <span className="text-slate-600">{comment.text}</span>
                          </div>
                        </div>
                      ))}

                      {/* ADD COMMENT INPUT */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCommentSubmit(post.id);
                          }}
                          placeholder="Write a reply or follow-up note..."
                          className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50"
                        />
                        <button
                          onClick={() => handleCommentSubmit(post.id)}
                          className="px-3 py-2 text-xs font-semibold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SIDEBAR: COMMUNITY LEADERS & QUICK ACTION */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Upcoming Community Actions
                </span>
                <button
                  onClick={() => setIsCreateActivityOpen(true)}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                >
                  + Organize
                </button>
              </div>

              {communityActivities.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-4">
                  No upcoming activities. Schedule one today!
                </div>
              ) : (
                <div className="space-y-3">
                  {communityActivities.slice(0, 3).map((act) => (
                    <div
                      key={act.id}
                      onClick={() => navigateToActivity(act.id)}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-teal-500 cursor-pointer transition-colors"
                    >
                      <div className="text-[10px] text-teal-700 font-bold uppercase mb-0.5">
                        {act.category} · {act.date}
                      </div>
                      <div className="text-xs font-bold text-slate-900">{act.title}</div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {act.participants.length} volunteers joined
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVITIES LIST & SCHEDULING */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Real-World Community Actions
              </h3>
              <p className="text-xs text-slate-500">
                Groundwater audits, stepwell desilting, trash traps, and shaded water kiosks
              </p>
            </div>
            <button
              onClick={() => setIsCreateActivityOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Activity</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityActivities.map((act) => (
              <div
                key={act.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="uppercase font-semibold text-teal-800">{act.category}</span>
                    <span className="capitalize">{act.status}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1.5 font-display">{act.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {act.description}
                  </p>
                  <div className="text-xs space-y-1 text-slate-700 mb-4 bg-slate-50 p-3 rounded-lg">
                    <div><strong>Date:</strong> {act.date} ({act.time})</div>
                    <div><strong>Location:</strong> {act.location.name}</div>
                    <div><strong>Volunteers:</strong> {act.participants.length} / {act.volunteerLimit}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => navigateToActivity(act.id)}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900"
                  >
                    View Details & Roster →
                  </button>
                  <button
                    onClick={() => openPromotionModal('activity', act)}
                    className="p-1.5 text-slate-400 hover:text-slate-700"
                    title="Share promotion card"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MEMBERS */}
      {activeTab === 'members' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 font-display mb-4">
            Active Community Volunteers & Admins ({community.members.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {community.members.map((member) => (
              <div
                key={member.userId}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-slate-300"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{member.name}</div>
                  <div className="text-[11px] text-teal-800 capitalize font-medium">{member.role}</div>
                  <div className="text-[10px] text-slate-400">Joined {member.joinedAt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: IMPACT & DOCUMENTATION */}
      {activeTab === 'impact' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 font-display mb-4">
              Documented Conservation Impact
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100">
                <span className="text-2xl font-bold font-mono text-teal-900 tabular-nums">
                  {community.impact.wasteRemovedKg || 4200} kg
                </span>
                <span className="text-xs text-teal-800 block mt-1">Waste & Debris Removed</span>
              </div>
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <span className="text-2xl font-bold font-mono text-emerald-900 tabular-nums">
                  {community.impact.rechargeStructuresMapped}
                </span>
                <span className="text-xs text-emerald-800 block mt-1">Percolation Pits Mapped</span>
              </div>
              <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-100">
                <span className="text-2xl font-bold font-mono text-sky-900 tabular-nums">
                  {community.impact.waterBodiesMonitored}
                </span>
                <span className="text-xs text-sky-800 block mt-1">Water Bodies Monitored</span>
              </div>
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                <span className="text-2xl font-bold font-mono text-amber-900 tabular-nums">
                  {community.impact.treesPlantedForShade || 650}
                </span>
                <span className="text-xs text-amber-800 block mt-1">Shade Canopies Planted</span>
              </div>
            </div>
            <div className="mt-4 text-[11px] text-slate-400 text-center">
              All environmental figures verified by ground documentation logs.
            </div>
          </div>
        </div>
      )}

      {/* CREATE ACTIVITY MODAL */}
      {isCreateActivityOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-900 font-display mb-1">
              Create Community Activity
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Schedule a practical, community-led environmental event.
            </p>

            <form onSubmit={handleCreateActivitySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  value={newActTitle}
                  onChange={(e) => setNewActTitle(e.target.value)}
                  placeholder="e.g. Ramkund Stepwell Desilting & Silt Trap Audit"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newActCategory}
                    onChange={(e) => setNewActCategory(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="cleanup">Water-Body Cleanup</option>
                    <option value="groundwater-audit">Groundwater Well Audit</option>
                    <option value="rwh-maintenance">Recharge Pit Desilting</option>
                    <option value="heat-shelter">Heatwave Hydration Kiosk</option>
                    <option value="education">Community Education Walk</option>
                    <option value="documentation">Environmental Documentation</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={newActDate}
                    onChange={(e) => setNewActDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Location Name & Address</label>
                <input
                  type="text"
                  value={newActLocation}
                  onChange={(e) => setNewActLocation(e.target.value)}
                  placeholder="e.g. Kothrud Ward 24 Park, Pune"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Description & Tasks</label>
                <textarea
                  value={newActDesc}
                  onChange={(e) => setNewActDesc(e.target.value)}
                  placeholder="What will volunteers do? Mention gloves/tools provided..."
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateActivityOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg"
                >
                  Publish Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
