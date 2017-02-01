import { NgModule } from '@angular/core';

import { BizConfig } from './config';
import { BizFramer } from './framer';
import { BizFramerConfig } from './framer-config';
import { BizNgModule } from './ng-module';
import { BizTree, Tree, TreeModule } from './tree';

export {
  BizConfig,
  BizFramer,
  BizFramerConfig,
  BizNgModule,
  BizTree,
  Tree,
  TreeModule
};

export class Biz {
  static _tree: Tree;

  static ngModule(ngModule?: NgModule): BizNgModule {
    return new BizNgModule(ngModule);
  }

  static tree(): BizTree {
    return new BizTree(Biz._tree);
  }

  static setTree(tree: Tree): void {
    Biz._tree = tree;
  }
}

export const biz = Biz;
