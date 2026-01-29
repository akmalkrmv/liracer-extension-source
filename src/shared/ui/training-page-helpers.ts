import {LINKS} from '../consts';

const CUSTOM_LINK_CSS_CLASS = 'liRacer-extension-next-puzzle-container';

const CUSTOM_STYLES = `
  .${CUSTOM_LINK_CSS_CLASS} {
    min-width: 160px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    padding: 0 1rem;

    & > a { 
      color: var(--c-font);
      &:hover { color: var(--c-link); }
    }

    @media (min-width: 799.3px), (orientation: landscape) {
      border-top: 1px solid var(--c-border);
      justify-content: space-between;
      padding: 1em 2em;
    }
  }`;

export function attachCustomStylesIntoDocumentHead() {
  const style: HTMLStyleElement = document.createElement('style');
  style.textContent = CUSTOM_STYLES;
  document.head.appendChild(style);
}

export function appendNextUnsolvedLink(container: Element, puzzleLink: string | undefined, count: number): void {
  if (!container) return;
  if (!puzzleLink) return;

  const wrapper: HTMLDivElement = document.createElement('div');
  wrapper.className = 'liRacer-extension-next-puzzle-container';
  wrapper.appendChild(createExtensionIconImage());
  wrapper.appendChild(createNextUnsolvedLink(puzzleLink, count));
  container.appendChild(wrapper);
}

export function createExtensionIconImage(imgSize: string = '16px'): HTMLImageElement {
  const img: HTMLImageElement = document.createElement('img');
  img.src = chrome.runtime.getURL('assets/icons/48.png');
  img.alt = 'LiRacer Extension icon';
  img.title = 'LiRacer Extension';
  img.loading = 'lazy';
  img.decoding = 'async';
  img.style.width = imgSize;
  img.style.height = imgSize;

  return img;
}

export function createNextUnsolvedLink(puzzleLink: string, count: number): HTMLAnchorElement {
  const link: HTMLAnchorElement = document.createElement('a');
  link.href = prependPathIfNeeded(LINKS.TRAINING, puzzleLink);
  link.textContent = `LiRacer: Next in Training (${count})`;

  return link;
}

export function prependPathIfNeeded(path: string, puzzleLinkOrId: string): string {
  return puzzleLinkOrId.startsWith(path) ? puzzleLinkOrId : `${path}${puzzleLinkOrId}`;
}
