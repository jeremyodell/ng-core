import { Injector, NgModule, Type } from '@angular/core';
import { Provider } from '@angular/core';

import { Biz } from '.';
import { BizFramerConfig } from './framer-config';
import { BizNgModule } from './ng-module';

export abstract class BizFramer<C, H> {

  public config: C;

  public helperService: H;

  public framerService: any;

  public parent: BizFramer<any, any>;

  public framingModule: any;

  // ========================================
  // constructor
  // ========================================

  public constructor(
    config?: C & BizFramerConfig<H>,
    public framerServiceType?: Type<any>,
  ) {
    this.config = config;

    const self = this;

    @NgModule(Biz
      .ngModule()
      .frame())
    class FramingModule {
      constructor(private injector: Injector) {
        console.log('constructing FramingModule for', self);
        if (config && config.helperService) {
          self.helperService = this.injector.get(config.helperService); // bootstrap the helper service
          console.log('bootstraping HelperService', self.helperService);
        }
        if (self.framerServiceType) {
          self.framerService = this.injector.get(self.framerServiceType); // bootstrap the framer service
          console.log('bootstraping FramerService', self.framerService);
        }
        console.log('framer now looks like this:', self);
      }
    }

    this.framingModule = FramingModule;
  }

  // ========================================
  // public methods
  // ========================================

  public defaultConfig?(): C {
    return null;
  }

  public frame(bizNgModule: BizNgModule): void {}
}
