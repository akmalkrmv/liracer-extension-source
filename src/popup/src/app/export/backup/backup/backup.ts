import { DatePipe } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { DownloadService } from '../../../services/download.service';
import { IStorageAdapter, STORAGE_ADAPTER } from '../../../services/storage';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-backup',
  imports: [MatIconModule],
  templateUrl: './backup.html',
  styleUrl: './backup.css',
})
export class Backup {
  private readonly datePipe: DatePipe = inject(DatePipe);
  private readonly storage: IStorageAdapter = inject(STORAGE_ADAPTER);
  private readonly download: DownloadService = inject(DownloadService);

  protected readonly exportStatus: WritableSignal<string | null> = signal(null); // To store export status message
  protected readonly importStatus: WritableSignal<string | null> = signal(null); // To store import status message
  protected readonly isExporting: WritableSignal<boolean> = signal(false);
  protected readonly isImporting: WritableSignal<boolean> = signal(false);

  async exportData(): Promise<void> {
    this.isExporting.set(true);
    this.exportStatus.set('Exporting..');

    const content: Record<string, unknown> = await this.storage.getAll();
    const today: string | null = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const filename: string = `LiRace-Backup-${today}.json`;

    this.download.downloadAsJsonFile(content, filename);

    this.isExporting.set(false);
    this.exportStatus.set('Data exported successfully!');
  }

  importData(): void {
    // Create a file input element to allow the user to select a file
    const fileInput: HTMLInputElement = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json'; // Only allow JSON files

    // Listen for when the user selects a file
    fileInput.addEventListener('change', (event): void => {
      const file: File | undefined = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Read the file as text
      const reader: FileReader = new FileReader();
      reader.onload = (): void => {
        try {
          // Parse the JSON content
          const data: Record<string, unknown> = JSON.parse(reader.result as string);

          // Store the data in storage
          this.storage.set(data).then((): void => {
            console.log('Data imported successfully!', data);
            this.importStatus.set('Data imported successfully!');
          });
        } catch (error: unknown) {
          console.error('Error parsing JSON:', error);
          this.importStatus.set('Error parsing JSON.');
        }
      };

      reader.onerror = (error: unknown): void => {
        console.error('File read error:', error);
        this.importStatus.set('File to read file.');
      };

      // Read the file
      reader.readAsText(file);
    });

    // Trigger the file input dialog
    fileInput.click();
  }
}
