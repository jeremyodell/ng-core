import { BizNgModule } from './ng-module';
import { BizFramerConfig } from './framer-config';

export class BizFramer<C> {

  // ========================================
  // constructor
  // ========================================

  public constructor(public config?: C & BizFramerConfig<any>) {}

  // ========================================
  // public methods
  // ========================================

  public frame(bizNgModule: BizNgModule): void {
  }
}