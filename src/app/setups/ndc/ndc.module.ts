import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ndcRoutingModule } from './ndc-routing.module';
import {NdcComponent} from './ndc.component'

@NgModule({
  declarations: [
    NdcComponent
  ],
  imports: [
    SharedModule,
    ndcRoutingModule,
  ]
})
export class ndcModule { }
