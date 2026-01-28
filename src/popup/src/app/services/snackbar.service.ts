import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarManager {
  private snackBar: MatSnackBar = inject(MatSnackBar);

  public show(message: string) {
    console.log(message);
    this.snackBar.open(message, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
    });
  }
}
