import { isSafeUrl, extractDomain } from './sanitize';

export interface TabCaptureResult {
  title: string;
  url: string;
  domain: string;
  selectedText: string;
  isRestricted: boolean;
  restrictedReason?: string;
}

/**
 * Checks if a URL cannot be scripted by Chrome extensions.
 */
export function isRestrictedUrl(url: string | undefined): boolean {
  if (!url) return true;
  const lower = url.toLowerCase();
  return (
    lower.startsWith('chrome://') ||
    lower.startsWith('chrome-extension://') ||
    lower.startsWith('edge://') ||
    lower.startsWith('about:') ||
    lower.startsWith('view-source:') ||
    lower.includes('chrome.google.com/webstore') ||
    lower.includes('chromewebstore.google.com')
  );
}

/**
 * Captures metadata and currently selected text from the active tab.
 */
export async function captureActiveTab(): Promise<TabCaptureResult> {
  // Fallback for non-extension development testing
  if (typeof chrome === 'undefined' || !chrome.tabs) {
    return {
      title: 'Sample Web Design Inspirations 2026',
      url: 'https://example.com/cute-designs',
      domain: 'example.com',
      selectedText: 'Soft warm pastel colors evoke nostalgia and warmth in digital scrapbooking.',
      isRestricted: false,
    };
  }

  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];

    if (!tab) {
      return {
        title: 'New Keepsake',
        url: '',
        domain: 'scrapbook',
        selectedText: '',
        isRestricted: false,
      };
    }

    const title = (tab.title || 'Untitled Web Page').trim();
    const url = tab.url || '';
    const domain = isSafeUrl(url) ? extractDomain(url) : 'web';

    if (isRestrictedUrl(url)) {
      return {
        title,
        url: isSafeUrl(url) ? url : '',
        domain,
        selectedText: '',
        isRestricted: true,
        restrictedReason: 'Browser protected page (internal URLs cannot be read automatically). You can still save custom notes!',
      };
    }

    let selectedText = '';
    if (tab.id && chrome.scripting) {
      try {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const selection = window.getSelection();
            return selection ? selection.toString().trim() : '';
          },
        });

        if (results && results[0] && typeof results[0].result === 'string') {
          selectedText = results[0].result;
        }
      } catch (scriptErr) {
        // Scripting could fail if user has permissions turned off or frame is cross-origin
        console.warn('[Pocket Scrapbook] Selection capture skipped:', scriptErr);
      }
    }

    return {
      title,
      url,
      domain,
      selectedText,
      isRestricted: false,
    };
  } catch (err) {
    console.warn('[Pocket Scrapbook] Failed to capture active tab:', err);
    return {
      title: 'New Keepsake',
      url: '',
      domain: 'scrapbook',
      selectedText: '',
      isRestricted: false,
    };
  }
}
