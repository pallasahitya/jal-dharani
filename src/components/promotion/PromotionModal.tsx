import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Community } from '../../types';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  Calendar,
  MapPin,
  Users,
  Droplet,
  ExternalLink,
} from 'lucide-react';

export const PromotionModal: React.FC = () => {
  const { isPromotionModalOpen, closePromotionModal, promotionTarget } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isPromotionModalOpen || !promotionTarget) return null;

  const isActivity = promotionTarget.type === 'activity';
  const activity = isActivity ? (promotionTarget.item as Activity) : null;
  const community = !isActivity
    ? (promotionTarget.item as Community)
    : null;

  const cardTitle = activity ? activity.title : community?.name || '';
  const cardSubtitle = activity
    ? `${activity.communityName} · ${activity.category.toUpperCase()}`
    : community?.tagline || '';
  const cardDesc = activity ? activity.description : community?.description || '';
  const cardLocation = activity
    ? activity.location.name
    : `${community?.location.city}, ${community?.location.state}`;
  const cardDate = activity ? `${activity.date} (${activity.time})` : `Active Community Collective`;
  const volunteerMetric = activity
    ? `${activity.participants.length} volunteers joined (Max ${activity.volunteerLimit})`
    : `${community?.impact.membersCount} active citizen members`;

  const shareUrl = `${window.location.origin}/#${isActivity ? 'activity' : 'community'}-${promotionTarget.item.id}`;

  const formattedShareMessage = `🌊 *${cardTitle}*\n${cardSubtitle}\n\n📍 *Location:* ${cardLocation}\n🗓️ *When:* ${cardDate}\n🤝 *Community:* ${volunteerMetric}\n\n"${cardDesc.slice(0, 180)}..."\n\n👉 Join this citizen conservation movement: ${shareUrl}\n#JalDharani #WaterResilience #CommunityActionIndia`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(formattedShareMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 animate-fadeIn">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-teal-700" />
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Community Promotion Card Generator
            </h3>
          </div>
          <button
            onClick={closePromotionModal}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VISUAL SHAREABLE CARD PREVIEW */}
        <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-teal-800/40 mb-6 relative overflow-hidden">
          {/* Subtle water decorative graphic */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between text-teal-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <div className="flex items-center gap-1.5">
              <Droplet className="w-4 h-4 fill-teal-400 text-teal-400" />
              <span>Jal-Dharani Action Network</span>
            </div>
            <span>Community Resilience</span>
          </div>

          <h4 className="text-xl font-extrabold font-display leading-tight mb-1 text-white">
            {cardTitle}
          </h4>
          <div className="text-xs text-teal-200/90 font-medium mb-4">{cardSubtitle}</div>

          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-5">
            {cardDesc}
          </p>

          <div className="space-y-1.5 text-xs text-teal-100 bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span className="truncate">{cardLocation}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span>{cardDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span>{volunteerMetric}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-teal-300 font-semibold">
            <span>Stand Up for Local Water & Heat Resilience</span>
            <span>Scan or Click to Join</span>
          </div>
        </div>

        {/* SHARING ACTIONS */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 text-xs px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 font-mono select-all"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={handleCopyText}
              className="flex-1 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              {copiedText ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedText ? 'WhatsApp Text Copied!' : 'Copy Formatted Social / WhatsApp Message'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
