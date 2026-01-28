import { Component, WritableSignal, signal } from '@angular/core';

@Component({
  selector: 'app-version',
  template: `Version: <span id="version">{{ version() }}</span>`,
})
export class Version {
  protected readonly version: WritableSignal<string> = signal('');

  ngOnInit(): void {
    const manifest = chrome.runtime?.getManifest?.() || { version: '0.0.0' };
    this.version.set(manifest.version);
  }
}
