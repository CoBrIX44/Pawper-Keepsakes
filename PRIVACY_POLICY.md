# Privacy Policy for Pawper Keepsakes

**Last updated:** November 2026

**Pawper Keepsakes** is designed from the ground up to be private and local-by-default. We believe your personal notes, web bookmarks, and memories belong exclusively to you.

---

## 1. Information Collection and Storage
- **Local Storage Only:** Pawper Keepsakes does not transmit, collect, or store any of your data on external servers, cloud databases, or third-party platforms.
- **Local Device:** All saved cards, titles, excerpts, personal notes, tags, colors, and URL links reside exclusively on your local computer via Chrome's native `chrome.storage.local` API.
- **No Analytics / Telemetry:** We do not track user behavior, page visits, clicks, search queries, or analytics.

---

## 2. Permissions Justification

Pawper Keepsakes requests the absolute minimum permissions necessary to deliver its core features:

| Permission | Purpose |
| :--- | :--- |
| `storage` | Used to save and retrieve your scrapbook cards locally on your device using `chrome.storage.local`. |
| `activeTab` | Temporarily accesses the active tab's title and URL strictly when you click the extension action icon. |
| `scripting` | Used on demand to read text that you have explicitly selected on the page (`window.getSelection()`). No background scripts run on other tabs. |
| `contextMenus` | Registers the right-click menu item (*"Save image to Pawper Keepsakes 🐾"*) allowing you to tuck web images into your scrapbook. |

---

## 3. Remote Assets and Network Requests
Pawper Keepsakes makes **zero remote network requests**:
- All icons, doodles, washi-tape patterns, and illustrations are bundled inline with the extension.
- Remote images you save are never downloaded or uploaded to any server; only the image source URL is saved locally to display a preview inside your dashboard.

---

## 4. Third-Party Sharing
Since no data is collected or transmitted outside your local browser, no user data is ever sold, rented, shared, or transferred to any third parties.

---

## 5. Contact
If you have any questions or feedback regarding this Privacy Policy, please open an issue on our GitHub repository.
