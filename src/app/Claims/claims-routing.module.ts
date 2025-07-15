import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiagnosisComponent } from './Diagnosis/diagnosis.component';
import { ClaimsComponent } from './claims.component';
import { PatientComponent } from '../patient/patient.component';
import { ClaimSummaryComponent } from '../patient/ClaimSummary/claim-summary.component';
import { AppoinmentsComponent } from '../patient/appoinments/appoinments.component';
import { MainComponent } from '../patient/Main/main.component';

const routes: Routes = [
  {
    path: 'Diagnosis', component: DiagnosisComponent
  },
  {
    path: '', component: MainComponent, children: [
      { path: ':param', component: PatientComponent },
      { path: 'ClaimDetail/:param', component: ClaimsComponent },
      { path: 'Detail/:param', component: PatientComponent },
      { path: 'New/:param', component: PatientComponent },
      { path: 'Edit/:param', component: PatientComponent },
      { path: 'ClaimSummary/:param', component: ClaimSummaryComponent },
      { path: 'Appoinments/:param', component: AppoinmentsComponent }

    ]
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimsRoutingModule { }