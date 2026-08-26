import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { calculateDailyScore, formatDateString, formatDisplayDate } from '../services/storage';
import { Sparkles, ArrowRight, X } from 'lucide-react';

export const ConstellationPage: React.FC = () => {
  const { tasks, userProfile, setActiveDate, setCurrentRoute, journey } = useApp();
  const [filterPeriod, setFilterPeriod] = useState<'30' | '90' | '365'>('365');
  const [selectedStar, setSelectedStar] = useState<{
    dateStr: string;
    score: number;
    total: number;
    done: number;
    partial: number;
    incomplete: number;
  } | null>(null);

  // Dynamic days count
  const daysCount = Math.min(
    filterPeriod === '30' ? 30 : filterPeriod === '90' ? 90 : 365,
    userProfile.daysTracked || 1 // Avoid 0
  );

  // Generate organic celestial star clusters
  const starNodes = useMemo(() => {
    const today = new Date();
    const nodes = [];

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = formatDateString(d);
      const dayScore = calculateDailyScore(tasks, dateStr);

      const progress = 1 - i / (daysCount || 1);
      const clusterAngle = progress * Math.PI * 5;
      const x = 70 + progress * 760;
      const y =
        155 +
        Math.sin(clusterAngle) * 55 +
        Math.cos(progress * Math.PI * 3) * 35 +
        ((i * 19) % 30) -
        15;

      let color = 'var(--status-incomplete)';
      let radius = 3.5;
      let isAnchor = false;
      let isStarburst = false;

      if (dayScore.scorePercentage === 100) {
        color = 'var(--status-done)';
        radius = 7;
        isStarburst = true;
        isAnchor = true;
      } else if (dayScore.scorePercentage >= 80) {
        color = 'var(--status-done)';
        radius = 6;
        isAnchor = true;
      } else if (dayScore.scorePercentage >= 60) {
        color = '#5a7a67';
        radius = 4.5;
      } else if (dayScore.scorePercentage >= 40) {
        color = 'var(--status-partial)';
        radius = 4;
      } else if (dayScore.scorePercentage > 0) {
        color = 'var(--status-incomplete)';
        radius = 3.5;
      } else {
        color = 'rgba(168, 150, 130, 0.4)';
        radius = 3;
      }

      nodes.push({
        id: dateStr,
        dateStr,
        x,
        y,
        score: dayScore.scorePercentage,
        total: dayScore.total,
        done: dayScore.done,
        partial: dayScore.partial,
        incomplete: dayScore.incomplete,
        color,
        radius,
        isAnchor,
        isStarburst
      });
    }
    return nodes;
  }, [tasks, daysCount, filterPeriod]);

  const handleOpenDay = (dateStr: string) => {
    setActiveDate(dateStr);
    setCurrentRoute('/today');
    setSelectedStar(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
            <Sparkles size={13} />
            <span>Celestial Vault</span>
          </div>
          <h1 className="font-serif text-page-title" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
            The Constellation
          </h1>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
            Your year as a sky of living stellar waypoints.
          </p>
        </div>

        {/* Filter Period Buttons */}
        <div
          className="parchment-card"
          style={{
            display: 'flex',
            padding: '3px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#ffffff',
            flexWrap: 'wrap'
          }}
        >
          <button
            onClick={() => setFilterPeriod('30')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: filterPeriod === '30' ? 'var(--gold-primary)' : 'transparent',
              color: filterPeriod === '30' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            30 Days
          </button>
          <button
            onClick={() => setFilterPeriod('90')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: filterPeriod === '90' ? 'var(--gold-primary)' : 'transparent',
              color: filterPeriod === '90' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            90 Days
          </button>
          <button
            onClick={() => setFilterPeriod('365')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: filterPeriod === '365' ? 'var(--gold-primary)' : 'transparent',
              color: filterPeriod === '365' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            365 Days
          </button>
        </div>
      </div>

      {!journey?.startedAt || userProfile.daysTracked === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--gold-primary)' }}>
            <Sparkles size={40} />
          </div>
          <h1 className="font-serif text-hero-title" style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            YOUR FIRST STAR IS WAITING
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px' }}>
            Complete missions to form your constellation.
          </p>
        </div>
      ) : (
        <>
          {/* Main Warm Ivory / Parchment Celestial Canvas */}
      <div
        className="parchment-card"
        style={{
          position: 'relative',
          padding: 'clamp(1rem, 2.5vw, 1.75rem)',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: '#faf7f0',
          border: '1.5px solid rgba(196, 154, 69, 0.4)',
          overflow: 'hidden',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-card)',
          width: '100%'
        }}
      >
        {/* Antique Astrological Coordinate Grids */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(196, 154, 69, 0.05) 0%, transparent 60%), linear-gradient(rgba(196, 154, 69, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(196, 154, 69, 0.04) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 40px 40px, 40px 40px',
            pointerEvents: 'none'
          }}
        />

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.725rem',
            color: 'var(--text-muted)',
            fontWeight: 700,
            marginBottom: '8px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-done)' }} />
            <span>80-100%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#5a7a67' }} />
            <span>60-80%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-partial)' }} />
            <span>40-60%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-incomplete)' }} />
            <span>&lt;40%</span>
          </div>
        </div>

        {/* SVG Celestial Star Chart (Horizontal swipeable on phone) */}
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', padding: '0.5rem 0' }}>
          <svg viewBox="0 0 900 320" style={{ width: '100%', minWidth: '700px', height: '300px' }}>
            {/* Fine Golden Celestial Filaments */}
            {starNodes.map((node, i) => {
              if (i === 0) return null;
              const prev = starNodes[i - 1];
              return (
                <line
                  key={`filament-${node.id}`}
                  x1={prev.x}
                  y1={prev.y}
                  x2={node.x}
                  y2={node.y}
                  stroke="rgba(196, 154, 69, 0.45)"
                  strokeWidth="1.2"
                  strokeDasharray={node.isAnchor ? 'none' : '2 3'}
                />
              );
            })}

            {/* Star Nodes */}
            {starNodes.map(node => (
              <g
                key={node.id}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedStar(node)}
              >
                {node.isStarburst && (
                  <>
                    <line x1={node.x - 10} y1={node.y} x2={node.x + 10} y2={node.y} stroke="rgba(196, 154, 69, 0.6)" strokeWidth="1" />
                    <line x1={node.x} y1={node.y - 10} x2={node.x + 10} y2={node.y + 10} stroke="rgba(196, 154, 69, 0.6)" strokeWidth="1" />
                  </>
                )}

                <circle cx={node.x} cy={node.y} r={node.radius + 4} fill={node.color} opacity="0.25" />
                <circle cx={node.x} cy={node.y} r={node.radius} fill={node.color} stroke="#ffffff" strokeWidth="1.5" />
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Tap-to-Inspect Mobile / Desktop Modal Sheet */}
      {selectedStar && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(35, 31, 26, 0.4)',
            backdropFilter: 'blur(3px)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setSelectedStar(null)}
        >
          <div
            className="parchment-card animate-slide-up"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              border: '1.5px solid var(--gold-primary)',
              width: '100%',
              maxWidth: '400px',
              boxShadow: '0 -8px 32px rgba(0,0,0,0.15)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold-primary)', textTransform: 'uppercase' }}>
                  STAR WAYPOINT
                </div>
                <div className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {formatDisplayDate(selectedStar.dateStr).formatted}
                </div>
              </div>

              <button onClick={() => setSelectedStar(null)} style={{ padding: '6px', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gold-primary)', margin: '8px 0' }}>
              {selectedStar.score}% Completion
            </div>

            <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', fontWeight: 700, margin: '10px 0 16px', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--status-done)' }}>🟢 {selectedStar.done} Done</span>
              <span style={{ color: 'var(--status-partial)' }}>🟡 {selectedStar.partial} Partial</span>
              <span style={{ color: 'var(--status-incomplete)' }}>🔴 {selectedStar.incomplete} Incomplete</span>
            </div>

            <button
              onClick={() => handleOpenDay(selectedStar.dateStr)}
              className="btn-gold"
              style={{ width: '100%', padding: '10px 18px', fontSize: '0.9rem' }}
            >
              <span>View Day Expedition</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Summary KPI Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '10px',
          width: '100%'
        }}
      >
        <div className="parchment-card" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', backgroundColor: '#ffffff' }}>
          <div className="font-mono" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, color: 'var(--text-primary)' }}>
            {userProfile.daysTracked}
          </div>
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Days Tracked
          </div>
        </div>

        <div className="parchment-card" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', backgroundColor: '#ffffff' }}>
          <div className="font-mono" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, color: 'var(--status-done)' }}>
            {userProfile.averageCompletion}%
          </div>
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Avg Completion
          </div>
        </div>

        <div className="parchment-card" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', backgroundColor: '#ffffff' }}>
          <div className="font-mono" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, color: 'var(--gold-primary)' }}>
            {userProfile.currentStreak}d
          </div>
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Streak 🔥
          </div>
        </div>

        <div className="parchment-card" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', backgroundColor: '#ffffff' }}>
          <div className="font-mono" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, color: '#8b6f4e' }}>
            {userProfile.bestStreak}d
          </div>
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Best 🏆
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};
