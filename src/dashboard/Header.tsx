import React from 'react';
import { CatMascot } from '../components/CatMascot';

interface HeaderProps {
  cardCount: number;
  onNewScrap: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cardCount, onNewScrap }) => {
  return (
    <header
      style={{
        position: 'relative',
        backgroundColor: '#FFFDF9',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '24px 28px 20px',
        boxShadow: '0 2px 8px rgba(60, 40, 20, 0.04)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Brand & Mascot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
          {/* Peeking Cat Mascot */}
          <div
            style={{
              position: 'relative',
              marginTop: '-12px',
              cursor: 'default',
            }}
            title="Pocket Scrapbook Mascot"
          >
            <CatMascot mode="peeking" size={72} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#2D2825',
                  letterSpacing: '-0.5px',
                }}
              >
                Pawper Keepsakes
              </h1>
              <span
                style={{
                  backgroundColor: '#FFE8EC',
                  color: '#C7385F',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: '1px solid #F9CAD2',
                }}
              >
                ✿ Local & Private
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#6B635B', marginTop: '2px' }}>
              Your cozy corner for saving web snippets, images & memories
            </p>
          </div>
        </div>

        {/* Counter & Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              backgroundColor: '#FAF7F2',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#6B635B',
            }}
          >
            <strong>{cardCount}</strong> {cardCount === 1 ? 'keepsake' : 'keepsakes'} tucked away
          </div>

          <button
            type="button"
            onClick={onNewScrap}
            className="btn-primary"
            style={{ fontSize: '13.5px' }}
          >
            <span>+ Add Note</span>
          </button>
        </div>
      </div>
    </header>
  );
};
