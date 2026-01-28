import { Component, inject, model, ModelSignal, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { STORAGE_KEYS } from '@extension/shared/consts';
import { NavigationSection } from '../models/navigation-section.model';
import { IStorageAdapter, STORAGE_ADAPTER } from '../services/storage';

type NavigationTab = {
  section: NavigationSection;
  icon: string;
  label: string;
};

const NAVIGATION_TABS: NavigationTab[] = [
  { section: 'racer', icon: 'sports_score', label: 'Races' },
  { section: 'storm', icon: 'tornado', label: 'Storms' },
  { section: 'stats', icon: 'bar_chart_4_bars', label: 'Stats' },
  { section: 'export', icon: 'content_paste', label: 'Export' },
  { section: 'settings', icon: 'settings', label: '' },
];

@Component({
  selector: 'app-navigation',
  imports: [MatTabsModule, MatIconModule],
  templateUrl: 'navigation.html',
  styles: ``,
})
export class Navigation implements OnInit {
  private readonly storage: IStorageAdapter = inject(STORAGE_ADAPTER);

  public readonly selected: ModelSignal<NavigationSection> = model.required();
  public readonly tabs: NavigationTab[] = NAVIGATION_TABS;

  ngOnInit(): void {
    this.restoreTab();
  }

  selectTab(item: NavigationTab) {
    this.selected.set(item.section);
    this.storage.set({ currentTab: item.section });
  }

  private async restoreTab(): Promise<void> {
    const { currentTab } = await this.storage.get(STORAGE_KEYS.CURRENT_TAB);
    console.log('[Navigation] currentTab', currentTab);

    if (this.isValidTab(currentTab)) {
      this.selected.set(currentTab);
    }
  }

  private isValidTab(tab: NavigationSection | string | undefined): tab is NavigationSection {
    return !!tab && this.tabs.some((section: NavigationTab) => section.section === tab);
  }
}
