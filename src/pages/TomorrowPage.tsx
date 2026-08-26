import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { getTodayDateString, getTomorrowDateString, formatDisplayDate } from '../services/storage';
import {
  Sparkles,
  Plus,
  ArrowRight,
  Trash2,
  BookOpen,
  Terminal,
  Activity,
  Compass,
  Scroll,
  Zap,
  MapPin,
  Mic,
  MicOff,
  RotateCcw
} from 'lucide-react';

export const TomorrowPage: React.FC = () => {
  const { tasks, categories, addTask, deleteTask, migrateIncompleteToTomorrow, setCurrentRoute, setActiveDate, isDateLocked, addNotification, journey } = useApp();

  const todayStr = getTodayDateString();
  const tomorrowStr = getTomorrowDateString();
  const { dayName, formatted } = formatDisplayDate(tomorrowStr);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Study');
  const [duration, setDuration] = useState('45 MIN');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isListening, setIsListening] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addNotification({ message: 'Speech recognition is not supported in your browser.', type: 'warning' });
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setTitle(prev => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const tomorrowTasks = tasks
    .filter(t => t.date === tomorrowStr)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const todayIncomplete = tasks.filter(
    t => t.date === todayStr && (t.status === 'incomplete' || t.status === 'partial' || t.status === 'unmarked')
  );

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      date: tomorrowStr,
      category,
      duration,
      priority
    });

    setTitle('');
    inputRef.current?.focus();
  };

  const handleLaunchExpedition = () => {
    setActiveDate(tomorrowStr);
    setCurrentRoute('/today');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getNodeDetails = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'study':
      case 'learning':
        return { name: 'Knowledge Tower', icon: <BookOpen size={16} color="var(--text-secondary)" /> };
      case 'fitness':
        return { name: 'Training Ground', icon: <Activity size={16} color="var(--text-secondary)" /> };
      case 'project':
        return { name: 'Forge Citadel', icon: <Terminal size={16} color="var(--text-secondary)" /> };
      case 'personal':
        return { name: 'Hearth Sanctuary', icon: <Compass size={16} color="var(--text-secondary)" /> };
      default:
        return { name: 'Territory Outpost', icon: <Scroll size={16} color="var(--text-secondary)" /> };
    }
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      
      {/* Empty States */}
      {(!journey?.startedAt && !isAdding) || (tomorrowTasks.length === 0 && !isAdding) ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--gold-primary)' }}>
            <Compass size={40} />
          </div>
          <h1 className="font-serif text-hero-title" style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            TOMORROW IS UNCHARTED
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px' }}>
            Build your next expedition.
          </p>
          <button
            onClick={() => {
              setIsAdding(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className="btn-gold"
            style={{ padding: '12px 24px', fontSize: '0.95rem' }}
          >
            <Plus size={18} />
            <span>Add Mission</span>
          </button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
              <Sparkles size={13} />
              <span>Night-Before Planning Ritual</span>
            </div>
            <h1 className="font-serif text-page-title" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
              Build Tomorrow
            </h1>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
              Prepare your territory for <strong>{dayName}, {formatted}</strong>.
            </p>
          </div>

          {/* Incomplete Tasks Rollover Banner */}
          {todayIncomplete.length > 0 && (
            <div
              className="parchment-card animate-fade-in"
              style={{
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
                backgroundColor: 'var(--gold-bg)',
                border: '1px solid rgba(196, 154, 69, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                flexWrap: 'wrap',
                width: '100%'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap size={18} color="var(--gold-primary)" />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {todayIncomplete.length} pending quest{todayIncomplete.length > 1 ? 's' : ''} from Today
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Roll over into tomorrow's plan in 1 click.
                  </div>
                </div>
              </div>

              <button
                onClick={() => migrateIncompleteToTomorrow(todayStr)}
                className="btn-gold"
                style={{ padding: '8px 16px', fontSize: '0.8rem', minHeight: '38px' }}
              >
                <span>Roll Over</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* 1. TOMORROW'S TERRITORY MAP */}
          <div
            className="parchment-card"
            style={{
              padding: 'clamp(1rem, 2.5vw, 1.5rem)',
              borderRadius: 'var(--radius-xl)',
              marginBottom: '1.5rem',
              backgroundColor: '#faf7f0',
              border: '1px solid var(--border-medium)',
              minHeight: '200px',
              position: 'relative',
              overflow: 'hidden',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="var(--gold-primary)" />
                <h2 className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Tomorrow's Territory ({tomorrowTasks.length})
                </h2>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Expedition Map
              </span>
            </div>

            {tomorrowTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Compass size={20} color="var(--gold-primary)" />
                </div>
                <div className="font-serif" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  The landscape is quiet and uncharted.
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Add your priority quests below to populate tomorrow's knowledge towers and forge citadels.
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '10px',
                  position: 'relative',
                  zIndex: 2,
                  width: '100%'
                }}
              >
                {tomorrowTasks.map((task, idx) => {
                  const node = getNodeDetails(task.category);
                  return (
                    <div
                      key={task.id}
                      className="parchment-card animate-fade-in"
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        backgroundColor: '#ffffff',
                        width: '100%'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--bg-neutral-tag)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {node.icon}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                            {task.title}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--gold-primary)', fontWeight: 700 }}>
                            {node.name.toUpperCase()} · {task.duration || '30 MIN'}
                          </div>
                        </div>
                      </div>

                      <button onClick={() => deleteTask(task.id)} style={{ color: 'var(--text-muted)', padding: '6px', minWidth: '36px', minHeight: '36px' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. ADD QUEST FOR TOMORROW */}
          <form
            onSubmit={handleAddTask}
            className="parchment-card"
            style={{
              padding: 'clamp(1rem, 2.5vw, 1.5rem)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1.5rem',
              backgroundColor: '#ffffff',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Plus size={16} color="var(--gold-primary)" />
              <h3 className="font-serif" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Add Quest for Tomorrow
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={isListening ? 'Listening to your voice...' : 'e.g. Complete System Design Chapter & Build PR'}
                style={{
                  flex: '1 1 200px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: isListening ? '1.5px solid var(--status-done)' : '1px solid var(--border-medium)',
                  backgroundColor: isListening ? 'var(--status-done-bg)' : 'var(--bg-input)',
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  outline: 'none',
                  minHeight: '44px'
                }}
              />

              <button
                type="button"
                onClick={startVoiceInput}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isListening ? 'var(--status-incomplete-bg)' : 'var(--bg-subtle)',
                  color: isListening ? 'var(--status-incomplete)' : 'var(--text-secondary)',
                  border: isListening ? '1.5px solid var(--status-incomplete-border)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  minHeight: '44px'
                }}
                title={isListening ? 'Stop listening' : 'Voice dictation'}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                <span>{isListening ? 'Listening' : 'Voice'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTitle('');
                  inputRef.current?.focus();
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '44px',
                  minWidth: '44px'
                }}
                title="Clear input text"
              >
                <RotateCcw size={16} />
              </button>

              <button type="submit" disabled={!title.trim()} className="btn-gold" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                Add Quest
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)' }}>DOMAIN:</span>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    minHeight: '36px'
                  }}
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)' }}>DURATION:</span>
                <select
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  style={{
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    minHeight: '36px'
                  }}
                >
                  <option value="15 MIN">15 MIN</option>
                  <option value="30 MIN">30 MIN</option>
                  <option value="45 MIN">45 MIN</option>
                  <option value="60 MIN">60 MIN</option>
                  <option value="90 MIN">90 MIN</option>
                  <option value="2 HRS">2 HRS</option>
                  <option value="3 HRS+">3 HRS+</option>
                </select>
              </div>
            </div>
          </form>

          {/* 3. PROMINENT CONFIRMATION STATE */}
          <div
            className="parchment-card"
            style={{
              padding: 'clamp(1.25rem, 3vw, 2rem)',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              border: '1.5px solid var(--gold-primary)',
              boxShadow: 'var(--shadow-gold)',
              width: '100%'
            }}
          >
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.65rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              TOMORROW IS READY
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', maxWidth: '460px', margin: '0 auto 1.25rem' }}>
              {tomorrowTasks.length} waypoints anchored. When you wake up, your expedition will be waiting with absolute focus.
            </p>

            <button onClick={handleLaunchExpedition} className="btn-gold" style={{ padding: '12px 32px', fontSize: '0.95rem', width: '100%', maxWidth: '320px' }}>
              <span>Launch Expedition →</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
