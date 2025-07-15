import { NgModule } from '@angular/core';
import { DespositSlipComponent } from './desposit-slip.component';
import { SharedModule } from '../shared/shared.module';
import { depositeSlipRoutingModule } from './depositeSlipRouting.module';

@NgModule({
  declarations: [DespositSlipComponent],
  imports: [
    SharedModule,
    depositeSlipRoutingModule
  ]
})
export class DepositeSlipModule { }
