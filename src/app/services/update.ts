import { inject, Injectable } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class Update {
  private _sw = inject(SwUpdate);

  constructor() {
    this.listenForUpdates();
  }

  private listenForUpdates() {
    if(!this._sw.isEnabled) {
      console.log('[APP] service worker updates are disabled!!!');
      return;
    }

    this._sw.versionUpdates.subscribe( (event: VersionEvent) => {
      switch (event.type) {
        case 'VERSION_DETECTED':
          console.log('[APP] New version detected. Downloading...');
          break;
        case 'VERSION_READY':
          console.log('[APP] New version ready. reloading now...');
          this.activateUpdate();
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log('[APP] Update failed: ', event.error);
          break;
      }
    });

    setInterval(() => {
      this._sw.checkForUpdate();
    }, 1000 * 60 * 60 * 24);
  }

  private activateUpdate() {
    this._sw.activateUpdate().then(() => document.location.reload()).catch(err => console.error('[APP] Failed to activate update: ', err));
  }
}
