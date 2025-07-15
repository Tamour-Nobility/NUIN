import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentScrubberComponent } from './component-scrubber/component-scrubber.component';
import { ClaimsSubmissionClaimsComponent } from './claims-submission-claims/claims-submission-claims.component';
import { ClaimSubmissionErrorsComponent } from './claim-submission-errors/claim-submission-errors.component';
import { BatchSubmissionResponseComponent } from './batch-submission-response/batch-submission-response.component';
import { ClaimSubmissionComponent } from './claim-submission.component';
import { PatientStatementComponent } from './patient-statement-main/patient-statement/patient-statement.component';
import { ClaimRejectionComponent } from './patient-statement-main/claim-rejection/claim-rejection.component';



const routes: Routes = [
  {
    path: '',
    component: ClaimSubmissionComponent, children: [
      {

        path:'scrubber/:type',
        component:ComponentScrubberComponent
      },
      {
        path: 'claims',
        component: ClaimsSubmissionClaimsComponent
      },
      {

        path: 'errors',
        component: ClaimSubmissionErrorsComponent
      },
      {
        path: 'claims',
        component: ClaimsSubmissionClaimsComponent
      },
    
      {
        path: 'batchResponse',
        component: BatchSubmissionResponseComponent
      },
      {
        path: 'patientStatement',
        component: PatientStatementComponent
      },
      {
        path: 'Claimrejection',
        component: ClaimRejectionComponent
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimSubmissionRoutingModuleModule { 
  
}
