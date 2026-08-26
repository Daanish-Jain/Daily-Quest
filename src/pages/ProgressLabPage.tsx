import React from 'react';
import { useApp } from '../context/AppContext';
import { calculateDailyScore, formatDateString } from '../services/storage';
import { Layers, Activity, Compass, BookOpen, Terminal } from 'lucide-react';

export const ProgressLabPage: React.FC = () => {
  const { tasks, userProfile, journey } = useApp();

  const today = new Date();

  // 1. River of Days data (past 30 days wave data)
  const riverDays = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateString(d);
    const score = calculateDailyScore(tasks, dateStr);
    riverDays.push({
      dateStr,
      score: score.scorePercentage || 50,
      total: score.total
    });
  }

  // Multi-layered contour paths for topographic feel
  const riverPoints1 = riverDays.map((d, idx) => {
    const x = (idx / 29) * 800;
    const y = 145 - (d.score / 100) * 85;
    return `${x},${y}`;
  }).join(' L ');

  const riverPoints2 = riverDays.map((d, idx) => {
    const x = (idx / 29) * 800;
    const y = 155 - ((d.score * 0.7) / 100) * 75;
    return `${x},${y}`;
  }).join(' L ');

  // 2. Year Ring (60 radial graduations like an antique astrolabe)
  const totalTicks = 60;
  const yearSegments = [];
  for (let i = 0; i < totalTicks; i++) {
    const angle = (i / totalTicks) * 360;
    const isCompleted = i < 48; // 187 days relative
    const color = i < 38 ? 'var(--status-done)' : i < 48 ? 'var(--status-partial)' : 'rgba(168, 150, 130, 0.25)';
    yearSegments.push({ angle, color, isCompleted });
  }

  // 3. Category Energy Data (Neutral and calm colors)
  const categoryEnergy = [
    { name: 'Projects', score: 82, icon: <Terminal size={14} color="var(--text-secondary)" /> },
    { name: 'Learning', score: 74, icon: <BookOpen size={14} color="var(--text-secondary)" /> },
    { name: 'Fitness', score: 61, icon: <Activity size={14} color="var(--text-secondary)" /> },
    { name: 'Personal', score: 48, icon: <Compass size={14} color="var(--text-secondary)" /> }
  ];

  // 4. Day DNA (Monday to Sunday)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayDNASequences = [
    ['done', 'done', 'partial', 'done', 'done'],
    ['done', 'partial', 'done', 'incomplete', 'done'],
    ['done', 'done', 'done', 'done', 'partial'],
    ['partial', 'done', 'done', 'incomplete', 'done'],
    ['done', 'done', 'partial', 'done', 'done'],
    ['done', 'done', 'incomplete', 'done', 'done'],
    ['done', 'partial', 'done', 'done', 'done']
  ];

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
          <Layers size={13} />
          <span>The Observatory</span>
        </div>
        <h1 className="font-serif text-page-title" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
          Progress Lab
        </h1>
        <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
          Artifacts of your consistency: topographic rhythms, ancient year rings, and biological mission fingerprints.
        </p>
      </div>

      {(!journey?.startedAt || userProfile.daysTracked === 0) ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--gold-primary)' }}>
            <Activity size={40} />
          </div>
          <h1 className="font-serif text-hero-title" style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            YOUR RIVER HASN'T FORMED YET
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px' }}>
            Complete your first day to start tracking your progress topography.
          </p>
        </div>
      ) : (
        <>
          {/* 1. RIVER OF DAYS (Large Topographic Landscape) */}
          <div
        className="parchment-card"
        style={{
          padding: 'clamp(1rem, 2.5vw, 1.75rem)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '1.5rem',
          backgroundColor: '#faf7f0',
          border: '1.5px solid var(--border-medium)',
          boxShadow: 'var(--shadow-card)',
          width: '100%'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <h2 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            River of Days
          </h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--gold-primary)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Topographic Flow
          </span>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Mountain ridges form during unbroken execution streaks. Valleys represent restorative breath periods.
        </p>

        {/* Topographic Contoured Wave Canvas */}
        <div style={{ width: '100%', height: '180px', backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '8px', border: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
          <svg viewBox="0 0 800 180" style={{ width: '100%', minWidth: '500px', height: '100%' }}>
            <defs>
              <linearGradient id="contourGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2d7a4f" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="contourGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c49a45" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <circle cx="700" cy="35" r="16" fill="#d99b26" opacity="0.65" />
            <path d={`M 0,180 L 0,140 L ${riverPoints2} L 800,180 Z`} fill="url(#contourGrad2)" />
            <path d={`M 0,140 L ${riverPoints2}`} fill="none" stroke="#c49a45" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            <path d={`M 0,180 L 0,100 L ${riverPoints1} L 800,180 Z`} fill="url(#contourGrad1)" />
            <path d={`M 0,100 L ${riverPoints1}`} fill="none" stroke="#2d7a4f" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* 2. Middle Artifacts Grid (Responsive Single-Column on Phone, Multi-Column on Tablet/Desktop) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', width: '100%' }}>
        {/* YEAR RING */}
        <div className="parchment-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-xl)', textAlign: 'center', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Year Ring
            </h3>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>365-DAY DIAL</span>
          </div>

          <div style={{ position: 'relative', width: '190px', height: '190px', margin: '0 auto 0.75rem' }}>
            <svg width="190" height="190" viewBox="0 0 220 220">
              {yearSegments.map((seg, idx) => {
                const rad = (seg.angle * Math.PI) / 180;
                const x1 = 110 + Math.cos(rad) * 85;
                const y1 = 110 + Math.sin(rad) * 85;
                const x2 = 110 + Math.cos(rad) * 102;
                const y2 = 110 + Math.sin(rad) * 102;
                return (
                  <line
                    key={idx}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={seg.color}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span className="font-mono" style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                {userProfile.daysTracked}
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                Days Tracked
              </span>
              <span className="font-mono" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--status-done)', marginTop: '2px' }}>
                {userProfile.averageCompletion}% Avg
              </span>
              <span style={{ fontSize: '0.62rem', color: 'var(--gold-primary)', fontWeight: 700 }}>
                {userProfile.currentStreak}d Streak 🔥
              </span>
            </div>
          </div>
        </div>

        {/* MISSION BALANCE */}
        <div className="parchment-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-xl)', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Mission Balance
            </h3>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>ORBITAL MODEL</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '1rem 0', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '110px', height: '110px' }}>
              <svg width="110" height="110" viewBox="0 0 130 130">
                <circle cx="65" cy="65" r="16" fill="var(--gold-primary)" opacity="0.9" />
                <circle cx="65" cy="65" r="32" fill="none" stroke="rgba(45, 122, 79, 0.35)" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="97" cy="65" r="10" fill="var(--status-done)" />
                <circle cx="65" cy="65" r="48" fill="none" stroke="rgba(217, 155, 38, 0.35)" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="31" cy="65" r="7" fill="var(--status-partial)" />
                <circle cx="65" cy="65" r="60" fill="none" stroke="rgba(200, 90, 72, 0.35)" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="65" cy="5" r="6" fill="var(--status-incomplete)" />
              </svg>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-done)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>DONE 62%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-partial)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>PARTIAL 21%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-incomplete)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>INCOMPLETE 17%</span>
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORY ENERGY */}
        <div className="parchment-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-xl)', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Category Energy
            </h3>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>ALLOCATION</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {categoryEnergy.map(cat => (
              <div key={cat.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
                    {cat.score}%
                  </span>
                </div>
                <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${cat.score}%`, backgroundColor: 'var(--gold-primary)', borderRadius: '999px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DAY DNA */}
        <div className="parchment-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-xl)', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Day DNA
            </h3>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>FINGERPRINT</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0' }}>
            {daysOfWeek.map((day, idx) => (
              <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>{day}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '5px 3px', backgroundColor: 'var(--bg-input)', borderRadius: '999px' }}>
                  {dayDNASequences[idx].map((status, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: status === 'done' ? 'var(--status-done)' : status === 'partial' ? 'var(--status-partial)' : 'var(--status-incomplete)'
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};
