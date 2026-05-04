'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { ToastProvider } from '@/components/ui/Toast';
import StatusBar from '@/components/ui/StatusBar';
import TabBar, { type TabKey } from '@/components/ui/TabBar';
import HomeScreen from '@/components/screens/HomeScreen';
import TopicScreen from '@/components/screens/TopicScreen';
import ReadingScreen from '@/components/screens/ReadingScreen';
import MatchScreen from '@/components/screens/MatchScreen';
import ChatScreen from '@/components/screens/ChatScreen';
import Onboarding from '@/components/screens/Onboarding';
import ProfileModal from '@/components/screens/ProfileModal';

export default function Page() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

function AppContent() {
  const onboarded = useStore((s) => s.onboarded);
  const profile = useStore((s) => s.profile);
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Avoid hydration mismatch — show nothing until client state loads
  if (!hydrated) {
    return <div className="fixed inset-0 bg-bg" />;
  }

  // Show onboarding if not completed
  if (!onboarded || !profile.name) {
    return <Onboarding />;
  }

  return (
    <>
      <div
        className="fixed inset-0 flex flex-col md:max-w-[480px] md:mx-auto md:border-l md:border-r md:border-line"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <StatusBar />

        <div
          className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-hide"
          style={{ paddingBottom: 'calc(76px + env(safe-area-inset-bottom))' }}
          key={activeTab}
        >
          {activeTab === 'home' && (
            <HomeScreen onNavigate={setActiveTab} onOpenProfile={() => setProfileOpen(true)} />
          )}
          {activeTab === 'topic' && <TopicScreen />}
          {activeTab === 'reading' && <ReadingScreen />}
          {activeTab === 'match' && <MatchScreen />}
          {activeTab === 'chat' && <ChatScreen />}
        </div>

        <TabBar active={activeTab} onChange={setActiveTab} />
      </div>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
