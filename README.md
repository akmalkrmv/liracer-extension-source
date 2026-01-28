# LiRacer – Lichess Puzzle Tracker (Source Code)

This repository contains the **source code** for the **LiRacer** browser extension.

> **Note**: For the installable version and prebuilt files, please visit the main repository:  
> **https://github.com/akmalkrmv/liracer-extension**

The repository linked above serves as a **build-only repository** for convenience and easier distribution. If you want to contribute, modify, or understand how the extension works, this is the correct repository.

## About the source code
This is mostly standard browser extension structure.

### Background
`src/background`: Background service worker. Listens for messages from content scripts and saves data to browser storage.

### Content scripts
`src/content`: Scripts injected into Lichess pages to track puzzle activity.

- `content_racer.ts`: Listens for the Puzzle Racer finish event, then scrapes all stats and puzzles and sends a message to the background service worker to save them.
- `content_storm.ts`: Listens for the Puzzle Storm finish event, then scrapes all stats and puzzles and sends a message to the background service worker to save them.
- `content_training.ts`: Listens when a puzzle is reviewed (solved) and sends a message to the background service worker to mark it as reviewed.

### Popup
`src/popup`: Angular UI application for the extension’s popup window. The same app is also used as a side panel in Chromium-based browsers. It can be run locally to test the UI and uses `localStorage` when started with Angular’s `ng serve` command. See `popup/package.json` for details.

### Build scripts
`scripts`: Custom esbuild and watch scripts, invoked from `package.json` scripts. The build process collects everything (manifest.json, README file, background script, content scripts, and the popup’s Angular build) into a single `build` folder so it can be easily loaded as a browser extension.
