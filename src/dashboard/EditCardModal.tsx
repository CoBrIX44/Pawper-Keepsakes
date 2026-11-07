import React, { useState } from 'react';
import { ScrapbookCard, CardColor, CardDoodle } from '../types/scrapbook';
import { Modal } from '../components/Modal';
import { DoodleIcon } from '../components/DoodleIcon';

interface EditCardModalProps {
  card: ScrapbookCard | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: { title: string; note?: string; tags: string[]; color: CardColor; doodle: CardDoodle }) => Promise<void>;
}

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

export const EditCardModal: React.FC<EditCardModalProps> = ({
  card,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!card) return null;

  const [title, setTitle] = useState(card.title);
  const [note, setNote] = useState(card.note || '');
  const [tags, setTags] = useState<string[]>(card.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [color, setColor] = useState<CardColor>(card.color);
  const [doodle, setDoodle] = useState<CardDoodle>(card.doodle);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave(card.id, {
        title: title.trim(),
        note: note.trim() || undefined,
        tags,
        color,
        doodle,
      });
      onClose();
    } catch (err) {
      console.error('Failed to update card:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Keepsake ✎">
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={{ marginBottom: '14px' }}>
          <label
            htmlFor="edit-card-title"
            style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#4B5563', marginBottom: '4px' }}
          >
            Title
          </label>
          <input
            id="edit-card-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            required
            maxLength={200}
          />
        </div>

        {/* Note */}
        <div style={{ marginBottom: '14px' }}>
          <label
            htmlFor="edit-card-note"
            style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#4B5563', marginBottom: '4px' }}
          >
            Personal Note
          </label>
          <textarea
            id="edit-card-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="textarea-field"
            placeholder="Add any notes, reflections or details..."
            style={{ minHeight: '80px' }}
            maxLength={2000}
          />
        </div>

        {/* Tags */}
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="edit-card-tags"
            style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#4B5563', marginBottom: '4px' }}
          >
            Tags
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '6px' }}>
            {tags.map((t) => (
              <span key={t} className="tag-pill">
                #{t}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  aria-label={`Remove tag ${t}`}
                  style={{ marginLeft: '4px', fontSize: '11px', color: '#9CA3AF' }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <input
            id="edit-card-tags"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Type tag and press Enter..."
            className="input-field"
          />
        </div>

        {/* Color and Doodle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#4B5563', marginBottom: '6px' }}>
              Card Color
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setColor(p.id)}
                  aria-label={`Set color to ${p.label}`}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: p.swatch,
                    border: color === p.id ? '2px solid #2D2825' : '1px solid #D1D5DB',
                    transform: color === p.id ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#4B5563', marginBottom: '6px' }}>
              Doodle
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {DOODLES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDoodle(d.id)}
                  aria-label={`Select ${d.label} doodle`}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: doodle === d.id ? 'rgba(45, 40, 35, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                    border: doodle === d.id ? '1px solid #2D2825' : '1px solid transparent',
                  }}
                >
                  <DoodleIcon type={d.id} size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
