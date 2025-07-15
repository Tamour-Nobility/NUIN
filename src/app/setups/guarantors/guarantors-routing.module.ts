import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuarantorsListComponent } from './guarantors-list/guarantors-list.component';
import { GuarantorsAddEditComponent } from './guarantors-add-edit/guarantors-add-edit.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
    { path: '', component: GuarantorsListComponent },
    { path: 'add', component: GuarantorsAddEditComponent },
    { path: 'edit/:id', component: GuarantorsAddEditComponent },
]
@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule
    ]
})
export class GuarantorRoutingModule { }
