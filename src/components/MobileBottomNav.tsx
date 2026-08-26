import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RoutePath } from '../types';
import {
  Sun,
  Clock,
  Layers,
  Award,
  MoreHorizontal,
  Sparkles,
  History,
  Archive,
  Settings,
  X
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentRoute, setCurrentRoute, userProfile } = useApp();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { path: '/today' as RoutePath, label: 'Today', icon: Sun },
    { path: '/tomorrow' as RoutePath, label: 'Tomorrow', icon: Clock },
    { path: '/progress' as RoutePath, label: 'Progress', icon: Layers },
    { path: '/rewards' as RoutePath, label: 'Rewards', icon: Award }
  ];

  const moreItems = [
    { path: '/constellation' as RoutePath, label: 'Constellation', icon: Sparkles, desc: '365-Day Star Vault' },
    { path: '/history' as RoutePath, label: 'Expedition Journal', icon: History, desc: 'Past Daily Retrospectives' },
    { path: '/archive' as RoutePath, label: 'The Life Vault', icon: Archive, desc: 'All-Time Records & Milestones' },
    { path: '/settings' as RoutePath, label: 'Settings', icon: Settings, desc: 'Domains, Backups & Preferences' }
  ];

  const isMoreActive = moreItems.some(item => item.path === currentRoute);

  const handleSelectRoute = (path: RoutePath) => {
    setCurrentRoute(path);
    setIsMoreOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. FIXED BOTTOM DOCK (Mobile only: <= 767px) */}
      <nav
        className="mobile-bottom-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'calc(62px + env(safe-area-inset-bottom, 12px))',
          paddingBottom: 'env(safe-area-inset-bottom, 12px)',
          backgroundColor: 'rgba(253, 251, 247, 0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-bottom-nav)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 900
        }}
      >
        {mainTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentRoute === tab.path && !isMoreOpen;

          return (
            <button
              key={tab.path}
              onClick={() => handleSelectRoute(tab.path)}
              style={{
                flex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                color: isActive ? 'var(--gold-primary)' : 'var(--text-muted)',
                position: 'relative',
                minWidth: '44px',
                minHeight: '44px'
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: '4px',
                    width: '18px',
                    height: '3px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--gold-primary)'
                  }}
                />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span style={{ fontSize: '0.68rem', fontWeight: isActive ? 800 : 600, letterSpacing: '0.02em' }}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* 5th Tab: "More" Drawer Button */}
        <button
          onClick={() => setIsMoreOpen(prev => !prev)}
          style={{
            flex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: isMoreActive || isMoreOpen ? 'var(--gold-primary)' : 'var(--text-muted)',
            position: 'relative',
            minWidth: '44px',
            minHeight: '44px'
          }}
        >
          {(isMoreActive || isMoreOpen) && (
            <div
              style={{
                position: 'absolute',
                top: '4px',
                width: '18px',
                height: '3px',
                borderRadius: '999px',
                backgroundColor: 'var(--gold-primary)'
              }}
            />
          )}
          <MoreHorizontal size={20} strokeWidth={isMoreActive || isMoreOpen ? 2.5 : 1.8} />
          <span style={{ fontSize: '0.68rem', fontWeight: isMoreActive || isMoreOpen ? 800 : 600, letterSpacing: '0.02em' }}>
            More
          </span>
        </button>
      </nav>

      {/* 2. "MORE" ACTION SHEET / BOTTOM DRAWER */}
      {isMoreOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(35, 31, 26, 0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 950,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}
          onClick={() => setIsMoreOpen(false)}
        >
          <div
            className="animate-slide-up"
            style={{
              backgroundColor: '#ffffff',
              borderTopLeftRadius: 'var(--radius-xl)',
              borderTopRightRadius: 'var(--radius-xl)',
              padding: '1.5rem 1.25rem calc(80px + env(safe-area-inset-bottom, 20px))',
              borderTop: '1.5px solid var(--border-medium)',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
              maxHeight: '85vh',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <div className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Expedition Destinations
                </div>
                <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                  Lv. {userProfile.level} · {userProfile.levelTitle}
                </div>
              </div>

              <button
                onClick={() => setIsMoreOpen(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-muted)'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* List of Additional Destinations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {moreItems.map(item => {
                const Icon = item.icon;
                const isActive = currentRoute === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleSelectRoute(item.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isActive ? 'var(--gold-bg)' : 'var(--bg-subtle)',
                      border: isActive ? '1px solid rgba(196, 154, 69, 0.4)' : '1px solid transparent',
                      textAlign: 'left',
                      width: '100%',
                      minHeight: '48px'
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: isActive ? 'var(--gold-primary)' : '#ffffff',
                        color: isActive ? '#ffffff' : 'var(--gold-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Icon size={18} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: isActive ? 'var(--gold-primary)' : 'var(--text-primary)' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
