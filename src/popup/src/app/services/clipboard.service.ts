import { inject, Injectable } from '@angular/core';
import { SnackbarManager } from './snackbar.service';

@Injectable({ providedIn: 'root' })
export class ClipboardService {
  private snackBar: SnackbarManager = inject(SnackbarManager);

  public async copy(text: string, successMessage: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.snackBar.show(successMessage);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      this.snackBar.show('Failed to copy');
    }
  }
}
