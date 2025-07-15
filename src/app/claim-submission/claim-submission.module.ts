import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ComponentScrubberComponent } from './component-scrubber/component-scrubber.component';
import { BatchSubmissionResponseComponent } from './batch-submission-response/batch-submission-response.component';
import { ClaimSubmissionErrorsComponent } from './claim-submission-errors/claim-submission-errors.component';
import { ClaimsSubmissionClaimsComponent } from './claims-submission-claims/claims-submission-claims.component';
import { ClaimSubmissionComponent } from './claim-submission.component';
import { ClaimSubmissionRoutingModuleModule } from './claim-submission-routing-module.module';
import { PatientStatementComponent } from './patient-statement-main/patient-statement/patient-statement.component';
import { ClaimRejectionComponent } from './patient-statement-main/claim-rejection/claim-rejection.component';


@NgModule({
  declarations: [
    ComponentScrubberComponent,
    BatchSubmissionResponseComponent,
    ClaimSubmissionErrorsComponent,
    ClaimsSubmissionClaimsComponent,
    ClaimSubmissionComponent,
    PatientStatementComponent,
    ClaimRejectionComponent,
    
  ],
  imports: [
    SharedModule,
    ClaimSubmissionRoutingModuleModule
  ],

})

export class ClaimSubmissionModule { }
