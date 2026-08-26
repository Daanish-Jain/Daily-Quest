import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateDailyScore, formatDisplayDate } from '../services/storage';
import { History, ChevronRight, Search } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { tasks, dayRecords, setActiveDate, setCurrentRoute } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const dateSet = new Set<string>();
  tasks.forEach(t => dateSet.add(t.date));
  dayRecords.forEach(r => dateSet.add(r.date));

  const sortedDates = Array.from(dateSet).sort().reverse();

  const filteredDates = sortedDates.filter(dStr => {
    const formatted = formatDisplayDate(dStr).formatted.toLowerCase();
    const dayTasks = tasks.filter(t => t.date === dStr);
    const matchesTitle = dayTasks.some(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return formatted.includes(searchTerm.toLowerCase()) || matchesTitle;
  });

  const handleSelectDay = (dateStr: string) => {
    setActiveDate(dateStr);
    setCurrentRoute('/today');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
            <History size={13} />
            <span>Journal & Retrospectives</span>
          </div>
          <h1 className="font-serif text-page-title" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
            Expedition History
          </h1>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
            Read through past logs, completion scores, and evening reflections.
          </p>
        </div>

        {/* Search Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: 'var(--radius-full)', backgroundColor: '#ffffff', border: '1px solid var(--border-medium)', width: '100%', maxWidth: '280px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search past logs..."
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%' }}
          />
        </div>
      </div>

      {/* Daily Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
        {filteredDates.map(dateStr => {
          const score = calculateDailyScore(tasks, dateStr);
          const { dayName, formatted, relativeLabel } = formatDisplayDate(dateStr);
          const record = dayRecords.find(r => r.date === dateStr);
          const dayTasks = tasks.filter(t => t.date === dateStr);

          return (
            <div
              key={dateStr}
              onClick={() => handleSelectDay(dateStr)}
              className="parchment-card animate-fade-in"
              style={{
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                backgroundColor: '#ffffff',
                width: '100%'
              }}
            >
              {/* Left Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
                  <span className="font-serif" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {formatted}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({dayName.slice(0, 3)})</span>
                  {relativeLabel && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--gold-bg)',
                        color: 'var(--gold-primary)'
                      }}
                    >
                      {relativeLabel}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {dayTasks.length} Quests · 🟢 {score.done} · 🟡 {score.partial} · 🔴 {score.incomplete}
                </div>

                {record?.reflection && (
                  <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    "{record.reflection}"
                  </p>
                )}
              </div>

              {/* Right Score & Arrow */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: score.scorePercentage >= 80 ? 'var(--status-done)' : 'var(--gold-primary)', lineHeight: 1 }}>
                    {score.scorePercentage}%
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    {score.dayPower} DP
                  </div>
                </div>

                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
