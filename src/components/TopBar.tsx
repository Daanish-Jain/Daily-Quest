import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Calendar, Award } from 'lucide-react';
import { formatDisplayDate, formatDateString } from '../services/storage';

interface TopBarProps {
  onOpenReview: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenReview }) => {
  const { activeDate, setActiveDate, userProfile } = useApp();
  const dateInputRef = useRef<HTMLInputElement>(null);

  const { dayName, formatted, relativeLabel } = formatDisplayDate(activeDate);

  const goToPreviousDay = () => {
    const [y, m, d] = activeDate.split('-').map(Number);
    const prev = new Date(y, m - 1, d);
    prev.setDate(prev.getDate() - 1);
    setActiveDate(formatDateString(prev));
  };

  const goToNextDay = () => {
    const [y, m, d] = activeDate.split('-').map(Number);
    const next = new Date(y, m - 1, d);
    next.setDate(next.getDate() + 1);
    setActiveDate(formatDateString(next));
  };

  const xpPercent = Math.min(100, Math.round((userProfile.currentXP / userProfile.nextLevelXP) * 100));

  return (
    <header
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--border-subtle)',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Date Switcher - Clean, Compact & Touch-friendly */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          onClick={goToPreviousDay}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-subtle)',
            minWidth: '36px',
            minHeight: '36px'
          }}
          title="Previous day"
          aria-label="Previous day"
        >
          <ChevronLeft size={18} />
        </button>

        <div
          onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.click()}
          style={{
            cursor: 'pointer',
            padding: '6px 8px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Calendar size={15} color="var(--gold-primary)" />
          <span className="font-serif" style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', whiteSpace: 'nowrap' }}>
            {relativeLabel ? `${relativeLabel}, ` : ''}{dayName.slice(0, 3)}, {formatted}
          </span>
        </div>

        <button
          onClick={goToNextDay}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-subtle)',
            minWidth: '36px',
            minHeight: '36px'
          }}
          title="Next day"
          aria-label="Next day"
        >
          <ChevronRight size={18} />
        </button>

        <input
          ref={dateInputRef}
          type="date"
          value={activeDate}
          onChange={e => e.target.value && setActiveDate(e.target.value)}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        />
      </div>

      {/* Right Explorer Actions (Review Day + Level / Streak) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* End of Day Review Trigger */}
        <button
          onClick={onOpenReview}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--gold-bg)',
            color: 'var(--gold-primary)',
            fontSize: '0.785rem',
            fontWeight: 700,
            border: '1px solid rgba(196, 154, 69, 0.3)',
            minHeight: '36px'
          }}
          title="Log evening reflection"
        >
          <Award size={15} />
          <span>Review Day</span>
        </button>

        {/* Level & XP Gauge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              Lv. {userProfile.level} · {userProfile.currentStreak}d 🔥
            </div>
            <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--gold-primary)', fontWeight: 600 }}>
              {userProfile.currentXP} / {userProfile.nextLevelXP} XP
            </div>
          </div>

          <div style={{ width: '38px', height: '5px', backgroundColor: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${xpPercent}%`, height: '100%', backgroundColor: 'var(--gold-primary)' }} />
          </div>
        </div>
      </div>
    </header>
  );
};
