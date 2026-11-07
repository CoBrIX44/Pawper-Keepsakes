# Pocket Scrapbook — Implementation Plan

> **Goal:** Build a cute, private-by-default Chrome Manifest V3 extension for saving web finds (pages, selected text snippets, images) as pastel scrapbook cards with washi-tape accents, inline doodles, a charming cat mascot, and a responsive search/filter dashboard.

**Architecture:** 
- Manifest V3 extension with React 19 + TypeScript + Vite.
- Multi-page build producing `dist/popup.html`, `dist/dashboard.html`, and `dist/background.js` alongside static `dist/manifest.json` and extension icons.
- Safe `chrome.storage.local` persistence with versioned schema (`schemaVersion: 1`), deep validation, schema recovery, and CRUD operations.
- Minimal permissions: `"storage"`, `"activeTab"`, `"scripting"`, `"contextMenus"`. Selected text extracted on-demand via `chrome.scripting.executeScript` when user opens popup. Right-click image saving via background service worker.
- Strict security & privacy: Local-only, zero network telemetry, XSS-safe text rendering, URL scheme validation (`http:`, `https:` only).

**Tech Stack:** React 19, TypeScript, Vite, Vitest for storage tests, Vanilla CSS with custom pastel design system tokens (warm paper, blush, lilac, peach, mint, lemon).

---

### Task 1: Initialize Project Scaffold & Configuration
- Create `package.json` with scripts (`build`, `dev`, `test`, `preview`).
- Setup `tsconfig.json`, `tsconfig.node.json`, and `vite.config.ts` configured for multi-page extension output (`popup.html`, `dashboard.html`, `background.ts`).
- Create `public/manifest.json` with MV3 configuration, action popup, permissions, options/dashboard entry, and icon references.
- Generate valid icon PNGs (16x16, 32x32, 48x48, 128x128) featuring a cute scrapbook notebook / cat paw logo.

### Task 2: Data Model, Storage Layer & Unit Tests
- Create `src/types/scrapbook.ts` defining `ScrapbookCard`, `ScrapbookData`, color palettes, and doodle types.
- Create `src/storage/scrapbook.ts` with schema validation, recovery from missing/corrupt data, and typed CRUD operations.
- Create `src/utils/sanitize.ts` for safe URL checking (reject javascript/data/etc.), domain extraction, and string trimming.
- Write unit tests in `src/storage/scrapbook.test.ts` verifying safe load, add, edit, delete, and invalid data handling.
- Verify tests pass with Vitest.

### Task 3: Background Service Worker & Image Context Menu
- Create `src/background/index.ts`.
- Register context menu item `save-image-to-scrapbook` on install/update.
- Handle `chrome.contextMenus.onClicked`: validate image URL, grab page title/domain, construct card with default doodle/color, and append to `chrome.storage.local`.
- Open dashboard helper listener if needed (`chrome.action.openPopup` or open dashboard tab).

### Task 4: Content Script / Tab Capture Utility
- Create `src/utils/tab.ts` to get active tab title, url, domain, and execute active-tab script to read `window.getSelection()?.toString()`.
- Safely handle restricted Chrome pages (e.g. `chrome://`, `edge://`, `about:blank`, webstore) with clear UI feedback.

### Task 5: Cute UI Design System & Components
- Create CSS tokens for warm paper texture/background (`#FDFBF7`), blush (`#FFE4E6`), lilac (`#EDE9FE`), peach (`#FFEDD5`), mint (`#DCFCE7`), lemon (`#FEF9C3`), washi-tapes, and accessible typography.
- Create `src/components/WashiTape.tsx` (custom tape strips with slight angles, pastel patterns).
- Create `src/components/DoodleIcon.tsx` (inline SVGs for heart, star, flower, sparkle).
- Create `src/components/CatMascot.tsx` (delightful inline SVG cat mascot peeking and resting).
- Create `src/components/Modal.tsx` for accessible dialogs (edit card, confirm delete).

### Task 6: Popup Capture Interface
- Create `popup.html` and `src/popup/App.tsx`.
- Auto-populate page title, domain, and selected text.
- Form inputs: editable title, note textarea, tag input/chips, color selector, doodle selector.
- Action buttons: "Save to Scrapbook ✿", "Open Scrapbook ↗".
- Save confirmation toast with friendly message ("Saved to your scrapbook!").
- Empty / unsupported page warning card for `chrome://` or internal pages.

### Task 7: Scrapbook Dashboard Interface
- Create `dashboard.html` and `src/dashboard/App.tsx`.
- Header featuring cute peeking cat mascot, scrapbook title, cards count counter, and "New Card" / "Export / Settings" helpers.
- Filter and search bar:
  - Real-time text search (searches title, snippet, note, tags).
  - Type filter pills (All, Snippets, Images, Links).
  - Tag filter pills (dynamically collected from all cards).
  - Color filter pills.
- Responsive card grid (1 to 3+ columns):
  - Washi tape accent on top.
  - Little doodle in corner.
  - Title with safe external link.
  - Selected text quote block with soft quotation styling.
  - Note block.
  - Image preview with fallback placeholder on error.
  - Source domain badge and relative/formatted date.
  - Tag chips.
  - Action buttons: Edit, Delete.
- Modals:
  - Edit card modal (edit title, note, tags, color, doodle).
  - Delete confirmation modal.
- Empty states:
  - No cards yet: Cute resting cat mascot illustration + friendly guide to save finds.
  - No search results: Friendly "No keepsakes found for '...'" message with clear search button.

### Task 8: Build, Verification & Documentation
- Run `pnpm run build` to compile `dist/`.
- Verify `dist/manifest.json`, `dist/background.js`, `dist/popup.html`, `dist/dashboard.html`, and icons exist and are valid.
- Run tests and linting.
- Write thorough `README.md` with:
  - Setup and build instructions.
  - How to load unpacked in Chrome (`chrome://extensions`).
  - Feature walkthrough & keyboard shortcuts.
  - Permissions breakdown and security/privacy guarantees.
- Perform end-to-end checks against the Definition of Done.
