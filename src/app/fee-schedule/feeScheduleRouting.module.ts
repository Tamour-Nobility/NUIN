
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeeScheduleMainComponent } from './fee-schedule-main.component';
import { StandardCPTFeeScheduleComponent } from './standard-cptfee-schedule/standard-cptfee-schedule.component';
import { NobilityCPTFeeScheduleComponent } from './nobility-cptfee-schedule/nobility-cptfee-schedule.component';
import { ProviderCptfeeScheduleTempComponent } from './provider-cptfee-schedule-temp/provider-cptfee-schedule-temp.component';
import { PanelBillingComponent } from './panel-billing/panel-billing.component';
import { AddEditPanelCodeComponent } from './add-edit-panel-code/add-edit-panel-code.component';




const routes: Routes = [
    {
        path: '',
        component: FeeScheduleMainComponent ,
        children: [
            { path: 'Standard', component: StandardCPTFeeScheduleComponent },
            { path: 'NobilityCPT', component: NobilityCPTFeeScheduleComponent },
            { path: 'ProviderCPT', component: ProviderCptfeeScheduleTempComponent },
            { path: 'PanelBilling', component: PanelBillingComponent },  
           
        

        
       
        ],
        
    },
    { path: 'AddEditPanelCode', component: AddEditPanelCodeComponent } ,
    {
        path: 'add-edit-panel-code/:id', // Add the ID as a route parameter
        component: AddEditPanelCodeComponent,
      },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class feeScheduleRoutingModule { }