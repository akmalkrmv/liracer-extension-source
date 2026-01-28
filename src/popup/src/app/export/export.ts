import { Component } from '@angular/core';
import { PuzzleExport } from './puzzle-export/puzzle-export';
import { Backup } from './backup/backup/backup';

@Component({
  selector: 'app-export',
  imports: [PuzzleExport, Backup],
  template: `
    <app-backup />
    <app-puzzle-export />
  `,
})
export class Export {}
