import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Plus, Trash2, Download, Upload, RotateCcw, Shield } from 'lucide-react';

const PRESET_ICONS = ['📖', '⌘', '🏋️', '🧠', '▣', '✦', '🏹', '🎨', '💼', '⚡'];
const PRESET_COLORS = ['#5a7a67', '#8b6f4e', '#3d6e52', '#c4823f', '#4a6fa5', '#c85a48', '#8c7a6b', '#2d7a4f'];

export const SettingsPage: React.FC = () => {
  const { categories, addCategory, deleteCategory, exportDataJSON, importDataJSON, resetAllData, journey } = useApp();

  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🏹');
  const [newCatColor, setNewCatColor] = useState('#5a7a67');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim(),
      icon: newCatIcon,
      color: newCatColor
    });
    setNewCatName('');
  };

  const handleExport = async () => {
    const jsonStr = await exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-quest-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      if (content) importDataJSON(content);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
          <Settings size={13} />
          <span>Configuration & Vault</span>
        </div>
        <h1 className="font-serif text-page-title" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
          Expedition Settings
        </h1>
        <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
          Manage mission domains, export backup vaults, and customize your setup.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '720px', width: '100%' }}>
        {/* Categories / Domains */}
        <div className="parchment-card" style={{ padding: 'clamp(1rem, 2.5vw, 1.5rem)', borderRadius: 'var(--radius-xl)', backgroundColor: '#ffffff', width: '100%' }}>
          <h2 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Mission Domains ({categories.length})
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.25rem' }}>
            {categories.map(cat => (
              <div
                key={cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--bg-input)',
                  border: `1px solid ${cat.color}44`,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)'
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <button onClick={() => deleteCategory(cat.id)} style={{ color: 'var(--text-muted)', padding: '2px', minWidth: '24px', minHeight: '24px' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                placeholder="New domain name (e.g. Writing)"
                style={{
                  flex: '1 1 180px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-input)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  minHeight: '40px'
                }}
              />
              <button type="submit" disabled={!newCatName.trim()} className="btn-gold" style={{ padding: '8px 18px', fontSize: '0.825rem' }}>
                <Plus size={15} />
                <span>Add Domain</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {PRESET_ICONS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setNewCatIcon(icon)}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: newCatIcon === icon ? 'var(--gold-bg)' : 'var(--bg-input)',
                    border: newCatIcon === icon ? '1.5px solid var(--gold-primary)' : '1px solid transparent',
                    fontSize: '1rem'
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Data Management & Vault Backups */}
        <div className="parchment-card" style={{ padding: 'clamp(1rem, 2.5vw, 1.5rem)', borderRadius: 'var(--radius-xl)', backgroundColor: '#ffffff', width: '100%' }}>
          <h2 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Data Backup & Vault
          </h2>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Export your entire expedition history as a standalone JSON backup or restore from a previous file.
          </p>

          <div style={{ marginBottom: '1rem', padding: '10px 14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Last Backup:</span>
              <span style={{ fontWeight: 700, color: journey?.lastBackupAt ? 'var(--status-done)' : 'var(--text-muted)' }}>
                {journey?.lastBackupAt ? new Date(journey.lastBackupAt).toLocaleString() : 'Never'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Journey Started:</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {journey?.startedAt ? new Date(journey.startedAt).toLocaleDateString() : 'Not Started'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleExport} className="btn-neutral" style={{ flex: '1 1 140px' }}>
              <Download size={15} />
              <span>Export JSON</span>
            </button>

            <button onClick={() => fileInputRef.current?.click()} className="btn-neutral" style={{ flex: '1 1 140px' }}>
              <Upload size={15} />
              <span>Import JSON</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="parchment-card" style={{ padding: 'clamp(1rem, 2.5vw, 1.5rem)', borderRadius: 'var(--radius-xl)', backgroundColor: '#fff8f6', border: '1px solid rgba(200, 90, 72, 0.3)', width: '100%' }}>
          <h2 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--status-incomplete)', marginBottom: '0.5rem' }}>
            Reset Expedition Data
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Revert your expedition vault back to the default starter preset with 187 days of clean history.
          </p>

          {!showConfirmReset ? (
            <button onClick={() => setShowConfirmReset(true)} className="btn-neutral" style={{ color: 'var(--status-incomplete)', borderColor: 'rgba(200, 90, 72, 0.3)' }}>
              <RotateCcw size={15} />
              <span>Reset All Data...</span>
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => { resetAllData(); setShowConfirmReset(false); }} className="btn-gold" style={{ backgroundColor: 'var(--status-incomplete)', backgroundImage: 'none' }}>
                Yes, Reset All Data
              </button>
              <button onClick={() => setShowConfirmReset(false)} className="btn-neutral">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
