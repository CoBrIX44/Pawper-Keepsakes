export type CardColor = 'blush' | 'lilac' | 'peach' | 'mint' | 'lemon';

export type CardDoodle = 'heart' | 'star' | 'flower' | 'sparkle';

export interface ScrapbookCard {
  id: string;                 // crypto.randomUUID()
  createdAt: number;          // Unix milliseconds
  updatedAt: number;          // Unix milliseconds
  title: string;
  sourceUrl: string;
  sourceDomain: string;
  selectedText?: string;
  note?: string;
  imageUrl?: string;
  tags: string[];
  color: CardColor;
  doodle: CardDoodle;
}

export interface ScrapbookData {
  schemaVersion: 1;
  cards: ScrapbookCard[];
}

export type NewCardInput = {
  title: string;
  sourceUrl: string;
  sourceDomain?: string;
  selectedText?: string;
  note?: string;
  imageUrl?: string;
  tags?: string[];
  color?: CardColor;
  doodle?: CardDoodle;
};

export type UpdateCardInput = Partial<Pick<ScrapbookCard, 'title' | 'note' | 'tags' | 'color' | 'doodle'>>;
