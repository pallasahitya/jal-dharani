import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EducationTopic } from '../../types';
import { ASSET_IMAGES } from '../../data/seedData';
import {
  X,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  MapPin,
  Users,
  Calendar,
  ChevronRight,
  ArrowRight,
  Info,
} from 'lucide-react';

interface TopicDetailModalProps {
  topic: EducationTopic;
  onClose: () => void;
}

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({ topic, onClose }) => {
  const { setNavTab, setMapLayer, navigateToWaterBody } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizExplanation, setShowQuizExplanation] = useState<Record<number, boolean>>({});

  const currentStage = topic.stages[currentStepIndex];

  const handleOptionSelect = (qIdx: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }));
    setShowQuizExplanation((prev) => ({ ...prev, [qIdx]: true }));
  };

  const handleActionClick = () => {
    if (topic.suggestedAction.actionType === 'open-map') {
      if (topic.suggestedAction.filterValue) {
        setMapLayer(topic.suggestedAction.filterValue as any);
      }
      setNavTab('maps');
      onClose();
    } else if (topic.suggestedAction.actionType === 'find-community') {
      setNavTab('communities');
      onClose();
    } else if (topic.suggestedAction.actionType === 'create-activity') {
      setNavTab('activities');
      onClose();
    }
  };

  // Determine appropriate diagram asset based on topic
  const getTopicDiagram = () => {
    if (topic.category === 'groundwater-aquifers' || topic.category === 'rainwater-recharge') {
      return ASSET_IMAGES.diagramAquiferRecharge;
    }
    if (topic.category === 'heat-water' || topic.category === 'climate-monsoon' || topic.category === 'el-nino') {
      return ASSET_IMAGES.heatUrbanResilience;
    }
    if (topic.category === 'surface-water') {
      return ASSET_IMAGES.heroWaterCommunity;
    }
    return ASSET_IMAGES.waterbodyLakeRestored;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn">
        {/* TOP BAR */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider">
              <span>Education Module</span>
              <span aria-hidden="true">·</span>
              <span>{topic.readTime}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">{topic.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-STEP LEARNING STAGE PROGRESSOR */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex items-center justify-between gap-2 overflow-x-auto text-xs">
          {topic.stages.map((stage, idx) => {
            const isCurrent = currentStepIndex === idx;
            const isCompleted = idx < currentStepIndex;

            const stageLabels: Record<string, string> = {
              WHAT_IS_IT: '1. What is it?',
              WHY_DOES_IT_MATTER: '2. Why it matters',
              HOW_DOES_IT_WORK: '3. How it works',
              WHAT_IS_HAPPENING_LOCALLY: '4. Local Reality',
              WHAT_CAN_PEOPLE_DO: '5. Action Guide',
            };

            return (
              <button
                key={stage.step}
                onClick={() => setCurrentStepIndex(idx)}
                className={`py-1.5 px-3 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-teal-700 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-teal-50 text-teal-900 hover:bg-teal-100'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>{stageLabels[stage.step] || stage.heading}</span>
              </button>
            );
          })}
        </div>

        {/* CONTENT STAGE BODY */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-7 space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 font-display">
                {currentStage.heading}
              </h3>

              <p className="text-sm text-slate-700 leading-relaxed font-sans">
                {currentStage.content}
              </p>

              <div className="p-4 bg-teal-50/60 border border-teal-200/80 rounded-xl space-y-2 mt-4">
                <span className="text-xs font-bold text-teal-950 uppercase tracking-wide block">
                  Core Understanding:
                </span>
                <ul className="space-y-2 text-xs text-teal-900">
                  {currentStage.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-teal-700 font-bold">·</span>
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:col-span-5">
              <img
                src={getTopicDiagram()}
                alt={topic.title}
                referrerPolicy="no-referrer"
                className="w-full h-48 md:h-56 object-cover rounded-xl border border-slate-200 shadow-sm"
              />
              <div className="mt-2 text-[11px] text-slate-500 text-center">
                Visualizing environmental hydrology & community resilience
              </div>
            </div>
          </div>

          {/* INTERACTIVE KNOWLEDGE QUIZ IF ON FINAL STAGE */}
          {currentStepIndex === topic.stages.length - 1 && topic.quiz.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Quick Knowledge Check
                </h4>
              </div>

              <div className="space-y-6">
                {topic.quiz.map((q, qIdx) => {
                  const selectedOpt = selectedAnswers[qIdx];
                  const hasAnswered = selectedOpt !== undefined;
                  const isCorrect = selectedOpt === q.correctIndex;

                  return (
                    <div key={qIdx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-xs font-semibold text-slate-900 mb-3">
                        {qIdx + 1}. {q.question}
                      </div>

                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          let optStyle = 'border-slate-200 hover:border-slate-300 bg-white text-slate-700';

                          if (hasAnswered) {
                            if (optIdx === q.correctIndex) {
                              optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                            } else if (optIdx === selectedOpt && !isCorrect) {
                              optStyle = 'border-rose-400 bg-rose-50 text-rose-800';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={hasAnswered}
                              onClick={() => handleOptionSelect(qIdx, optIdx)}
                              className={`w-full p-2.5 text-left text-xs rounded-lg border transition-colors flex items-center justify-between ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {hasAnswered && optIdx === q.correctIndex && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {showQuizExplanation[qIdx] && (
                        <div
                          className={`mt-3 p-3 rounded-lg text-xs leading-relaxed ${
                            isCorrect ? 'bg-emerald-50/80 text-emerald-900' : 'bg-amber-50/80 text-amber-900'
                          }`}
                        >
                          <strong>{isCorrect ? 'Correct!' : 'Clarification:'}</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM NAVIGATION FOOTER */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            ← Previous Stage
          </button>

          <div className="flex items-center gap-3">
            {currentStepIndex < topic.stages.length - 1 ? (
              <button
                onClick={() => setCurrentStepIndex((prev) => Math.min(topic.stages.length - 1, prev + 1))}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Next Stage</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleActionClick}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>{topic.suggestedAction.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
