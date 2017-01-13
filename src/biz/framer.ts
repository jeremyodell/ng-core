import { BizFramerConfig } from './framer-config';
import { BizNgModule } from './ng-module';

export class BizFramer<C> {

  // ========================================
  // constructor
  // ========================================

  public constructor(public config?: C & BizFramerConfig<any>) {}

  // ========================================
  // public methods
  // ========================================

  /* tslint:disable:no-empty */
  public frame(bizNgModule: BizNgModule): void {}
  /* tslint:enable:no-empty */
}
