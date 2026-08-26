import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { calculateDailyScore, formatDisplayDate } from '../services/storage';
import {
  BookOpen,
  Terminal,
  Activity,
  Compass,
  Scroll,
  Plus,
  Zap,
  Sparkles,
  Trash2,
  X,
  GripVertical,
  Circle,
  CheckCircle2,
  Clock,
  AlertOctagon,
  Mic,
  MicOff,
  ChevronUp,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export const TodayPage: React.FC = () => {
  const {
    activeDate,
    tasks,
    categories,
    setTaskStatus,
    addTask,
    deleteTask,
    reorderTasks,
    isDateLocked,
    addNotification,
    journey
  } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0]?.name || 'Study');
  const [newDuration, setNewDuration] = useState('30 MIN');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isListening, setIsListening] = useState(false);
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
          setNewTitle(prev => (prev ? `${prev} ${transcript}` : transcript));
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

  const score = calculateDailyScore(tasks, activeDate);
  const { dayName, formatted } = formatDisplayDate(activeDate);

  const dayTasks = tasks
    .filter(t => t.date === activeDate)
    .sort((a, b) => {
      // Completed (Done) tasks automatically go to the bottom
      const aDone = a.status === 'done' ? 1 : 0;
      const bDone = b.status === 'done' ? 1 : 0;
      if (aDone !== bDone) return aDone - bDone;
      return (a.order ?? 0) - (b.order ?? 0);
    });

  const isLocked = isDateLocked(activeDate);

  // Circular gauge calculations
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score.scorePercentage / 100) * circumference;

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'study':
      case 'learning':
        return <BookOpen size={16} color="var(--text-secondary)" />;
      case 'project':
        return <Terminal size={16} color="var(--text-secondary)" />;
      case 'fitness':
        return <Activity size={16} color="var(--text-secondary)" />;
      case 'personal':
        return <Compass size={16} color="var(--text-secondary)" />;
      default:
        return <Scroll size={16} color="var(--text-secondary)" />;
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle.trim(),
      date: activeDate,
      category: newCategory,
      duration: newDuration,
      priority: newPriority
    });

    setNewTitle('');
    inputRef.current?.focus();
  };

  const moveTaskUp = (index: number) => {
    if (index <= 0 || isLocked) return;
    const items = Array.from(dayTasks);
    const [moved] = items.splice(index, 1);
    items.splice(index - 1, 0, moved);
    reorderTasks(items);
  };

  const moveTaskDown = (index: number) => {
    if (index >= dayTasks.length - 1 || isLocked) return;
    const items = Array.from(dayTasks);
    const [moved] = items.splice(index, 1);
    items.splice(index + 1, 0, moved);
    reorderTasks(items);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || isLocked) return;
    const items = Array.from(dayTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    reorderTasks(items);
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Empty States */}
      {!journey?.startedAt && !isAdding ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--gold-primary)' }}>
            <Compass size={40} />
          </div>
          <h1 className="font-serif text-hero-title" style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            YOUR EXPEDITION HASN'T STARTED
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px' }}>
            Your journey begins with your first mission.
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
            <span>Create Your First Mission</span>
          </button>
        </div>
      ) : dayTasks.length === 0 && !isAdding ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--gold-primary)' }}>
            <Scroll size={40} />
          </div>
          <h1 className="font-serif text-hero-title" style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            NO MISSIONS TODAY
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px' }}>
            You can add today's missions or prepare tomorrow's expedition.
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
          {/* 1. THE LIVING EXPEDITION WORLD HERO */}
          <div
            className="parchment-card"
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          marginBottom: '1.75rem',
          border: '1px solid var(--border-medium)',
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(1.25rem, 3vw, 2rem)',
          backgroundColor: '#f5efe6',
          backgroundImage: `url('/assets/floating_island_world.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          boxShadow: 'var(--shadow-card)',
          width: '100%'
        }}
      >
        {/* Dynamic Atmosphere Filter */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              score.scorePercentage === 100
                ? 'radial-gradient(circle at 60% 40%, rgba(196, 154, 69, 0.22) 0%, transparent 70%), linear-gradient(to right, rgba(253, 251, 247, 0.94) 0%, rgba(253, 251, 247, 0.65) 60%, rgba(253, 251, 247, 0.25) 100%), linear-gradient(to top, rgba(253, 251, 247, 0.95) 0%, transparent 60%)'
                : score.scorePercentage >= 60
                ? 'linear-gradient(to right, rgba(253, 251, 247, 0.95) 0%, rgba(253, 251, 247, 0.72) 55%, rgba(253, 251, 247, 0.3) 100%), linear-gradient(to top, rgba(253, 251, 247, 0.92) 0%, transparent 60%)'
                : 'linear-gradient(to right, rgba(253, 251, 247, 0.97) 0%, rgba(253, 251, 247, 0.82) 55%, rgba(253, 251, 247, 0.35) 100%), linear-gradient(to top, rgba(253, 251, 247, 0.92) 0%, transparent 60%)',
            pointerEvents: 'none',
            transition: 'background 0.8s ease'
          }}
        />

        {/* Top Header Information */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--gold-primary)',
                marginBottom: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Sparkles size={13} />
              <span>
                {score.scorePercentage === 100
                  ? 'Citadel Fully Illuminated'
                  : score.scorePercentage >= 60
                  ? 'Expedition In Momentum'
                  : "Today's Expedition"}
              </span>
            </div>

            <h1
              className="font-serif text-hero-title"
              style={{
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em'
              }}
            >
              {dayName}
            </h1>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '2px' }}>
              {formatted}
            </div>
          </div>

          {/* Status Breakdown Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-subtle)',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--status-done)' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--status-done)' }} />
              <span>{score.done} DONE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--status-partial)' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--status-partial)' }} />
              <span>{score.partial} PARTIAL</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--status-incomplete)' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--status-incomplete)' }} />
              <span>{score.incomplete} INCOMPLETE</span>
            </div>
          </div>
        </div>

        {/* Bottom Hero Metrics (Stacked on small screens) */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginTop: '1.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-medium)',
            width: '100%'
          }}
        >
          {/* Circular Progress Gauge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '76px', height: '76px', flexShrink: 0 }}>
              <svg width="76" height="76" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="38" cy="38" r={radius} fill="transparent" stroke="rgba(196, 154, 69, 0.15)" strokeWidth="6" />
                <circle
                  cx="38"
                  cy="38"
                  r={radius}
                  fill="transparent"
                  stroke={score.scorePercentage >= 80 ? 'var(--status-done)' : score.scorePercentage >= 50 ? 'var(--status-partial)' : 'var(--gold-primary)'}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={score.total === 0 ? circumference : strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                  {score.scorePercentage}%
                </span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Expedition Mastery
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {score.done} of {score.total} Completed
              </div>
            </div>
          </div>

          {/* Day Power Bar */}
          <div style={{ flex: 1, minWidth: '180px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Zap size={13} /> DAY POWER
              </span>
              <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {score.dayPower} / 1,000 DP
              </span>
            </div>
            <div style={{ height: '7px', width: '100%', backgroundColor: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${(score.dayPower / 1000) * 100}%`,
                  background: 'linear-gradient(90deg, #c49a45 0%, #2d7a4f 100%)',
                  borderRadius: '999px',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. MISSIONS HEADER */}
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 className="font-serif text-page-title" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
            Today's Missions
          </h2>
          <span
            className="font-mono"
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)'
            }}
          >
            {dayTasks.length}
          </span>
        </div>

        <button
          onClick={() => {
            setIsAdding(true);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
          className="btn-neutral"
          style={{ fontSize: '0.8rem', minHeight: '38px' }}
        >
          <Plus size={15} />
          <span>Add Quest</span>
        </button>
      </div>

      {/* Inline Mission Creator (Mobile-Friendly Stack) */}
      {isAdding && (
        <form
          onSubmit={handleCreateTask}
          className="parchment-card animate-fade-in"
          style={{
            padding: '1.25rem',
            marginBottom: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--gold-primary)',
            backgroundColor: '#ffffff',
            width: '100%'
          }}
        >
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              ref={inputRef}
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder={isListening ? 'Listening to your voice...' : 'What quest will you conquer today?'}
              style={{
                flex: '1 1 200px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: isListening ? '1.5px solid var(--status-done)' : '1px solid var(--border-medium)',
                backgroundColor: isListening ? 'var(--status-done-bg)' : 'var(--bg-input)',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                outline: 'none',
                minHeight: '44px'
              }}
            />

            {/* Mic Speech-to-Text Button */}
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

            {/* Reload / Clear Input Button */}
            <button
              type="button"
              onClick={() => {
                setNewTitle('');
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
              title="Clear text"
            >
              <RotateCcw size={16} />
            </button>

            <button type="submit" disabled={!newTitle.trim()} className="btn-gold" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              Add
            </button>

            <button
              type="button"
              onClick={() => setIsAdding(false)}
              style={{ padding: '8px', color: 'var(--text-muted)', minHeight: '44px', minWidth: '44px' }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)' }}>DOMAIN:</span>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
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
                value={newDuration}
                onChange={e => setNewDuration(e.target.value)}
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
      )}

      {/* 3. MISSIONS LIST */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="today-missions-list" isDropDisabled={isLocked}>
          {provided => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              {dayTasks.map((task, index) => {
                const isDone = task.status === 'done';
                const isPartial = task.status === 'partial';
                const isIncomplete = task.status === 'incomplete';

                return (
                  <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={isLocked}>
                    {(providedDrag, snapshotDrag) => (
                      <div
                        ref={providedDrag.innerRef}
                        {...providedDrag.draggableProps}
                        className={`parchment-card ${isDone ? 'mission-trail-active' : ''}`}
                        style={{
                          padding: '12px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          border: isDone
                            ? '1px solid var(--status-done-border)'
                            : isPartial
                            ? '1px solid var(--status-partial-border)'
                            : isIncomplete
                            ? '1px solid var(--status-incomplete-border)'
                            : '1px solid var(--border-subtle)',
                          backgroundColor: isDone
                            ? 'var(--status-done-bg)'
                            : isPartial
                            ? 'var(--status-partial-bg)'
                            : isIncomplete
                            ? 'var(--status-incomplete-bg)'
                            : '#ffffff',
                          boxShadow: snapshotDrag.isDragging ? '0 12px 32px rgba(120, 100, 80, 0.2)' : 'var(--shadow-card)',
                          position: 'relative',
                          opacity: isDone ? 0.88 : 1,
                          filter: isDone ? 'brightness(0.98)' : 'none',
                          zIndex: snapshotDrag.isDragging ? 999 : 1,
                          width: '100%',
                          boxSizing: 'border-box',
                          ...providedDrag.draggableProps.style
                        }}
                      >
                        {/* Top Row: Re-order, Mission Index, Icon, Title */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', width: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                            {!isLocked && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                                <div
                                  {...providedDrag.dragHandleProps}
                                  style={{
                                    color: 'var(--text-muted)',
                                    cursor: 'grab',
                                    padding: '6px 2px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    touchAction: 'none'
                                  }}
                                  title="Drag to reorder"
                                >
                                  <GripVertical size={16} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                  <button
                                    type="button"
                                    disabled={index === 0}
                                    onClick={e => {
                                      e.stopPropagation();
                                      moveTaskUp(index);
                                    }}
                                    style={{
                                      padding: '2px',
                                      color: index === 0 ? 'rgba(168, 150, 130, 0.3)' : 'var(--text-muted)',
                                      cursor: index === 0 ? 'default' : 'pointer'
                                    }}
                                    title="Move up"
                                  >
                                    <ChevronUp size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={index === dayTasks.length - 1}
                                    onClick={e => {
                                      e.stopPropagation();
                                      moveTaskDown(index);
                                    }}
                                    style={{
                                      padding: '2px',
                                      color: index === dayTasks.length - 1 ? 'rgba(168, 150, 130, 0.3)' : 'var(--text-muted)',
                                      cursor: index === dayTasks.length - 1 ? 'default' : 'pointer'
                                    }}
                                    title="Move down"
                                  >
                                    <ChevronDown size={14} />
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Mission Index */}
                            <div style={{ textAlign: 'center', minWidth: '38px', flexShrink: 0 }}>
                              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: isDone ? 'var(--status-done)' : 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                M{String(index + 1).padStart(2, '0')}
                              </span>
                            </div>

                            {/* Category Icon */}
                            <div
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '8px',
                                backgroundColor: isDone ? 'rgba(45, 122, 79, 0.15)' : 'var(--bg-neutral-tag)',
                                border: isDone ? '1px solid var(--status-done-border)' : '1px solid var(--border-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              {getCategoryIcon(task.category)}
                            </div>

                            {/* Title and duration */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: '0.95rem',
                                  fontWeight: 700,
                                  color: isDone ? 'var(--text-secondary)' : 'var(--text-primary)',
                                  wordBreak: 'break-word'
                                }}
                              >
                                {task.title}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                                <span>{task.category.toUpperCase()}</span>
                                <span>·</span>
                                <span>{task.duration || '30 MIN'}</span>
                              </div>
                            </div>
                          </div>

                          {!isLocked && (
                            <button onClick={() => deleteTask(task.id)} style={{ color: 'var(--text-muted)', padding: '6px', minWidth: '36px', minHeight: '36px' }} title="Delete quest">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        {/* Bottom Row: Direct Status Action Buttons & Reset Dial */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-subtle)', padding: '3px', borderRadius: 'var(--radius-sm)', gap: '4px', flex: 1, minHeight: '40px' }}>
                            <button
                              onClick={() => setTaskStatus(task.id, 'done')}
                              style={{
                                flex: 1,
                                padding: '8px 6px',
                                borderRadius: '4px',
                                backgroundColor: isDone ? 'var(--status-done)' : 'transparent',
                                color: isDone ? '#ffffff' : 'var(--status-done)',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                minHeight: '36px'
                              }}
                              title="Done (100%)"
                            >
                              DONE
                            </button>
                            <button
                              onClick={() => setTaskStatus(task.id, 'partial')}
                              style={{
                                flex: 1,
                                padding: '8px 6px',
                                borderRadius: '4px',
                                backgroundColor: isPartial ? 'var(--status-partial)' : 'transparent',
                                color: isPartial ? '#ffffff' : 'var(--status-partial)',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                minHeight: '36px'
                              }}
                              title="Partial (50%)"
                            >
                              PARTIAL
                            </button>
                            <button
                              onClick={() => setTaskStatus(task.id, 'incomplete')}
                              style={{
                                flex: 1,
                                padding: '8px 6px',
                                borderRadius: '4px',
                                backgroundColor: isIncomplete ? 'var(--status-incomplete)' : 'transparent',
                                color: isIncomplete ? '#ffffff' : 'var(--status-incomplete)',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                minHeight: '36px'
                              }}
                              title="Incomplete (0%)"
                            >
                              INCOMPLETE
                            </button>
                          </div>

                          {/* Reset / Deselect Button */}
                          <button
                            onClick={() => !isLocked && setTaskStatus(task.id, 'unmarked')}
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              backgroundColor: isDone
                                ? 'var(--status-done)'
                                : isPartial
                                ? 'var(--status-partial)'
                                : isIncomplete
                                ? 'var(--status-incomplete)'
                                : 'transparent',
                              border: isDone || isPartial || isIncomplete ? 'none' : '2px dashed var(--border-strong)',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: isDone ? '0 2px 8px rgba(45, 122, 79, 0.35)' : 'none',
                              cursor: isLocked ? 'default' : 'pointer',
                              minWidth: '38px',
                              minHeight: '38px'
                            }}
                            title="Reset to Unmarked (White)"
                          >
                            {isDone && <CheckCircle2 size={18} strokeWidth={2.5} />}
                            {isPartial && <Clock size={18} strokeWidth={2.5} />}
                            {isIncomplete && <AlertOctagon size={18} strokeWidth={2.5} />}
                            {!isDone && !isPartial && !isIncomplete && <Circle size={15} color="var(--text-muted)" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
        </>
      )}
    </div>
  );
};
