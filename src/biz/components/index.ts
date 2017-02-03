import { NgModule } from '@angular/core';

import { BizContainerComponent } from './biz-container.component';
import { BizRootComponent } from './biz-root.component';

export {
  BizContainerComponent,
  BizRootComponent,
};

@NgModule({
  declarations: [
    BizContainerComponent,
  ],
  exports: [
    BizContainerComponent,
  ],
})
export class BizComponentsModule {}
