import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { dxRoutingModule } from './dxRouting.module';
import {DXComponent} from './dx.component'

@NgModule({
  declarations: [
    DXComponent
  ],
  imports: [
    SharedModule,
    dxRoutingModule,
  ]
})
export class dxModule { }
