import React from 'react';
import { useApp } from '../context/AppContext';
import { RoutePath } from '../types';
import {
  Compass,
  Sun,
  Clock,
  Sparkles,
  Layers,
  History,
  Award,
  Archive,
  Settings,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentRoute, setCurrentRoute, userProfile } = useApp();

  const navItems: Array<{ path: RoutePath; label: string; icon: any; symbol: string }> = [
    { path: '/today', label: 'Today', icon: Sun, symbol: '☼' },
    { path: '/tomorrow', label: 'Tomorrow', icon: Clock, symbol: '◷' },
    { path: '/constellation', label: 'Constellation', icon: Sparkles, symbol: '✦' },
    { path: '/progress', label: 'Progress Lab', icon: Layers, symbol: '◈' },
    { path: '/history', label: 'History', icon: History, symbol: '◴' },
    { path: '/rewards', label: 'Rewards', icon: Award, symbol: '♢' },
    { path: '/archive', label: 'Archive', icon: Archive, symbol: '◎' },
    { path: '/settings', label: 'Settings', icon: Settings, symbol: '⚙' }
  ];

  const xpPercent = Math.min(100, Math.round((userProfile.currentXP / userProfile.nextLevelXP) * 100));

  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: '#fcfbf7',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1rem',
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxSizing: 'border-box',
        zIndex: 50
      }}
      className="desktop-sidebar"
    >
      {/* Top Header */}
      <div>
        {/* Brand Header */}
        <div style={{ padding: '0.25rem 0.5rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #c49a45 0%, #8b6f4e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(196, 154, 69, 0.25)',
                color: '#ffffff'
              }}
            >
              <Compass size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h1
                className="font-serif"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '0.02em',
                  lineHeight: 1.1
                }}
              >
                Daily Quest
              </h1>
              <p
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
              >
                Plan. Execute. Level Up.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => {
            const isActive = currentRoute === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => setCurrentRoute(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? 'var(--gold-bg)' : 'transparent',
                  color: isActive ? 'var(--gold-primary)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1rem', color: isActive ? 'var(--gold-primary)' : 'var(--text-muted)' }}>
                    {item.symbol}
                  </span>
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Card */}
      <div
        className="parchment-card"
        style={{
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Lv. {userProfile.level} — {userProfile.levelTitle}
          </span>
          <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--gold-primary)', fontWeight: 700 }}>
            {userProfile.currentXP} XP
          </span>
        </div>

        {/* XP Progress Bar */}
        <div
          style={{
            height: '6px',
            width: '100%',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '999px',
            overflow: 'hidden',
            marginBottom: '6px'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${xpPercent}%`,
              backgroundColor: 'var(--gold-primary)',
              borderRadius: '999px',
              transition: 'width 0.4s ease'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          <span>{userProfile.currentStreak} Day Streak 🔥</span>
          <span>Next: {userProfile.nextLevelXP} XP</span>
        </div>
      </div>
    </aside>
  );
};
