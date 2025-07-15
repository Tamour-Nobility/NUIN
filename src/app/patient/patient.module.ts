import { NgModule } from '@angular/core';
import { PatientComponent } from '../patient/patient.component';
import { ReferralComponent } from './Referrals/referral.component';
import { PatientSearchComponent } from './search/patient-search.component';
import { NotesComponent } from './Patient/Notes/notes.component';
import { SharedModule } from '../shared/shared.module';
import { PatientRoutingModule } from './patient-routing.module';
import { PatientNotesComponent } from './Patient/patient-notes/patient-notes.component';
import { AccountassignmentComponent } from './accountassignment/accountassignment.component';
import { AlertAssignmentComponent } from './alerts/alert.component';
import { DatePipe } from '@angular/common';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';



@NgModule({
  declarations: [
    PatientComponent,
    ReferralComponent,
    PatientSearchComponent,
    NotesComponent,
    PatientNotesComponent,
    AccountassignmentComponent,
    AlertAssignmentComponent,
  ],

  imports: [
    SharedModule,
    PatientRoutingModule,
    ModalModule.forRoot(),
  ],
  providers: [
    DatePipe,
    BsModalService
  ],
  exports: [
    PatientSearchComponent
  ]
})
export class PatientModule { }
