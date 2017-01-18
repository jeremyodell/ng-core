import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'core-js/client/shim';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'ts-helpers';

// Angular 2
import { enableProdMode } from '@angular/core';
import { UniversalModule, platformUniversalDynamic } from 'angular2-universal/browser';

import { setUniversalModule } from './ng-module';
import { BizConfig } from './config';

setUniversalModule(UniversalModule);

export class BizClient {

  // ========================================
  // constructor
  // ========================================

  public constructor(private config: BizConfig) {}

  // ========================================
  // public methods
  // ========================================

  public bootstrap(appModule?: any): BizClient {

    if (!appModule) {
      appModule = this.config.apps['root'];
    }

    if (process.env.ENV === 'production') {
      enableProdMode();
    }

    const platformRef = platformUniversalDynamic();

    document.addEventListener('DOMContentLoaded', () => {
      platformRef.bootstrapModule(appModule);
    });

    return this;
  }
}
