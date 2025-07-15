import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProceduresComponent } from './procedures.component';
import { ListProceduresComponent } from './list-procedures/list-procedures.component';
import { AddEditProcedureComponent } from './add-edit-procedure/add-edit-procedure.component';



const routes: Routes = [
    
    
    {
        path: '',
        component: ProceduresComponent,
        children: [
            { path: '', component: ListProceduresComponent, pathMatch: 'full' },
            { path: 'list', component: ListProceduresComponent },
            { path: 'add', component: AddEditProcedureComponent },
            { path: 'edit/:id/:Desc', component: AddEditProcedureComponent }

        ]
    },
  
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class proceduresRoutingModule { }
