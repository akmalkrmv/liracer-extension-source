import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LinkHandlerService {
  public currentTabUrl: WritableSignal<string> = signal('');

  constructor() {
    this.getCurrentTab().then((currentTab: chrome.tabs.Tab) => {
      this.currentTabUrl.set(currentTab?.url || '');
    });

    if (chrome.tabs) {
      // tab activated
      chrome.tabs.onActivated.addListener(({ tabId }) => {
        chrome.tabs.get(tabId, (tab: chrome.tabs.Tab) => this.currentTabUrl.set(tab?.url || ''));
      });

      // URL changed in same tab
      chrome.tabs.onUpdated.addListener(
        (tabId: number, changeInfo: chrome.tabs.OnUpdatedInfo, tab: chrome.tabs.Tab) => {
          if (changeInfo.url) {
            this.currentTabUrl.set(tab.url || '');
          }
        },
      );
    }
  }

  public navigate(url: string, closePopup: boolean) {
    this.getCurrentTab().then((currentTab: chrome.tabs.Tab) => {
      if (url && currentTab) {
        chrome.tabs?.update(currentTab?.id, { url });
      }
    });

    this.currentTabUrl.set(url);

    if (closePopup) {
      // window.close();
    }
  }

  public getCurrentTab(): Promise<chrome.tabs.Tab> {
    return new Promise((resolve, reject) => {
      // For local development
      if (!chrome.tabs) {
        return resolve({ id: 0, url: window.location.href } as chrome.tabs.Tab);
      }

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        return tabs[0] ? resolve(tabs[0]) : reject();
      });
    });
  }
}
