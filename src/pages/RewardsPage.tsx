import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, Trophy, Sparkles, Check, Lock, Shield, Compass, Flame, Star } from 'lucide-react';

export const RewardsPage: React.FC = () => {
  const { achievements, userProfile, journey, claimWeeklyBossRewards, bossRewardClaimed } = useApp();

  const getAchievementIcon = (id: string) => {
    switch (id) {
      case 'first_expedition':
        return <Compass size={20} color="var(--gold-primary)" />;
      case 'seven_day_trail':
        return <Flame size={20} color="var(--gold-primary)" />;
      case 'mountain_climber':
        return <Shield size={20} color="var(--gold-primary)" />;
      case 'constellation_keeper':
        return <Star size={20} color="var(--gold-primary)" />;
      case 'perfect_expedition':
        return <Trophy size={20} color="var(--gold-primary)" />;
      default:
        return <Award size={20} color="var(--gold-primary)" />;
    }
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
          <Sparkles size={13} />
          <span>Expedition Mastery</span>
        </div>
        <h1 className="font-serif text-page-title" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
          Rewards & Glory
        </h1>
        <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
          Your consistency builds tangible power. Defeat the weekly titan and unlock legendary milestones.
        </p>
      </div>

      {!journey?.startedAt || userProfile.currentXP === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--gold-primary)' }}>
            <Trophy size={40} />
          </div>
          <h1 className="font-serif text-hero-title" style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            YOUR FIRST ACHIEVEMENT IS WAITING
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px' }}>
            Complete missions to gain experience and unlock legendary rewards.
          </p>
        </div>
      ) : (
        <>
          {/* Hero Stats */}
      <div
        className="parchment-card"
        style={{
          padding: 'clamp(1rem, 2.5vw, 1.75rem)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '1.5rem',
          backgroundColor: '#ffffff',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          border: '1px solid var(--border-medium)',
          width: '100%'
        }}
      >
        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Level
          </span>
          <div className="font-serif" style={{ fontSize: 'clamp(1.15rem, 3vw, 1.45rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            Lv. {userProfile.level} · {userProfile.levelTitle}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Experience
          </span>
          <div className="font-mono" style={{ fontSize: 'clamp(1.15rem, 3vw, 1.45rem)', fontWeight: 800, color: 'var(--gold-primary)', marginTop: '2px' }}>
            {userProfile.currentXP} / {userProfile.nextLevelXP} XP
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Streak
          </span>
          <div className="font-mono" style={{ fontSize: 'clamp(1.15rem, 3vw, 1.45rem)', fontWeight: 800, color: 'var(--status-done)', marginTop: '2px' }}>
            {userProfile.currentStreak} Days 🔥
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Best Streak
          </span>
          <div className="font-mono" style={{ fontSize: 'clamp(1.15rem, 3vw, 1.45rem)', fontWeight: 800, color: '#8b6f4e', marginTop: '2px' }}>
            {userProfile.bestStreak} Days 🏆
          </div>
        </div>
      </div>

      {/* 1. WEEKLY BOSS CHALLENGE */}
      <div
        className="parchment-card"
        style={{
          padding: 'clamp(1.25rem, 3vw, 2rem)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '1.75rem',
          border: '1.5px solid rgba(196, 154, 69, 0.4)',
          backgroundColor: '#fdfbf7',
          display: 'flex',
          flexWrap: 'wrap-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          width: '100%'
        }}
      >
        <div style={{ flex: '1 1 260px', width: '100%' }}>
          <span
            style={{
              fontSize: '0.725rem',
              fontWeight: 800,
              color: 'var(--gold-primary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}
          >
            WEEKLY BOSS BATTLE · WEEK 34
          </span>

          <h2 className="font-serif" style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 6px' }}>
            Celestial Titan of Discipline
          </h2>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            42 Missions Planned · <strong>31 Done</strong> · <strong>6 Partial</strong> · <strong>5 Incomplete</strong>
          </p>

          {/* Titan Health */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.785rem', fontWeight: 700 }}>
              <span style={{ color: 'var(--status-done)' }}>OVERPOWERED: 78%</span>
              <span className="font-mono" style={{ color: 'var(--gold-primary)' }}>31/42 DONE</span>
            </div>
            <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: '78%',
                  background: 'linear-gradient(90deg, #c49a45 0%, #2d7a4f 100%)',
                  borderRadius: '999px'
                }}
              />
            </div>
          </div>

          <button
            onClick={claimWeeklyBossRewards}
            disabled={bossRewardClaimed}
            className="btn-gold"
            style={{
              padding: '10px 24px',
              fontSize: '0.9rem',
              opacity: bossRewardClaimed ? 0.7 : 1,
              cursor: bossRewardClaimed ? 'default' : 'pointer',
              width: '100%',
              maxWidth: '320px'
            }}
          >
            {bossRewardClaimed ? (
              <>
                <Check size={16} />
                <span>Weekly Victory Claimed (+500 XP)</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>CLAIM REWARDS (+500 XP)</span>
              </>
            )}
          </button>
        </div>

        {/* Boss Portrait Artwork */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '200px',
            height: '180px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '2px solid var(--gold-primary)',
            boxShadow: 'var(--shadow-gold)',
            margin: '0 auto'
          }}
        >
          <img
            src="/assets/weekly_boss_guardian.jpg"
            alt="Celestial Titan"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* 2. ACHIEVEMENTS SECTION */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
          <Trophy size={18} color="var(--gold-primary)" />
          <h2 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Expedition Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '12px',
            width: '100%'
          }}
        >
          {achievements.map(ach => (
            <div
              key={ach.id}
              className="parchment-card"
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: ach.unlocked ? '#ffffff' : '#f5efe6',
                border: ach.unlocked ? '1.5px solid rgba(196, 154, 69, 0.45)' : '1px dashed var(--border-medium)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                opacity: ach.unlocked ? 1 : 0.65,
                width: '100%'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: ach.unlocked ? 'var(--gold-bg)' : 'var(--bg-input)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {getAchievementIcon(ach.id)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {ach.title}
                  </h3>
                  {ach.unlocked ? (
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--status-done)', display: 'flex', alignItems: 'center', gap: '2px', whiteSpace: 'nowrap' }}>
                      <Check size={11} strokeWidth={3} /> UNLOCKED
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px', whiteSpace: 'nowrap' }}>
                      <Lock size={11} /> LOCKED
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.3 }}>
                  {ach.description}
                </p>

                <div style={{ marginTop: '6px', fontSize: '0.725rem', fontWeight: 700, color: 'var(--gold-primary)' }}>
                  +{ach.rewardXP} XP Reward
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
        </>
      )}
    </div>
  );
};
