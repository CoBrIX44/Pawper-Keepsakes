import { describe, it, expect, beforeEach } from 'vitest';
import {
  parseScrapbookData,
  createCard,
  getCards,
  updateCard,
  deleteCard,
  clearAllCards,
  CURRENT_SCHEMA_VERSION,
} from './scrapbook';
import { isSafeUrl, extractDomain, cleanTags } from '../utils/sanitize';

describe('Sanitize utilities', () => {
  it('validates safe URLs and rejects dangerous schemes', () => {
    expect(isSafeUrl('https://example.com/article')).toBe(true);
    expect(isSafeUrl('http://insecure.test')).toBe(true);
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isSafeUrl('file:///etc/passwd')).toBe(false);
    expect(isSafeUrl('')).toBe(false);
    expect(isSafeUrl(null)).toBe(false);
  });

  it('extracts domains cleanly', () => {
    expect(extractDomain('https://www.github.com/torvalds')).toBe('github.com');
    expect(extractDomain('http://blog.my-site.org:8080/path')).toBe('blog.my-site.org');
    expect(extractDomain('invalid-url')).toBe('web');
  });

  it('cleans tags correctly', () => {
    const tags = ['#Inspiration', ' ideas ', 'INSPIRATION', '  ', 'design-system#'];
    expect(cleanTags(tags)).toEqual(['inspiration', 'ideas', 'design-system#']);
  });
});

describe('Scrapbook Storage Layer', () => {
  beforeEach(async () => {
    await clearAllCards();
  });

  it('handles null, empty, or malformed data gracefully', () => {
    const recovered1 = parseScrapbookData(null);
    expect(recovered1.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(recovered1.cards).toEqual([]);

    const recovered2 = parseScrapbookData({ schemaVersion: 99, cards: 'not-an-array' });
    expect(recovered2.cards).toEqual([]);

    const recovered3 = parseScrapbookData({
      cards: [
        { id: '1', title: 'Card 1', color: 'invalid-color' },
        null,
        'junk',
      ],
    });
    expect(recovered3.cards.length).toBe(1);
    expect(recovered3.cards[0].color).toBe('blush'); // Fallback default
  });

  it('creates and retrieves cards newest-first', async () => {
    const card1 = await createCard({
      title: 'First Card',
      sourceUrl: 'https://example.com/1',
      selectedText: 'Some quote snippet',
      color: 'peach',
      doodle: 'star',
      tags: ['quote', 'web'],
    });

    // Small delay to ensure timestamp difference
    await new Promise((r) => setTimeout(r, 10));

    const card2 = await createCard({
      title: 'Second Card',
      sourceUrl: 'https://example.com/2',
      color: 'mint',
      doodle: 'flower',
      tags: ['reading'],
    });

    const cards = await getCards();
    expect(cards.length).toBe(2);
    expect(cards[0].id).toBe(card2.id); // Newer first
    expect(cards[1].id).toBe(card1.id);
    expect(cards[1].selectedText).toBe('Some quote snippet');
    expect(cards[1].tags).toEqual(['quote', 'web']);
  });

  it('updates an existing card', async () => {
    const card = await createCard({
      title: 'Original Title',
      sourceUrl: 'https://example.com',
      note: 'My initial note',
      color: 'lilac',
    });

    const updated = await updateCard(card.id, {
      title: 'Updated Title',
      note: 'Revised note',
      color: 'lemon',
      tags: ['updated'],
    });

    expect(updated.title).toBe('Updated Title');
    expect(updated.note).toBe('Revised note');
    expect(updated.color).toBe('lemon');
    expect(updated.tags).toEqual(['updated']);

    const cards = await getCards();
    expect(cards[0].title).toBe('Updated Title');
  });

  it('deletes a card by id', async () => {
    const card = await createCard({
      title: 'To Be Deleted',
      sourceUrl: 'https://example.com',
    });

    expect((await getCards()).length).toBe(1);

    const deleted = await deleteCard(card.id);
    expect(deleted).toBe(true);

    const cardsAfter = await getCards();
    expect(cardsAfter.length).toBe(0);

    const deletedAgain = await deleteCard(card.id);
    expect(deletedAgain).toBe(false);
  });
});
