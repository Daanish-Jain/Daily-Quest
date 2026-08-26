import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateDailyScore, formatDisplayDate } from '../services/storage';
import { X, Award, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

interface DailyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyReviewModal: React.FC<DailyReviewModalProps> = ({ isOpen, onClose }) => {
  const { activeDate, tasks, dayRecords, saveDayReflection, migrateIncompleteToTomorrow } = useApp();

  const score = calculateDailyScore(tasks, activeDate);
  const { dayName, formatted } = formatDisplayDate(activeDate);

  const existingRecord = dayRecords.find(r => r.date === activeDate);
  const [reflection, setReflection] = useState(existingRecord?.reflection || '');

  if (!isOpen) return null;

  const dayTasks = tasks.filter(t => t.date === activeDate);
  const incompleteTasks = dayTasks.filter(t => t.status === 'incomplete' || t.status === 'partial');

  const handleSaveAndClose = () => {
    if (reflection.trim()) {
      saveDayReflection(activeDate, reflection.trim());
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(35, 31, 26, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        className="parchment-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--gold-primary)',
          boxShadow: 'var(--shadow-gold)',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: 'var(--gold-bg)',
                color: 'var(--gold-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Award size={18} />
            </div>
            <div>
              <h3 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Expedition Review
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {dayName}, {formatted}
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ padding: '6px', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
          {/* Day Score Summary */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#faf7f0',
              border: '1px solid var(--border-medium)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              textAlign: 'center'
            }}
          >
            <div>
              <div className="font-mono" style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--gold-primary)', lineHeight: 1 }}>
                {score.scorePercentage}%
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                Mastery Score
              </div>
            </div>

            <div style={{ height: '32px', width: '1px', backgroundColor: 'var(--border-subtle)' }} />

            <div>
              <div className="font-mono" style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                {score.done}/{score.total}
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                Done
              </div>
            </div>

            <div style={{ height: '32px', width: '1px', backgroundColor: 'var(--border-subtle)' }} />

            <div>
              <div className="font-mono" style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--status-done)', lineHeight: 1 }}>
                {score.dayPower}
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                Day Power
              </div>
            </div>
          </div>

          {/* Evening Reflection */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              <BookOpen size={15} color="var(--gold-primary)" />
              <span>Evening Expedition Reflection</span>
            </label>
            <textarea
              rows={3}
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              placeholder="What went well today? What will you adjust on tomorrow's trail?"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-input)',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Rollover Incomplete Missions */}
          {incompleteTasks.length > 0 && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--gold-bg)',
                border: '1px solid rgba(196, 154, 69, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                marginBottom: '1rem',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                {incompleteTasks.length} unfinished quest{incompleteTasks.length > 1 ? 's' : ''} remaining
              </div>

              <button
                type="button"
                onClick={() => migrateIncompleteToTomorrow(activeDate)}
                className="btn-neutral"
                style={{ padding: '4px 10px', fontSize: '0.75rem', minHeight: '32px' }}
              >
                <span>Roll to Tomorrow</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            backgroundColor: 'var(--bg-subtle)'
          }}
        >
          <button onClick={onClose} className="btn-neutral" style={{ padding: '8px 16px' }}>
            Close
          </button>
          <button onClick={handleSaveAndClose} className="btn-gold" style={{ padding: '8px 22px' }}>
            <Sparkles size={15} />
            <span>Save Reflection</span>
          </button>
        </div>
      </div>
    </div>
  );
};
