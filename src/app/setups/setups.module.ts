import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { setupRoutingModule } from './setupRouting.module';
import { MainInsuranceSetupComponent } from './InsuranceSetup/insurance-setup.component';
import { InsuranceSetupComponent } from './InsuranceSetup/insurance-setup/insurance-setup.component';
import { AddEditInsSetupComponent } from './InsuranceSetup/insurance-setup/add-edit-ins-setup/add-edit-ins-setup.component';
import { InsSetupDetailComponent } from './InsuranceSetup/insurance-setup/ins-setup-detail/ins-setup-detail.component';
import { ListInsSetupComponent } from './InsuranceSetup/insurance-setup/list-ins-setup/list-ins-setup.component';
import { InsuranceSetupGroupComponent } from './InsuranceSetup/insurance-setup-group/insurance-setup-group.component';
import { AddEditInsGroupSetupComponent } from './InsuranceSetup/insurance-setup-group/add-edit-ins-group-setup/add-edit-ins-group-setup.component';
import { InsGroupSetupDetailsComponent } from './InsuranceSetup/insurance-setup-group/ins-group-setup-details/ins-group-setup-details.component';
import { ListInsGroupSetupComponent } from './InsuranceSetup/insurance-setup-group/list-ins-group-setup/list-ins-group-setup.component';
import { InsuranceSetupNameComponent } from './InsuranceSetup/insurance-setup-name/insurance-setup-name.component';
import { AddEditInsNameSetupComponent } from './InsuranceSetup/insurance-setup-name/add-edit-ins-name-setup/add-edit-ins-name-setup.component';
import { InsNameSetupDetailsComponent } from './InsuranceSetup/insurance-setup-name/ins-name-setup-details/ins-name-setup-details.component';
import { ListInsNameSetupComponent } from './InsuranceSetup/insurance-setup-name/list-ins-name-setup/list-ins-name-setup.component';
import { InsuranceSetupPayerComponent } from './InsuranceSetup/insurance-setup-payer/insurance-setup-payer.component';
import { AddEditInsSetupPayerComponent } from './InsuranceSetup/insurance-setup-payer/add-edit-ins-setup-payer/add-edit-ins-setup-payer.component';
import { InsSetupPayerDetailComponent } from './InsuranceSetup/insurance-setup-payer/ins-setup-payer-detail/ins-setup-payer-detail.component';

@NgModule({
  declarations: [
    MainInsuranceSetupComponent,
    InsuranceSetupComponent,
    AddEditInsSetupComponent,
    InsSetupDetailComponent,
    ListInsSetupComponent,
    InsuranceSetupGroupComponent,
    AddEditInsGroupSetupComponent,
    InsGroupSetupDetailsComponent,
    ListInsGroupSetupComponent,
    InsuranceSetupNameComponent,
    AddEditInsNameSetupComponent,
    InsNameSetupDetailsComponent,
    ListInsNameSetupComponent,
    InsuranceSetupPayerComponent,
    AddEditInsSetupPayerComponent,
    InsSetupPayerDetailComponent
  ],
  imports: [
    SharedModule,
    setupRoutingModule
  ]
})
export class SetupsModule { }
