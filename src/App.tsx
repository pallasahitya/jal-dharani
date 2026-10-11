/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { InteractiveMap } from './components/map/InteractiveMap';
import { WaterBodyDetail } from './components/waterbody/WaterBodyDetail';
import { EducationDashboard } from './components/education/EducationDashboard';
import { CommunitiesView } from './components/communities/CommunitiesView';
import { ActivitiesView } from './components/activities/ActivitiesView';
import { ProfileView } from './components/profile/ProfileView';
import { ReportModal } from './components/reports/ReportModal';
import { PromotionModal } from './components/promotion/PromotionModal';
import { AuthModal } from './components/auth/AuthModal';

const AppContent: React.FC = () => {
  const { navTab, selectedWaterBodyId, setSelectedWaterBodyId } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-200 selection:text-teal-900">
      {/* 3-ZONE COMPLIANT TOP BAR */}
      <Navbar />

      {/* MAIN VIEW CONTENT */}
      <main className="flex-1">
        {navTab === 'home' && <HomeDashboard />}

        {navTab === 'maps' && (
          <>
            {selectedWaterBodyId ? (
              <WaterBodyDetail
                waterBodyId={selectedWaterBodyId}
                onBack={() => setSelectedWaterBodyId(null)}
              />
            ) : (
              <InteractiveMap
                onSelectWaterBody={(wbId) => setSelectedWaterBodyId(wbId)}
              />
            )}
          </>
        )}

        {navTab === 'communities' && <CommunitiesView />}

        {navTab === 'activities' && <ActivitiesView />}

        {navTab === 'education' && <EducationDashboard />}

        {navTab === 'profile' && <ProfileView />}
      </main>

      {/* FOOTER */}
      <Footer />

      {/* GLOBAL MODALS */}
      <ReportModal />
      <PromotionModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
