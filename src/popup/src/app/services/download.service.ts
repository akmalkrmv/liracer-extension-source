import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DownloadService {
  public downloadAsJsonFile(content: Record<string, unknown>, filename: string): void {
    const jsonContent: string = JSON.stringify(content, null, 2);
    this.downloadAsTextFile(jsonContent, filename, 'application/json');
  }
  
  public downloadAsTextFile(content: string, filename: string, type: string = 'text/plain'): void {
    const blob: Blob = new Blob([content], { type });
    const url: string = URL.createObjectURL(blob);

    if (chrome.downloads) {
      chrome.downloads.download({ url, filename, saveAs: true });
    } else {
      // Fallback for non-Chrome environments
      const a: HTMLAnchorElement = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }
}
