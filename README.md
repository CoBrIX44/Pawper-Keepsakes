# Pawper Keepsakes 🐾

A cute, private-by-default Chrome Manifest V3 extension for saving web finds, quotes, snippets, and images as pastel scrapbook cards with washi-tape accents, charming doodles, and a friendly cat mascot.

---

## Highlights

- **Private & Local-first:** All keepsakes stay safely on your computer in `chrome.storage.local`. No external servers, no tracking, no sync accounts, and zero remote network requests.
- **Cute Pastel Aesthetic:** Warm paper background (`#FAF7F2`), delicate washi-tape strips with subtle tilt angles, hand-drawn inline SVG doodles (flower, heart, star, sparkle), and an adorable cat mascot who peeks from the dashboard and curls up when your collection is quiet.
- **Effortless Capture:** 
  - Click the extension icon on any page to capture the page title, URL, domain, and any text you highlighted.
  - Right-click any image on the web and select **"Save image to Pawper Keepsakes 🐾"** to tuck it into your collection instantly.
- **Search & Filter Dashboard:** Browse your keepsakes newest-first in a responsive card grid. Filter by card type (*All*, *Snippets*, *Images*, *Links*), click tag chips, filter by color, or use instant full-text search.
- **Accessible & Safe:** Contrast-tested pastel palettes, full keyboard focus rings, ESC-to-dismiss modals, safe link validation (`http:`/`https:` only), and full support for `prefers-reduced-motion`.

---

## Quick Start & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18+ (tested on Node v24)
- `npm` or `pnpm`

### 2. Build the Extension
```bash
# Install dependencies
npm install

# Build the extension for Chrome (Manifest V3)
npm run build
```
This generates the loadable extension directory at:
```
dist/
```

### 3. Load Unpacked in Google Chrome
1. Open Google Chrome and navigate to:
   ```
   chrome://extensions
   ```
2. Toggle on **Developer mode** in the top-right corner.
3. Click the **Load unpacked** button in the top-left toolbar.
4. Select the `dist` folder located inside this project directory (`d:\Pawper Keepsakes\dist`).
5. Pin **Pawper Keepsakes** to your Chrome toolbar for quick access!

---

## How to Use

### 1. Save a Page or Snippet
1. Highlight any sentence or paragraph on a webpage (optional).
2. Click the **Pawper Keepsakes** icon in your Chrome toolbar.
3. Your highlighted snippet, page title, and domain are automatically filled in.
4. Customize the title, write a personal note, add `#tags`, and pick a card color and doodle.
5. Click **"Save to Scrapbook ✿"**!

### 2. Save an Image via Right-Click
1. Right-click any image on a web page.
2. Select **"Save image to Pawper Keepsakes 🐾"** from the context menu.
3. A small checkmark badge (`✓`) confirms that the image has been saved.

### 3. Open the Keepsakes Dashboard
- Click **"View all ↗"** or **"Open Scrapbook ↗"** inside the popup, or open `chrome://extensions` → Pawper Keepsakes → **Extension options**.
- You can also add custom notes and keepsakes directly inside the dashboard using the **"+ Add Note"** button.

### 4. Search, Filter, Edit, and Delete
- **Search:** Type in the search bar to filter across card titles, notes, excerpts, domains, and tags.
- **Filters:** Click type pills (*Snippets*, *Images*, *Links*), color swatches, or tag badges.
- **Edit:** Click **"Edit ✎"** on any card to update its title, note, tags, color, or doodle.
- **Delete:** Click **"Delete 🗑"** to permanently remove a card after confirming in the modal.

---

## Packaging for Chrome Web Store

To generate the ready-to-upload ZIP file for the Chrome Developer Dashboard:
```bash
npm run package
```
This produces `pawper-keepsakes.zip` ready for upload.

---

## Permissions Rationale

Pawper Keepsakes adheres to Chrome's principle of minimum necessary permissions:

| Permission | Rationale |
| :--- | :--- |
| `storage` | Required to store and manage your scrapbook cards locally in `chrome.storage.local`. |
| `activeTab` | Allows the popup to read the current tab's title and URL strictly when you click the extension icon. |
| `scripting` | Extracts the user's explicitly highlighted text (`window.getSelection()`) upon opening the popup. No background scripts run on your tabs. |
| `contextMenus` | Registers the right-click menu action to save images directly to your scrapbook. |

*No host permissions (`<all_urls>`) are requested or needed.*

---

## Security & Privacy Architecture

- **Untrusted Content Sanitization:** All titles, excerpts, notes, domains, and tags are treated as untrusted text and rendered strictly via safe React DOM text nodes (never `dangerouslySetInnerHTML`).
- **URL Validation:** All outbound links and image preview URLs are strictly validated to allow only `http:` and `https:`. Executable schemes like `javascript:`, `data:`, and `file:` are rejected.
- **No Remote Downloads:** Remote images are never downloaded or transmitted; only the source URL is saved, preventing arbitrary file execution and conserving storage space.
- **100% Offline Assets:** All cat mascot illustrations, washi-tape patterns, and doodles are hand-crafted inline SVGs. The extension does not load remote fonts or CDNs.

---

## Development & Testing

```bash
# Run unit test suite
npm test

# Run tests in watch mode
npm run test:watch

# Typecheck codebase
npx tsc --noEmit
```

---

## Data Schema

Storage envelopes are versioned:
```ts
type ScrapbookData = {
  schemaVersion: 1;
  cards: ScrapbookCard[];
};

type ScrapbookCard = {
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
  color: "blush" | "lilac" | "peach" | "mint" | "lemon";
  doodle: "heart" | "star" | "flower" | "sparkle";
};
```
