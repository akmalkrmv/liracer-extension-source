import { inject, Injectable } from '@angular/core';
import { STORAGE_KEYS } from '@extension/shared/consts';
import { IStorageAdapter, STORAGE_ADAPTER } from './storage';

@Injectable({ providedIn: 'root' })
export class ScrollManagerService {
  private scrollContainer: HTMLElement | null = null;
  private scrollTimeout: number | undefined;
  private readonly storage: IStorageAdapter = inject(STORAGE_ADAPTER);

  constructor() {
    // Optionally, initialize scroll container here if needed
  }

  // Initialize ScrollManager for the given container
  init(scrollContainerSelector: string): void {
    this.scrollContainer = document.querySelector(scrollContainerSelector);

    if (this.scrollContainer) {
      this.setupThrottledListener();
      this.restore();
    }
  }

  // Save scroll position
  private save(): void {
    if (this.scrollContainer) {
      const scrollPosition: number = this.scrollContainer.scrollTop;
      this.storage.set({ popupScrollPosition: scrollPosition });
    }
  }

  // Restore scroll position
  private restore(): void {
    this.storage.get(STORAGE_KEYS.POPUP_SCROLL_POSITION).then(({ popupScrollPosition }) => {
      if (this.scrollContainer && popupScrollPosition !== undefined) {
        this.scrollContainer.scrollTop = popupScrollPosition as number;
      }
    });
  }

  // Set up throttled scroll listener
  private setupThrottledListener(): void {
    if (this.scrollContainer) {
      this.scrollContainer.addEventListener('scroll', () => {
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => this.save(), 200);
      });
    }
  }
}
