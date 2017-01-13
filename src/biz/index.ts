import { NgModule } from '@angular/core';

import { BizConfig } from './config';
import { BizFramer } from './framer';
import { BizFramerConfig } from './framer-config';
import { BizNgModule } from './ng-module';

export {
  BizConfig,
  BizFramer,
  BizFramerConfig,
  BizNgModule,
};

export class Biz {
  static ngModule(ngModule?: NgModule): BizNgModule {
    return new BizNgModule(ngModule);
  }
}

export const biz = Biz;
