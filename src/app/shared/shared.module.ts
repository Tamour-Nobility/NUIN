import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { MyDatePickerModule } from 'mydatepicker';
import { DataTablesModule } from 'angular-datatables';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PopoverModule } from 'ngx-popover';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrModule } from 'ngx-toastr';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxPrintModule } from 'ngx-print';
import { ChartsModule } from 'ng2-charts';

import { ChangePracticeComponent } from './change-practice/change-practice.component';
import { PracFacilitiesComponent } from '../practice-setup/Facilities/facilities.component';
import { FacilitiesComponent } from '../setups/Facility/facilities.component';
import { ListInsSetupPayerComponent } from '../setups/InsuranceSetup/insurance-setup-payer/list-ins-setup-payer/list-ins-setup-payer.component';
import { ProviderCptPlanNotesComponent } from './provider-cpt-plan-notes/provider-cpt-plan-notes.component';
import { ListGuarantorsSharedComponent } from './guarantors/list-guarantors-shared/list-guarantors-shared.component';
import { AddEditGuarantorSharedComponent } from './guarantors/add-edit-guarantor-shared/add-edit-guarantor-shared.component';
import { InsuranceSearchComponent } from './insurance-search/insurance-search.component';

import { ModalWindow } from './modal-window/modal-window.component';
import { NoCommaPipe } from '../pipes/noComma.pipe';
import { ShortStringPipe } from '../pipes/shortString.pipe';
import { NoSpace } from '../directives/noSpace.directive';
import { ICheckDirective } from '../directives/icheck.directive';
import { onlyNumbers } from '../directives/onlyNumbers.directive';
import { onlyAlphabets } from '../directives/onlyAlphabets.directive';
import { AlphabetsWithSpace } from '../directives/alphabetsWithSpace.directive';
import { GuarantorComponent } from '../setups/Guarantor/guarantor.component';
import { NullDefaultValueDirective } from '../directives/nullDefaultValue.directive';
import { CountDownPipe } from '../pipes/countdown.pipe';
import { AutoFocus } from '../directives/autofocus.directive';

import { ColorPickerComponent } from './color-picker/color-picker.component';
import { PatientAttachmentsComponent } from './patient-attachments/patient-attachments.component';
import { PatientStatementClaimsComponent } from '../claim-submission/patient-statement-main/patient-statement-claims/patient-statement.claims.component';
import { PracTabInsuranceSearchComponent } from './prac-tab-insurance-search copy/prac-tab-insurance-search.component';

@NgModule({
  declarations: [
    // components
    ChangePracticeComponent,
    PracFacilitiesComponent,
  
    ListInsSetupPayerComponent,
    FacilitiesComponent,
    ProviderCptPlanNotesComponent,
    ListGuarantorsSharedComponent,
    AddEditGuarantorSharedComponent,
    GuarantorComponent,
    ModalWindow,
    InsuranceSearchComponent,
    PracTabInsuranceSearchComponent ,
    // directives and pipes etc
    ICheckDirective,
    ShortStringPipe,
    NoSpace,
    NoCommaPipe,
    onlyNumbers,
    onlyAlphabets,
    AlphabetsWithSpace,
    NullDefaultValueDirective,
    CountDownPipe,
    AutoFocus,
    ColorPickerComponent,
    PatientAttachmentsComponent,
    PatientStatementClaimsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MyDatePickerModule,
    MyDateRangePickerModule,
    DataTablesModule,
    NgxMaskModule.forRoot(),
    NgxSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
    AngularMultiSelectModule,
    PopoverModule,
    NgxPaginationModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    ToastrModule.forRoot({
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true
    }),
    ColorPickerModule,
    NgxPrintModule,
    ChartsModule,
    NgbModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MyDatePickerModule,
    MyDateRangePickerModule,
    DataTablesModule,
    NoCommaPipe,
    NgxMaskModule,
    NgxSelectModule,
    NgMultiSelectDropDownModule,
    PopoverModule,
    ShortStringPipe,
    NgxPaginationModule,
    ModalModule,
    TooltipModule,
    onlyNumbers,
    onlyAlphabets,
    AlphabetsWithSpace,
    NullDefaultValueDirective,
    ToastrModule,
    ColorPickerModule,
    ModalWindow,
    CountDownPipe,
    AutoFocus,
    AngularMultiSelectModule,
    ChangePracticeComponent,
    PracFacilitiesComponent,
    FacilitiesComponent,
    ListInsSetupPayerComponent,
    ProviderCptPlanNotesComponent,
    ListGuarantorsSharedComponent,
 
    GuarantorComponent,
    InsuranceSearchComponent,
    PracTabInsuranceSearchComponent,
    AddEditGuarantorSharedComponent,
    ColorPickerComponent,
    NgxPrintModule,
    ChartsModule,
    PatientAttachmentsComponent,
    PatientStatementClaimsComponent,
    NgbModule
  ]
})
export class SharedModule { }