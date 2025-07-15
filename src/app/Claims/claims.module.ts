import { NgModule } from '@angular/core';
import { ClaimAttachmentsComponent } from './Attachments/claim-attachments.component';
import { ClaimNotesComponent } from './claimNotes/claim-notes.component';
import { DiagnosisComponent } from './Diagnosis/diagnosis.component';
import { ClaimInsurancesComponent } from './Insurances/claim-insurances.component';
import { MainComponent } from '../patient/Main/main.component';
import { PaymentsComponent } from './Payments/payments.component';
import { ClaimsComponent } from './claims.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../shared/shared.module';
import { ClaimsRoutingModule } from './claims-routing.module';
import { ClaimSummaryComponent } from '../patient/ClaimSummary/claim-summary.component';
import { AppoinmentsComponent } from '../patient/appoinments/appoinments.component';
import { PatientModule } from '../patient/patient.module';
import { ClaimsAssignmentComponent } from './claims-assignment/claims-assignment.component';
import { DatePipe } from '@angular/common';
import { UB04Component } from './ub04/ub04.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ClaimAttachmentsComponent,
    ClaimNotesComponent,
    DiagnosisComponent,
    UB04Component,
    ClaimInsurancesComponent,
    MainComponent,
    PaymentsComponent,
    ClaimsComponent,
    ClaimSummaryComponent,
    AppoinmentsComponent,
    ClaimsAssignmentComponent
  ],
  imports: [
    SharedModule,
    DragDropModule,
    ClaimsRoutingModule,
    PatientModule,
    FormsModule
  ],
    providers: [DatePipe],


  exports: [
    PaymentsComponent
  ]
})
export class ClaimsModule { }
