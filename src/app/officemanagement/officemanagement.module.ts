import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { officeManagementRoutingModule } from './officeManagementRouting.module';
import { OfficemanagementComponent } from './officemanagement.component';

@NgModule({
  declarations: [
    OfficemanagementComponent
  ],
  imports: [
    SharedModule,
    officeManagementRoutingModule

  ]
})
export class OfficemanagementModule { }
