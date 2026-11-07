import { createCard } from '../storage/scrapbook';
import { isSafeUrl, extractDomain } from '../utils/sanitize';
import { CardColor, CardDoodle } from '../types/scrapbook';

const CONTEXT_MENU_ID = 'save-image-to-pocket-scrapbook';

const PASTEL_COLORS: CardColor[] = ['blush', 'lilac', 'peach', 'mint', 'lemon'];
const DOODLES: CardDoodle[] = ['heart', 'star', 'flower', 'sparkle'];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Register Context Menu on install or update
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: 'Save image to Pawper Keepsakes 🐾',
      contexts: ['image'],
    });
  });
});

// Handle Context Menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID) return;

  const imageUrl = info.srcUrl;
  if (!imageUrl || !isSafeUrl(imageUrl)) {
    console.warn('[Pocket Scrapbook] Rejected unsafe or missing image URL:', imageUrl);
    return;
  }

  const pageUrl = tab?.url && isSafeUrl(tab.url) ? tab.url : '';
  const pageTitle = tab?.title?.trim() || 'Saved Image';
  const domain = pageUrl ? extractDomain(pageUrl) : 'web';

  try {
    await createCard({
      title: pageTitle.slice(0, 80),
      sourceUrl: pageUrl,
      sourceDomain: domain,
      imageUrl,
      note: 'Saved via right-click image menu',
      color: getRandomItem(PASTEL_COLORS),
      doodle: getRandomItem(DOODLES),
      tags: ['image', domain],
    });

    // Provide visual confirmation badge
    if (chrome.action) {
      chrome.action.setBadgeText({ text: '✓' });
      chrome.action.setBadgeBackgroundColor({ color: '#F472B6' });
      setTimeout(() => {
        chrome.action.setBadgeText({ text: '' });
      }, 2500);
    }
  } catch (err) {
    console.error('[Pocket Scrapbook] Failed to save image to scrapbook:', err);
  }
});

// Listen for messages if needed
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'OPEN_DASHBOARD') {
    const dashboardUrl = chrome.runtime.getURL('dashboard.html');
    chrome.tabs.create({ url: dashboardUrl });
    sendResponse({ ok: true });
    return true;
  }
});
