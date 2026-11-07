import React from 'react';
import { CardColor } from '../types/scrapbook';

export type CardTypeFilter = 'all' | 'snippet' | 'image' | 'link';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: CardTypeFilter;
  onTypeFilterChange: (type: CardTypeFilter) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  availableTags: string[];
  selectedColor: CardColor | null;
  onSelectColor: (color: CardColor | null) => void;
  onClearFilters: () => void;
  isFiltered: boolean;
}

const PALETTES: { id: CardColor; label: string; swatch: string }[] = [
  { id: 'blush', label: 'Blush', swatch: '#FFE8EC' },
  { id: 'lilac', label: 'Lilac', swatch: '#EFE9FE' },
  { id: 'peach', label: 'Peach', swatch: '#FFE9D9' },
  { id: 'mint', label: 'Mint', swatch: '#DEF7EC' },
  { id: 'lemon', label: 'Lemon', swatch: '#FEF9C3' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  selectedTag,
  onSelectTag,
  availableTags,
  selectedColor,
  onSelectColor,
  onClearFilters,
  isFiltered,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#FFFDF9',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '24px',
        boxShadow: '0 2px 6px rgba(60, 40, 20, 0.03)',
      }}
    >
      {/* Top row: Search and Type Pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: availableTags.length > 0 || isFiltered ? '14px' : '0',
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '240px', maxWidth: '400px' }}>
          <span
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9CA3AF',
              fontSize: '14px',
              pointerEvents: 'none',
            }}
          >
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search titles, notes, snippets, tags..."
            aria-label="Search keepsakes"
            className="input-field"
            style={{ paddingLeft: '34px', paddingRight: searchQuery ? '30px' : '12px' }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
                fontSize: '14px',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Type Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#6B635B', marginRight: '4px' }}>
            TYPE:
          </span>
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'snippet', label: 'Snippets' },
              { id: 'image', label: 'Images' },
              { id: 'link', label: 'Links' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onTypeFilterChange(item.id)}
              style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: typeFilter === item.id ? '#2D2825' : 'rgba(0,0,0,0.04)',
                color: typeFilter === item.id ? '#FFFDF9' : '#574F49',
                transition: 'all 0.15s ease',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Color Palette Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#6B635B', marginRight: '2px' }}>
            COLOR:
          </span>
          {PALETTES.map((p) => {
            const isSelected = selectedColor === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectColor(isSelected ? null : p.id)}
                title={`Filter by ${p.label}`}
                aria-label={`Filter by ${p.label}`}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: p.swatch,
                  border: isSelected ? '2px solid #2D2825' : '1px solid #D1D5DB',
                  boxShadow: isSelected ? '0 0 0 2px rgba(244, 114, 182, 0.4)' : 'none',
                  transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom row: Tag cloud and Clear All */}
      {(availableTags.length > 0 || isFiltered) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            borderTop: '1px dashed var(--border-subtle)',
            paddingTop: '12px',
          }}
        >
          {/* Tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B635B', marginRight: '4px' }}>
              TAGS:
            </span>
            {availableTags.slice(0, 15).map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onSelectTag(isSelected ? null : tag)}
                  style={{
                    padding: '2px 9px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 500,
                    backgroundColor: isSelected ? '#FBCFE8' : 'rgba(0,0,0,0.04)',
                    color: isSelected ? '#831843' : '#6B635B',
                    border: isSelected ? '1px solid #F472B6' : '1px solid transparent',
                  }}
                >
                  #{tag}
                </button>
              );
            })}
          </div>

          {/* Reset button */}
          {isFiltered && (
            <button
              type="button"
              onClick={onClearFilters}
              style={{
                fontSize: '11.5px',
                fontWeight: 600,
                color: '#C7385F',
                textDecoration: 'underline',
              }}
            >
              Reset filters ↺
            </button>
          )}
        </div>
      )}
    </div>
  );
};
