import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EducationTopic } from '../../types';
import { InteractiveSimulation } from './InteractiveSimulation';
import { TopicDetailModal } from './TopicDetailModal';
import {
  Droplet,
  Waves,
  Layers,
  CloudRain,
  Flame,
  AlertTriangle,
  CloudLightning,
  Compass,
  ArrowRight,
  BookOpen,
  Filter,
} from 'lucide-react';

export const EducationDashboard: React.FC = () => {
  const { educationTopics, selectedTopicId, setSelectedTopicId, setNavTab, setMapLayer } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const selectedTopic = educationTopics.find((t) => t.id === selectedTopicId);

  const getTopicIcon = (category: EducationTopic['category']) => {
    switch (category) {
      case 'water-pollution':
        return <Droplet className="w-5 h-5 text-sky-600" />;
      case 'surface-water':
        return <Waves className="w-5 h-5 text-blue-600" />;
      case 'groundwater-aquifers':
        return <Layers className="w-5 h-5 text-emerald-700" />;
      case 'rainwater-recharge':
        return <CloudRain className="w-5 h-5 text-teal-600" />;
      case 'heat-water':
        return <Flame className="w-5 h-5 text-rose-600" />;
      case 'floods-droughts':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'climate-monsoon':
        return <CloudLightning className="w-5 h-5 text-indigo-600" />;
      case 'el-nino':
        return <Compass className="w-5 h-5 text-purple-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-teal-600" />;
    }
  };

  const filteredTopics = educationTopics.filter((t) => {
    if (activeCategoryFilter === 'all') return true;
    if (activeCategoryFilter === 'water') {
      return ['water-pollution', 'surface-water', 'groundwater-aquifers', 'rainwater-recharge'].includes(t.category);
    }
    if (activeCategoryFilter === 'heat-climate') {
      return ['heat-water', 'floods-droughts', 'climate-monsoon', 'el-nino'].includes(t.category);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* HEADER SECTION */}
      <div className="mb-10">
        <div className="text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
          Citizen Environmental Literacy
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display mb-3">
          Education Dashboard: Understand Before Taking Action
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Groundwater depletion, intense summer heat, and flash flooding are not random events. Learn the scientific principles governing Indian water bodies and aquifers, dispel common myths, and understand the practical steps communities can take without waiting for government intervention.
        </p>
      </div>

      {/* EMBEDDED INTERACTIVE SIMULATION (Infiltration vs Runoff & Heat Surge) */}
      <InteractiveSimulation />

      {/* FILTER TABS */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Core Curriculum Categories ({educationTopics.length})
          </h2>
          <div className="text-xs text-slate-500">
            Click any module for the complete 5-stage interactive guide & quiz
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeCategoryFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All 8 Topics
          </button>
          <button
            onClick={() => setActiveCategoryFilter('water')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeCategoryFilter === 'water'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Water & Aquifers
          </button>
          <button
            onClick={() => setActiveCategoryFilter('heat-climate')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeCategoryFilter === 'heat-climate'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Heat & Climate
          </button>
        </div>
      </div>

      {/* TOPIC CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {filteredTopics.map((topic) => {
          return (
            <div
              key={topic.id}
              onClick={() => setSelectedTopicId(topic.id)}
              className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-teal-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-teal-50 transition-colors">
                    {getTopicIcon(topic.category)}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {topic.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-display mb-1.5 group-hover:text-teal-900 transition-colors">
                  {topic.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-1 mb-2 font-medium">
                  {topic.subtitle}
                </p>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {topic.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-semibold group-hover:text-teal-900">
                <span>Start Learning</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* EDUCATION-TO-ACTION BRIDGE */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl">
          <span className="text-xs uppercase font-semibold text-teal-300 tracking-wider block mb-1">
            Turn Knowledge into Community Action
          </span>
          <h3 className="text-2xl font-bold font-display mb-2">
            Ready to apply what you have learned in your neighborhood?
          </h3>
          <p className="text-xs text-teal-100/90 leading-relaxed">
            Explore your local water body and aquifer conditions on the map, join an active community near you, or organize a real-world activity like percolation pit desilting or a heat shelter.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setNavTab('maps')}
            className="px-4 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors text-center shadow-xs"
          >
            Explore Interactive Map
          </button>
          <button
            onClick={() => setNavTab('communities')}
            className="px-4 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors text-center shadow-xs"
          >
            Join Local Community
          </button>
        </div>
      </div>

      {/* TOPIC DETAIL MODAL IF OPEN */}
      {selectedTopic && (
        <TopicDetailModal
          topic={selectedTopic}
          onClose={() => setSelectedTopicId(null)}
        />
      )}
    </div>
  );
};
