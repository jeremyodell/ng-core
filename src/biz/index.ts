import { NgModule } from '@angular/core';

import { BizConfig } from './config';
import { BizNgModule } from './ng-module';
import { BizFramer } from './framer';
import { BizFramerConfig } from './framer-config';

export {
  BizConfig,
  BizNgModule,
  BizFramer,
  BizFramerConfig
};

export class Biz {
  static ngModule(ngModule?: NgModule): BizNgModule {
    return new BizNgModule(ngModule);
  }
}

export const biz = Biz;