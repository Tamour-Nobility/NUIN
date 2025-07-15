import { NgModule } from '@angular/core';
import { EdiSetupMainComponent } from './edi-setup-main.component';
import { SharedModule } from '../shared/shared.module';
import { edisetupRoutingModule } from './edisetupRouting.module';

@NgModule({
  declarations: [
    EdiSetupMainComponent
  ],
  imports: [
    SharedModule,
    edisetupRoutingModule
  ]
})
export class EDISetupModule { }
