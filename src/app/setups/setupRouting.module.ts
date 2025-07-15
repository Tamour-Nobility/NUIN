import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainInsuranceSetupComponent } from './InsuranceSetup/insurance-setup.component';
import { InsuranceSetupGroupComponent } from './InsuranceSetup/insurance-setup-group/insurance-setup-group.component';
import { AddEditInsGroupSetupComponent } from './InsuranceSetup/insurance-setup-group/add-edit-ins-group-setup/add-edit-ins-group-setup.component';
import { InsGroupSetupDetailsComponent } from './InsuranceSetup/insurance-setup-group/ins-group-setup-details/ins-group-setup-details.component';
import { InsuranceSetupNameComponent } from './InsuranceSetup/insurance-setup-name/insurance-setup-name.component';
import { AddEditInsNameSetupComponent } from './InsuranceSetup/insurance-setup-name/add-edit-ins-name-setup/add-edit-ins-name-setup.component';
import { InsNameSetupDetailsComponent } from './InsuranceSetup/insurance-setup-name/ins-name-setup-details/ins-name-setup-details.component';
import { InsuranceSetupPayerComponent } from './InsuranceSetup/insurance-setup-payer/insurance-setup-payer.component';
import { AddEditInsSetupPayerComponent } from './InsuranceSetup/insurance-setup-payer/add-edit-ins-setup-payer/add-edit-ins-setup-payer.component';
import { InsSetupPayerDetailComponent } from './InsuranceSetup/insurance-setup-payer/ins-setup-payer-detail/ins-setup-payer-detail.component';
import { InsuranceSetupComponent } from './InsuranceSetup/insurance-setup/insurance-setup.component';
import { AddEditInsSetupComponent } from './InsuranceSetup/insurance-setup/add-edit-ins-setup/add-edit-ins-setup.component';
import { InsSetupDetailComponent } from './InsuranceSetup/insurance-setup/ins-setup-detail/ins-setup-detail.component';




const routes: Routes = [
    {
        path: '',
        component: MainInsuranceSetupComponent,
        children: [
            {
                path: 'insGroup', component: InsuranceSetupGroupComponent, children: [
                    { path: '', redirectTo: 'insGroup', pathMatch: 'full' },
                    { path: 'add', component: AddEditInsGroupSetupComponent },
                    { path: 'edit/:id', component: AddEditInsGroupSetupComponent },
                    { path: 'detail/:id', component: InsGroupSetupDetailsComponent }
                ]
            },
            {
                path: 'insName', component: InsuranceSetupNameComponent, children: [
                    { path: '', redirectTo: 'insName', pathMatch: 'full' },
                    { path: 'add', component: AddEditInsNameSetupComponent },
                    { path: 'edit/:id', component: AddEditInsNameSetupComponent },
                    { path: 'detail/:id', component: InsNameSetupDetailsComponent }
                ]
            },
            {
                path: 'insPayer', component: InsuranceSetupPayerComponent, children: [
                    { path: '', redirectTo: 'insPayer', pathMatch: 'full' },
                    { path: 'add', component: AddEditInsSetupPayerComponent },
                    { path: 'edit/:id', component: AddEditInsSetupPayerComponent },
                    { path: 'detail/:id', component: InsSetupPayerDetailComponent }
                ]
            },
            {
                path: 'insSetup', component: InsuranceSetupComponent, children: [
                    { path: '', redirectTo: 'insSetup', pathMatch: 'full' },
                    { path: 'add', component: AddEditInsSetupComponent },
                    { path: 'edit/:id/:nameId/:payerid', component: AddEditInsSetupComponent },
                    { path: 'detail/:id/:nameId/:payerid', component: AddEditInsSetupComponent }
                ]
            },
           // { path: 'Facility', component: FacilitiesComponent }
        ]
    },
    
    // {
    //     path: 'procedures',
    //     component: ProceduresComponent,
    //     children: [
    //         { path: '', component: ListProceduresComponent, pathMatch: 'full' },
    //         { path: 'list', component: ListProceduresComponent },
    //         { path: 'add', component: AddEditProcedureComponent },
    //         { path: 'edit/:id', component: AddEditProcedureComponent }

    //     ]
    // },
    // {
    //     path: 'guarantor', component: GuarantorComponent
    // }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class setupRoutingModule { }
