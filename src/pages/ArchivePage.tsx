import React from 'react';
import { useApp } from '../context/AppContext';
import { Archive, Trophy, Sparkles, Compass, Star } from 'lucide-react';

export const ArchivePage: React.FC = () => {
  const { userProfile, journey } = useApp();

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
          <Archive size={13} />
          <span>Your Life Record</span>
        </div>
        <h1 className="font-serif text-page-title" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
          The Life Vault
        </h1>
        <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
          A visual autobiography of the habits, grit, and compound momentum that define who you are.
        </p>
      </div>

      {!journey?.startedAt || userProfile.daysTracked === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--gold-primary)' }}>
            <Archive size={40} />
          </div>
          <h1 className="font-serif text-hero-title" style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            YOUR ARCHIVE IS EMPTY
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px' }}>
            Your history will be written here as you complete missions and forge your path.
          </p>
        </div>
      ) : (
        <>
          {/* Main Life Vault Showcase */}
      <div
        className="parchment-card"
        style={{
          padding: 'clamp(1.25rem, 3vw, 2rem)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '1.5rem',
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--border-medium)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <div>
          <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Life Records & Milestones
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Total Days Logged:</span>
              <span className="font-mono" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{userProfile.daysTracked} days</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Missions Accomplished:</span>
              <span className="font-mono" style={{ fontWeight: 800, color: 'var(--status-done)' }}>{userProfile.missionsCompleted.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Longest Unbroken Trail:</span>
              <span className="font-mono" style={{ fontWeight: 800, color: 'var(--gold-primary)' }}>{userProfile.bestStreak} days</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Historical Completion:</span>
              <span className="font-mono" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{userProfile.averageCompletion}%</span>
            </div>
          </div>
        </div>

        {/* Miniature Journey Constellation Centerpiece */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: '#faf7f0',
            border: '1px solid rgba(196, 154, 69, 0.35)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--gold-primary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
            YOUR PERSONAL CONSTELLATION
          </div>

          <svg viewBox="0 0 240 100" style={{ width: '100%', height: '90px', margin: '0 auto' }}>
            <line x1="20" y1="50" x2="60" y2="30" stroke="rgba(196, 154, 69, 0.4)" strokeWidth="1.5" />
            <line x1="60" y1="30" x2="110" y2="70" stroke="rgba(196, 154, 69, 0.4)" strokeWidth="1.5" />
            <line x1="110" y1="70" x2="160" y2="40" stroke="rgba(196, 154, 69, 0.4)" strokeWidth="1.5" />
            <line x1="160" y1="40" x2="220" y2="50" stroke="rgba(196, 154, 69, 0.4)" strokeWidth="1.5" />

            <circle cx="20" cy="50" r="4" fill="var(--status-done)" />
            <circle cx="60" cy="30" r="5" fill="var(--gold-primary)" />
            <circle cx="110" cy="70" r="6" fill="var(--status-done)" />
            <circle cx="160" cy="40" r="5" fill="var(--status-partial)" />
            <circle cx="220" cy="50" r="6" fill="var(--status-done)" />
          </svg>

          <p className="font-serif" style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontStyle: 'italic', marginTop: '4px' }}>
            "Consistency builds compound growth."
          </p>
        </div>
      </div>

      {/* Hall of Fame Records */}
      {userProfile.daysTracked > 0 && (
        <>
          <h2 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Hall of Fame Records
          </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', width: '100%' }}>
        <div className="parchment-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-primary)', marginBottom: '6px' }}>
            <Trophy size={18} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Golden Focus Era</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Achieved 23 consecutive days with over 85% execution mastery.
          </p>
        </div>

        <div className="parchment-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-done)', marginBottom: '6px' }}>
            <Star size={18} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>48 Perfect Days</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            48 distinct days with 100% mission completion and maximum Day Power logged.
          </p>
        </div>

        <div className="parchment-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b6f4e', marginBottom: '6px' }}>
            <Compass size={18} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>187 Stars</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Celestial vault illuminated across 6 dynamic seasons of personal growth.
          </p>
        </div>
      </div>
        </>
      )}
        </>
      )}
    </div>
  );
};
