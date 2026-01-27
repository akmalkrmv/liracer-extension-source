export interface ISettings {
  theme: 'system' | 'light' | 'dark';
  viewMode: 'popup' | 'panel';
  currentTab: string;

  session: {
    activeTab: string;
    scrollPosition: number;
  };
  racer: {
    showSolvedBadges: boolean;
    showSolvedPuzzles: boolean;
    formatting: {
      date: 'shortDate';
    };
  };
  storm: {
    showSolvedBadges: boolean;
    showSolvedPuzzles: boolean;
    formatting: {
      date: 'shortDate';
    };
  };
}
