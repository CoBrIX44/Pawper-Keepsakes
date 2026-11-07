import React, { useState } from 'react';
import { ScrapbookCard } from '../types/scrapbook';
import { WashiTape } from '../components/WashiTape';
import { DoodleIcon } from '../components/DoodleIcon';

interface CardItemProps {
  card: ScrapbookCard;
  index: number;
  onEdit: (card: ScrapbookCard) => void;
  onDelete: (card: ScrapbookCard) => void;
  onSelectTag: (tag: string) => void;
}

function formatDate(timestamp: number): string {
  try {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export const CardItem: React.FC<CardItemProps> = ({
  card,
  index,
  onEdit,
  onDelete,
  onSelectTag,
}) => {
  const [imageError, setImageError] = useState(false);

  // Slight pseudo-random angle based on card index
  const angles = [-1.4, 1.2, -0.8, 1.5, -1.8, 0.9];
  const tapeAngle = angles[index % angles.length];

  return (
    <article
      className={`card-${card.color}`}
      style={{
        position: 'relative',
        borderRadius: '18px',
        padding: '24px 20px 18px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        wordBreak: 'break-word',
      }}
    >
      {/* Top Washi Tape */}
      <WashiTape color={card.color} angle={tapeAngle} pattern="stripes" />

      {/* Top Right Doodle Icon */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '14px',
          color: 'var(--text-muted)',
          opacity: 0.7,
        }}
        title={`Doodle: ${card.doodle}`}
      >
        <DoodleIcon type={card.doodle} size={18} />
      </div>

      {/* Card Content */}
      <div>
        {/* Meta Header: Domain + Date */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            marginBottom: '10px',
            paddingRight: '22px', // space for doodle
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              backgroundColor: 'rgba(255,255,255,0.7)',
              padding: '2px 8px',
              borderRadius: '9999px',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            {card.sourceDomain || 'scrapbook'}
          </span>

          <time
            dateTime={new Date(card.createdAt).toISOString()}
            style={{ fontSize: '11px', color: 'var(--text-dim)' }}
          >
            {formatDate(card.createdAt)}
          </time>
        </div>

        {/* Title / Link */}
        <h2
          style={{
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: 1.35,
            marginBottom: '12px',
            color: 'var(--text-main)',
          }}
        >
          {card.sourceUrl ? (
            <a
              href={card.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'inherit',
                textDecoration: 'none',
                borderBottom: '1.5px dotted rgba(0,0,0,0.3)',
              }}
              title="Open source page in new tab"
            >
              {card.title} ↗
            </a>
          ) : (
            card.title
          )}
        </h2>

        {/* Image Preview if available */}
        {card.imageUrl && (
          <div
            style={{
              marginBottom: '14px',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            {!imageError ? (
              <img
                src={card.imageUrl}
                alt={card.title}
                loading="lazy"
                onError={() => setImageError(true)}
                style={{
                  width: '100%',
                  maxHeight: '220px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            ) : (
              <div
                style={{
                  padding: '18px 12px',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: 'var(--text-dim)',
                  backgroundColor: 'rgba(0,0,0,0.02)',
                }}
              >
                <span style={{ fontSize: '18px', display: 'block', marginBottom: '4px' }}>🖼️</span>
                Image preview unavailable (remote source blocked or expired)
              </div>
            )}
          </div>
        )}

        {/* Selected Quote / Snippet */}
        {card.selectedText && (
          <blockquote
            style={{
              marginBottom: '12px',
              padding: '10px 14px',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderLeft: '3px solid rgba(0, 0, 0, 0.2)',
              borderRadius: '0 8px 8px 0',
              fontSize: '13px',
              lineHeight: 1.45,
              color: '#3F3935',
              fontStyle: 'italic',
            }}
          >
            "{card.selectedText}"
          </blockquote>
        )}

        {/* User Note */}
        {card.note && (
          <div
            style={{
              marginBottom: '14px',
              fontSize: '13px',
              lineHeight: 1.45,
              color: 'var(--text-main)',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px dashed rgba(0,0,0,0.1)',
            }}
          >
            <span style={{ fontWeight: 600, fontSize: '11.5px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
              Note:
            </span>
            {card.note}
          </div>
        )}

        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>
            {card.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onSelectTag(tag)}
                className="tag-pill"
                style={{ cursor: 'pointer' }}
                title={`Filter by #${tag}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '8px',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          paddingTop: '10px',
          marginTop: '6px',
        }}
      >
        <button
          type="button"
          onClick={() => onEdit(card)}
          aria-label={`Edit "${card.title}"`}
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            padding: '3px 8px',
            borderRadius: '6px',
            backgroundColor: 'rgba(255,255,255,0.6)',
          }}
        >
          Edit ✎
        </button>

        <button
          type="button"
          onClick={() => onDelete(card)}
          aria-label={`Delete "${card.title}"`}
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#991B1B',
            padding: '3px 8px',
            borderRadius: '6px',
            backgroundColor: 'rgba(255,255,255,0.6)',
          }}
        >
          Delete 🗑
        </button>
      </div>
    </article>
  );
};
