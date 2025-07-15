import { NgModule } from '@angular/core';
import { AddEditProcedureComponent } from './add-edit-procedure/add-edit-procedure.component';
import { ListProceduresComponent } from './list-procedures/list-procedures.component';
import { ProceduresComponent } from './procedures.component';
import { SharedModule } from '../../shared/shared.module';
import { proceduresRoutingModule } from '../Procedures/proceduresRouting.module';

@NgModule({
  declarations: [
    AddEditProcedureComponent,
    ListProceduresComponent,
    ProceduresComponent
  ],
  imports: [
    SharedModule,
    proceduresRoutingModule
  ]
})
export class proceduresModule { }
