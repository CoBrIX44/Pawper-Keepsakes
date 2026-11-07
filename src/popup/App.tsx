import React, { useEffect, useState } from 'react';
import { captureActiveTab, TabCaptureResult } from '../utils/tab';
import { createCard } from '../storage/scrapbook';
import { CardColor, CardDoodle } from '../types/scrapbook';
import { WashiTape } from '../components/WashiTape';
import { DoodleIcon } from '../components/DoodleIcon';
import { CatMascot } from '../components/CatMascot';
import '../styles/scrapbook.css';

const PALETTES: { id: CardColor; label: string; swatch: string }[] = [
  { id: 'blush', label: 'Blush', swatch: '#FFE8EC' },
  { id: 'lilac', label: 'Lilac', swatch: '#EFE9FE' },
  { id: 'peach', label: 'Peach', swatch: '#FFE9D9' },
  { id: 'mint', label: 'Mint', swatch: '#DEF7EC' },
  { id: 'lemon', label: 'Lemon', swatch: '#FEF9C3' },
];

const DOODLES: { id: CardDoodle; label: string }[] = [
  { id: 'flower', label: 'Flower' },
  { id: 'heart', label: 'Heart' },
  { id: 'star', label: 'Star' },
  { id: 'sparkle', label: 'Sparkle' },
];

export const PopupApp: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [tabInfo, setTabInfo] = useState<TabCaptureResult | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [note, setNote] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [color, setColor] = useState<CardColor>('blush');
  const [doodle, setDoodle] = useState<CardDoodle>('flower');

  // Submission State
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const info = await captureActiveTab();
        setTabInfo(info);
        setTitle(info.title || 'Web Keepsake');
        setSelectedText(info.selectedText || '');
        if (info.domain && info.domain !== 'scrapbook') {
          setTags([info.domain.split('.')[0]]);
        }
      } catch (err) {
        console.error('Failed to capture tab:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^#+/, '');
      if (trimmed && !tags.includes(trimmed.toLowerCase())) {
        setTags([...tags, trimmed.toLowerCase()]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please provide a title for your keepsake.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      await createCard({
        title: title.trim(),
        sourceUrl: tabInfo?.url || '',
        sourceDomain: tabInfo?.domain || 'scrapbook',
        selectedText: selectedText.trim() || undefined,
        note: note.trim() || undefined,
        tags,
        color,
        doodle,
      });
      setSavedSuccess(true);
    } catch (err) {
      console.error('Failed to save card:', err);
      setErrorMessage('Oops! Could not save to local storage.');
    } finally {
      setIsSaving(false);
    }
  };

  const openDashboard = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      const dashboardUrl = chrome.runtime.getURL('dashboard.html');
      chrome.tabs.create({ url: dashboardUrl });
    } else {
      window.open('/dashboard.html', '_blank');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '32px 20px', textAlign: 'center', backgroundColor: '#FAF7F2', minHeight: '380px' }}>
        <CatMascot mode="resting" size={80} />
        <p style={{ marginTop: '12px', fontSize: '13px', color: '#6B635B' }}>Preparing your scrapbook...</p>
      </div>
    );
  }

  if (savedSuccess) {
    return (
      <div style={{ padding: '32px 24px', textAlign: 'center', backgroundColor: '#FAF7F2', minHeight: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', marginBottom: '8px' }}>
          <CatMascot mode="peeking" size={76} />
        </div>
        <div
          style={{
            backgroundColor: '#DCF7E7',
            color: '#1C7B47',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>✓</span>
          <span>Saved to your scrapbook! ✿</span>
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2D2825', marginBottom: '6px' }}>
          "{title.slice(0, 40)}{title.length > 40 ? '...' : ''}"
        </h3>
        <p style={{ fontSize: '13px', color: '#6B635B', marginBottom: '24px', maxWidth: '280px' }}>
          Your keepsake has been safely tucked away in your personal collection.
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={openDashboard}
            className="btn-primary"
            style={{ fontSize: '13px', padding: '8px 18px' }}
          >
            Open Scrapbook ↗
          </button>
          <button
            type="button"
            onClick={() => {
              setSavedSuccess(false);
              setNote('');
            }}
            className="btn-secondary"
            style={{ fontSize: '13px' }}
          >
            Keep Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 18px 20px', width: '380px', backgroundColor: '#FAF7F2', boxSizing: 'border-box' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CatMascot mode="paw" size={20} className="" />
          <span style={{ fontSize: '16px', fontWeight: 800, color: '#2D2825', letterSpacing: '-0.3px' }}>
            Pawper Keepsakes
          </span>
        </div>
        <button
          type="button"
          onClick={openDashboard}
          title="Open Dashboard"
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#6B635B',
            textDecoration: 'underline',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          View all ↗
        </button>
      </div>

      {/* Restricted Page Notice */}
      {tabInfo?.isRestricted && (
        <div
          style={{
            backgroundColor: '#FEF3C7',
            border: '1px solid #FDE68A',
            borderRadius: '8px',
            padding: '8px 10px',
            marginBottom: '12px',
            fontSize: '11.5px',
            color: '#92400E',
            lineHeight: 1.4,
          }}
        >
          <strong>Notice:</strong> Protected browser page. You can still save custom notes & ideas!
        </div>
      )}

      {/* Live Scrap Card Form */}
      <form onSubmit={handleSave}>
        <div
          className={`card-${color}`}
          style={{
            position: 'relative',
            borderRadius: '16px',
            padding: '20px 16px 16px',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '14px',
            transition: 'background-color 0.2s ease',
          }}
        >
          {/* Washi Tape */}
          <WashiTape color={color} angle={-1.5} pattern="dots" />

          {/* Top Right Doodle Stamp */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              color: 'var(--text-muted)',
              opacity: 0.75,
            }}
          >
            <DoodleIcon type={doodle} size={18} />
          </div>

          {/* Source domain badge */}
          <div style={{ marginBottom: '10px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                backgroundColor: 'rgba(255,255,255,0.7)',
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              📍 {tabInfo?.domain || 'scrapbook'}
            </span>
          </div>

          {/* Title Input */}
          <div style={{ marginBottom: '10px' }}>
            <label
              htmlFor="card-title"
              style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '3px' }}
            >
              TITLE
            </label>
            <input
              id="card-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your find a name..."
              className="input-field"
              required
              maxLength={200}
            />
          </div>

          {/* Selected Snippet if available */}
          {selectedText ? (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                <label
                  htmlFor="card-snippet"
                  style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}
                >
                  SELECTED SNIPPET
                </label>
                <button
                  type="button"
                  onClick={() => setSelectedText('')}
                  style={{ fontSize: '10.5px', color: '#9CA3AF' }}
                >
                  Clear
                </button>
              </div>
              <textarea
                id="card-snippet"
                value={selectedText}
                onChange={(e) => setSelectedText(e.target.value)}
                className="textarea-field"
                style={{
                  fontStyle: 'italic',
                  minHeight: '52px',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '12.5px',
                }}
                maxLength={2000}
              />
            </div>
          ) : null}

          {/* Note Input */}
          <div style={{ marginBottom: '10px' }}>
            <label
              htmlFor="card-note"
              style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '3px' }}
            >
              NOTE (OPTIONAL)
            </label>
            <textarea
              id="card-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Why did you want to keep this? Add your thoughts..."
              className="textarea-field"
              style={{ minHeight: '54px' }}
              maxLength={2000}
            />
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '8px' }}>
            <label
              htmlFor="card-tags"
              style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}
            >
              TAGS
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
              {tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    aria-label={`Remove tag ${tag}`}
                    style={{ marginLeft: '2px', fontSize: '11px', color: '#9CA3AF' }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              id="card-tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type tag and press Enter..."
              className="input-field"
              style={{ fontSize: '12px', padding: '6px 10px' }}
            />
          </div>
        </div>

        {/* Color and Doodle Customizers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
          {/* Color Palette */}
          <div>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B635B', marginBottom: '4px' }}>
              COLOR
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setColor(p.id)}
                  aria-label={`Set card color to ${p.label}`}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: p.swatch,
                    border: color === p.id ? '2px solid #2D2825' : '1px solid #D1D5DB',
                    boxShadow: color === p.id ? '0 0 0 2px rgba(244, 114, 182, 0.4)' : 'none',
                    transform: color === p.id ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.15s ease',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Doodle Accent */}
          <div>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B635B', marginBottom: '4px' }}>
              DOODLE
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {DOODLES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDoodle(d.id)}
                  aria-label={`Select ${d.label} doodle`}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: doodle === d.id ? 'rgba(45, 40, 35, 0.12)' : 'rgba(255, 255, 255, 0.7)',
                    border: doodle === d.id ? '1px solid #2D2825' : '1px solid #E5E7EB',
                    color: '#2D2825',
                  }}
                >
                  <DoodleIcon type={d.id} size={15} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {errorMessage && (
          <div style={{ color: '#DC2626', fontSize: '12px', marginBottom: '10px', textAlign: 'center' }}>
            {errorMessage}
          </div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary"
          style={{ width: '100%', padding: '10px 16px', fontSize: '14px' }}
        >
          {isSaving ? 'Saving...' : 'Save to Scrapbook ✿'}
        </button>
      </form>
    </div>
  );
};
