import { ScrapbookCard, ScrapbookData, NewCardInput, UpdateCardInput, CardColor, CardDoodle } from '../types/scrapbook';
import { isSafeUrl, extractDomain, cleanTags, cleanString } from '../utils/sanitize';

export const STORAGE_KEY = 'pocket_scrapbook_data';
export const CURRENT_SCHEMA_VERSION = 1;

const VALID_COLORS: readonly CardColor[] = ['blush', 'lilac', 'peach', 'mint', 'lemon'] as const;
const VALID_DOODLES: readonly CardDoodle[] = ['heart', 'star', 'flower', 'sparkle'] as const;

export function isValidColor(val: unknown): val is CardColor {
  return typeof val === 'string' && VALID_COLORS.includes(val as CardColor);
}

export function isValidDoodle(val: unknown): val is CardDoodle {
  return typeof val === 'string' && VALID_DOODLES.includes(val as CardDoodle);
}

/**
 * Validates and sanitizes a single card record from storage.
 * Returns null if the record is hopelessly invalid.
 */
export function sanitizeCard(raw: unknown): ScrapbookCard | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;

  const id = typeof item.id === 'string' && item.id.length > 0 ? item.id : crypto.randomUUID();
  const createdAt = typeof item.createdAt === 'number' && Number.isFinite(item.createdAt) ? item.createdAt : Date.now();
  const updatedAt = typeof item.updatedAt === 'number' && Number.isFinite(item.updatedAt) ? item.updatedAt : createdAt;

  const rawTitle = typeof item.title === 'string' ? item.title.trim() : '';
  const title = rawTitle.slice(0, 300) || 'Untitled Scrap';

  const sourceUrl = typeof item.sourceUrl === 'string' && isSafeUrl(item.sourceUrl) ? item.sourceUrl.trim() : '';
  const sourceDomain = typeof item.sourceDomain === 'string' && item.sourceDomain.trim().length > 0
    ? item.sourceDomain.trim().slice(0, 100)
    : (sourceUrl ? extractDomain(sourceUrl) : 'scrapbook');

  const selectedText = typeof item.selectedText === 'string' && item.selectedText.trim().length > 0
    ? cleanString(item.selectedText, 5000)
    : undefined;

  const note = typeof item.note === 'string' && item.note.trim().length > 0
    ? cleanString(item.note, 5000)
    : undefined;

  const imageUrl = typeof item.imageUrl === 'string' && isSafeUrl(item.imageUrl)
    ? item.imageUrl.trim()
    : undefined;

  const tags = Array.isArray(item.tags) ? cleanTags(item.tags as string[]) : [];
  const color: CardColor = isValidColor(item.color) ? item.color : 'blush';
  const doodle: CardDoodle = isValidDoodle(item.doodle) ? item.doodle : 'flower';

  return {
    id,
    createdAt,
    updatedAt,
    title,
    sourceUrl,
    sourceDomain,
    selectedText,
    note,
    imageUrl,
    tags,
    color,
    doodle,
  };
}

/**
 * Validates and repairs the entire Scrapbook storage envelope.
 */
export function parseScrapbookData(raw: unknown): ScrapbookData {
  const defaultData: ScrapbookData = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    cards: [],
  };

  if (!raw || typeof raw !== 'object') return defaultData;
  const obj = raw as Record<string, unknown>;

  const validCards: ScrapbookCard[] = [];
  if (Array.isArray(obj.cards)) {
    for (const item of obj.cards) {
      const sanitized = sanitizeCard(item);
      if (sanitized) {
        validCards.push(sanitized);
      }
    }
  }

  // Sort newest first
  validCards.sort((a, b) => b.createdAt - a.createdAt);

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    cards: validCards,
  };
}

/**
 * Storage adapter supporting chrome.storage.local with in-memory / mock fallback.
 */
interface StorageBackend {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
}

// In-memory fallback for testing or non-extension environments
const inMemoryStore: Record<string, unknown> = {};

export function getStorageBackend(): StorageBackend {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    return {
      get: (key: string) => {
        return new Promise((resolve, reject) => {
          chrome.storage.local.get([key], (result) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(result[key]);
            }
          });
        });
      },
      set: (key: string, value: unknown) => {
        return new Promise((resolve, reject) => {
          chrome.storage.local.set({ [key]: value }, () => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve();
            }
          });
        });
      },
    };
  }

  return {
    get: async (key: string) => inMemoryStore[key],
    set: async (key: string, value: unknown) => {
      inMemoryStore[key] = value;
    },
  };
}

/**
 * Loads and validates scrapbook data from storage.
 */
export async function loadScrapbookData(): Promise<ScrapbookData> {
  const storage = getStorageBackend();
  try {
    const raw = await storage.get(STORAGE_KEY);
    return parseScrapbookData(raw);
  } catch (err) {
    console.warn('[Pocket Scrapbook] Failed to read storage, recovering safely:', err);
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      cards: [],
    };
  }
}

/**
 * Persists scrapbook data to storage.
 */
export async function saveScrapbookData(data: ScrapbookData): Promise<void> {
  const storage = getStorageBackend();
  const safeData = parseScrapbookData(data);
  await storage.set(STORAGE_KEY, safeData);
}

/**
 * Gets all cards sorted newest first.
 */
export async function getCards(): Promise<ScrapbookCard[]> {
  const data = await loadScrapbookData();
  return data.cards;
}

/**
 * Creates and appends a new card to the scrapbook.
 */
export async function createCard(input: NewCardInput): Promise<ScrapbookCard> {
  const data = await loadScrapbookData();
  const now = Date.now();

  const safeUrl = isSafeUrl(input.sourceUrl) ? input.sourceUrl.trim() : '';
  const domain = input.sourceDomain?.trim() || (safeUrl ? extractDomain(safeUrl) : 'scrapbook');

  const card: ScrapbookCard = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    title: cleanString(input.title, 300) || (input.selectedText ? cleanString(input.selectedText, 50) : 'Web Keepsake'),
    sourceUrl: safeUrl,
    sourceDomain: domain,
    selectedText: input.selectedText ? cleanString(input.selectedText, 5000) : undefined,
    note: input.note ? cleanString(input.note, 5000) : undefined,
    imageUrl: input.imageUrl && isSafeUrl(input.imageUrl) ? input.imageUrl.trim() : undefined,
    tags: cleanTags(input.tags),
    color: isValidColor(input.color) ? input.color : 'blush',
    doodle: isValidDoodle(input.doodle) ? input.doodle : 'flower',
  };

  // Add at top
  data.cards = [card, ...data.cards];
  await saveScrapbookData(data);
  return card;
}

/**
 * Updates an existing card by ID.
 */
export async function updateCard(id: string, updates: UpdateCardInput): Promise<ScrapbookCard> {
  const data = await loadScrapbookData();
  const index = data.cards.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Card with ID ${id} not found.`);
  }

  const existing = data.cards[index];
  const updated: ScrapbookCard = {
    ...existing,
    updatedAt: Date.now(),
    title: updates.title !== undefined ? cleanString(updates.title, 300) || 'Untitled Scrap' : existing.title,
    note: updates.note !== undefined ? (updates.note ? cleanString(updates.note, 5000) : undefined) : existing.note,
    tags: updates.tags !== undefined ? cleanTags(updates.tags) : existing.tags,
    color: updates.color && isValidColor(updates.color) ? updates.color : existing.color,
    doodle: updates.doodle && isValidDoodle(updates.doodle) ? updates.doodle : existing.doodle,
  };

  data.cards[index] = updated;
  await saveScrapbookData(data);
  return updated;
}

/**
 * Deletes a card by ID.
 */
export async function deleteCard(id: string): Promise<boolean> {
  const data = await loadScrapbookData();
  const initialCount = data.cards.length;
  data.cards = data.cards.filter((c) => c.id !== id);
  if (data.cards.length !== initialCount) {
    await saveScrapbookData(data);
    return true;
  }
  return false;
}

/**
 * Resets storage (primarily for tests).
 */
export async function clearAllCards(): Promise<void> {
  await saveScrapbookData({
    schemaVersion: CURRENT_SCHEMA_VERSION,
    cards: [],
  });
}
