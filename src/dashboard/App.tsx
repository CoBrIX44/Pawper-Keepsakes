import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { ScrapbookCard, CardColor, CardDoodle, NewCardInput } from '../types/scrapbook';
import { getCards, updateCard, deleteCard, createCard } from '../storage/scrapbook';
import { Header } from './Header';
import { FilterBar, CardTypeFilter } from './FilterBar';
import { CardItem } from './CardItem';
import { EditCardModal } from './EditCardModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { CreateCardModal } from './CreateCardModal';
import { CatMascot } from '../components/CatMascot';
import '../styles/scrapbook.css';

export const DashboardApp: React.FC = () => {
  const [cards, setCards] = useState<ScrapbookCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<CardTypeFilter>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<CardColor | null>(null);

  // Modals
  const [editingCard, setEditingCard] = useState<ScrapbookCard | null>(null);
  const [deletingCard, setDeletingCard] = useState<ScrapbookCard | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchCards = useCallback(async () => {
    try {
      setStorageError(null);
      const loaded = await getCards();
      setCards(loaded);
    } catch (err) {
      console.error('[Pocket Scrapbook] Error loading cards:', err);
      setStorageError('Unable to load cards from storage.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();

    // Listen for storage updates across tabs/context menu
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
      const listener = (changes: Record<string, chrome.storage.StorageChange>, areaName: string) => {
        if (areaName === 'local' && changes.pocket_scrapbook_data) {
          fetchCards();
        }
      };
      chrome.storage.onChanged.addListener(listener);
      return () => {
        chrome.storage.onChanged.removeListener(listener);
      };
    }
  }, [fetchCards]);

  // Extract all unique tags sorted by frequency
  const availableTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const card of cards) {
      for (const tag of card.tags) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [cards]);

  // Filtered Cards
  const filteredCards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return cards.filter((card) => {
      // Type filter
      if (typeFilter === 'snippet' && !card.selectedText) return false;
      if (typeFilter === 'image' && !card.imageUrl) return false;
      if (typeFilter === 'link' && (card.selectedText || card.imageUrl)) return false;

      // Color filter
      if (selectedColor && card.color !== selectedColor) return false;

      // Tag filter
      if (selectedTag && !card.tags.includes(selectedTag)) return false;

      // Text Search
      if (query) {
        const matchesTitle = card.title.toLowerCase().includes(query);
        const matchesNote = card.note?.toLowerCase().includes(query) ?? false;
        const matchesSnippet = card.selectedText?.toLowerCase().includes(query) ?? false;
        const matchesDomain = card.sourceDomain.toLowerCase().includes(query);
        const matchesTags = card.tags.some((t) => t.toLowerCase().includes(query));

        if (!matchesTitle && !matchesNote && !matchesSnippet && !matchesDomain && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [cards, searchQuery, typeFilter, selectedTag, selectedColor]);

  const isFiltered = Boolean(searchQuery || typeFilter !== 'all' || selectedTag || selectedColor);

  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setSelectedTag(null);
    setSelectedColor(null);
  };

  const handleUpdateCard = async (
    id: string,
    updates: { title: string; note?: string; tags: string[]; color: CardColor; doodle: CardDoodle }
  ) => {
    const updated = await updateCard(id, updates);
    setCards((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const handleDeleteCard = async (id: string) => {
    await deleteCard(id);
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCreateCard = async (input: NewCardInput) => {
    const created = await createCard(input);
    setCards((prev) => [created, ...prev]);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <Header cardCount={cards.length} onNewScrap={() => setIsCreateOpen(true)} />

      {/* Main Container */}
      <main
        style={{
          flex: 1,
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '24px 24px 60px',
          boxSizing: 'border-box',
        }}
      >
        {/* Storage Error Banner */}
        {storageError && (
          <div
            style={{
              backgroundColor: '#FEE2E2',
              border: '1px solid #FCA5A5',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#991B1B',
              fontSize: '13px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{storageError}</span>
            <button
              type="button"
              onClick={fetchCards}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '4px 10px' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Filter Bar (Only show if we have cards or actively filtered) */}
        {(cards.length > 0 || isFiltered) && (
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
            availableTags={availableTags}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
            onClearFilters={handleClearFilters}
            isFiltered={isFiltered}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <CatMascot mode="resting" size={90} />
            <p style={{ marginTop: '16px', fontSize: '14px', color: '#6B635B' }}>
              Fetching your keepsake collection...
            </p>
          </div>
        )}

        {/* Empty Collection State */}
        {!loading && cards.length === 0 && !isFiltered && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              maxWidth: '460px',
              margin: '40px auto',
              backgroundColor: '#FFFDF9',
              borderRadius: '24px',
              border: '1px dashed var(--border-subtle)',
              boxShadow: '0 4px 16px rgba(60, 40, 20, 0.04)',
            }}
          >
            <CatMascot mode="resting" size={130} />
            <h2
              style={{
                fontSize: '19px',
                fontWeight: 800,
                color: '#2D2825',
                marginTop: '16px',
                marginBottom: '8px',
              }}
            >
              Your scrapbook is quiet right now
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: '#6B635B',
                lineHeight: 1.5,
                marginBottom: '24px',
              }}
            >
              Click the Pocket Scrapbook icon while browsing any webpage, or right-click any image to tuck keepsakes here.
            </p>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="btn-primary"
              style={{ fontSize: '14px', padding: '10px 22px' }}
            >
              + Create your first note ✿
            </button>
          </div>
        )}

        {/* No Search Results State */}
        {!loading && filteredCards.length === 0 && cards.length > 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              maxWidth: '440px',
              margin: '30px auto',
            }}
          >
            <CatMascot mode="resting" size={100} />
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#2D2825',
                marginTop: '16px',
                marginBottom: '8px',
              }}
            >
              No keepsakes match your search
            </h2>
            <p
              style={{
                fontSize: '13.5px',
                color: '#6B635B',
                marginBottom: '20px',
              }}
            >
              We couldn't find any scraps matching your query or filters.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="btn-secondary"
              style={{ fontSize: '13px' }}
            >
              Clear all filters ↺
            </button>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && filteredCards.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
              alignItems: 'start',
            }}
          >
            {filteredCards.map((card, index) => (
              <CardItem
                key={card.id}
                card={card}
                index={index}
                onEdit={setEditingCard}
                onDelete={setDeletingCard}
                onSelectTag={(tag) => setSelectedTag(tag)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <EditCardModal
        card={editingCard}
        isOpen={Boolean(editingCard)}
        onClose={() => setEditingCard(null)}
        onSave={handleUpdateCard}
      />

      <DeleteConfirmModal
        card={deletingCard}
        isOpen={Boolean(deletingCard)}
        onClose={() => setDeletingCard(null)}
        onConfirm={handleDeleteCard}
      />

      <CreateCardModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateCard}
      />
    </div>
  );
};
