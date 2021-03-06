import * as ng2 from '@angular/core';
import { Provider } from '@angular/core';

import { BizFramerConfig } from './framer-config';
import { BizNgModule } from './ng-module';

export abstract class BizFramer<C> {

  public helper: any;

  public parent: BizFramer<any>;

  public sharedModule: any;

  public sharedInstanceModule: any;

  // ========================================
  // constructor
  // ========================================

  public constructor(public config?: C & BizFramerConfig<any>) {
    this.sharedModule = ng2.NgModule({}).Class({ constructor: () => {} });
    this.sharedInstanceModule = ng2.NgModule({}).Class({ constructor: () => {} });

    if (config && config.helper) {
      this.helper = new config.helper(); // (FIXME: Need to use Injector)
    }
  }

  // ========================================
  // public methods
  // ========================================

  public defaultConfig?(): C {
    return null;
  }

  /* tslint:disable:no-empty */
  public frame(bizNgModule: BizNgModule): void {}
  /* tslint:enable:no-empty */
}
