import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { TodayPage } from './pages/TodayPage';
import { TomorrowPage } from './pages/TomorrowPage';
import { ConstellationPage } from './pages/ConstellationPage';
import { ProgressLabPage } from './pages/ProgressLabPage';
import { HistoryPage } from './pages/HistoryPage';
import { RewardsPage } from './pages/RewardsPage';
import { ArchivePage } from './pages/ArchivePage';
import { SettingsPage } from './pages/SettingsPage';
import { DailyReviewModal } from './components/DailyReviewModal';
import { MobileBottomNav } from './components/MobileBottomNav';

export const App: React.FC = () => {
  const { currentRoute } = useApp();
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const renderActivePage = () => {
    switch (currentRoute) {
      case '/today':
        return <TodayPage />;
      case '/tomorrow':
        return <TomorrowPage />;
      case '/constellation':
        return <ConstellationPage />;
      case '/progress':
        return <ProgressLabPage />;
      case '/history':
        return <HistoryPage />;
      case '/rewards':
        return <RewardsPage />;
      case '/archive':
        return <ArchivePage />;
      case '/settings':
        return <SettingsPage />;
      default:
        return <TodayPage />;
    }
  };

  return (
    <div className="app-wrapper">
      {/* Persistent Left Hand Side (LHS) Sidebar for Desktop */}
      <Sidebar />

      {/* Main Viewport */}
      <main className="main-viewport">
        {/* Global Explorer TopBar */}
        <TopBar onOpenReview={() => setIsReviewOpen(true)} />

        {/* Dedicated Page Route */}
        {renderActivePage()}
      </main>

      {/* Daily Review & Reflection Modal */}
      <DailyReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
      />

      {/* Fixed Mobile Bottom Navigation Dock */}
      <MobileBottomNav />
    </div>
  );
};
