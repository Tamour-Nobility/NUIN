import { NgModule } from '@angular/core';
import { GuarantorRoutingModule } from './guarantors-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { GuarantorsListComponent } from './guarantors-list/guarantors-list.component';
import { GuarantorsAddEditComponent } from './guarantors-add-edit/guarantors-add-edit.component';

@NgModule({
  declarations: [
    GuarantorsListComponent,
    GuarantorsAddEditComponent
  ],
  imports: [
    GuarantorRoutingModule,
    SharedModule
  ]
})
export class GuarantorsModule { }
