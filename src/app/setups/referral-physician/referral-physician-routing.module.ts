import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferralPhysicianComponent } from './referral-physician.component';
import { AddEditReferralPhysicianComponent } from './add-edit-referral-physician/add-edit-referral-physician.component';

const routes: Routes = [

    { path: '', component: ReferralPhysicianComponent},
    { path: ':id/:type', component: AddEditReferralPhysicianComponent},
    
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]

})
export class ReferralPhysiciansRoutingModule { }