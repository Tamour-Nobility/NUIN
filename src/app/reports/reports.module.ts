import { NgModule } from '@angular/core';
import { AgingSummaryPatientWiseComponent } from './aging-summary-patient-wise/aging-summary-patient-wise.component';
import { AgingSummaryReportComponent } from './aging-summary-report/aging-summary-report.component';
import { FinancialSummaryCPTWiseComponent } from './financial-summary-cptwise/financial-summary-cptwise.component';
import { FinancialSummaryProviderWiseComponent } from './financial-summary-provider-wise/financial-summary-provider-wise.component';
import { MainReportsComponent } from './main-reports.component';
import { SharedModule } from '../shared/shared.module';
import { reportRoutingModule } from './reportsRouting.module';
import { RecallVisits } from './recall-visits/recall-visits.component';
import { PracticeAnalysisComponent } from './practice-analysis/practice-analysis.component';
import { PracticeAnalysisByProviderComponent } from './practice-analysis-by-provider/practice-analysis-by-provider.component';
import { PatientBirthDays } from './patient-birth-days/patient-birth-days.component';
import { PaymentDetail } from './payment-detail/payment-detail.component'
import { CtpWisePaymentDetailsComponent } from './ctp-wise-payment-details/ctp-wise-payment-details/ctp-wise-payment-details.component';
import { AppointmentDetailComponent } from './appointment-detail/appointment-detail.component';
import { MissingAppointmentDetailComponent } from './missing-appointment-detail/missing-appointment-detail/missing-appointment-detail.component';
import { ClaimPaymentReportComponent } from './claim-payment-report/claim-payment-report/claim-payment-report.component';
import { InsuranceDetailReportComponent } from './Insurance-Detail-Report/insurance-detail-report/insurance-detail-report.component';
import { HoldclaimsComponent } from './holdclaims/holdclaims.component';

import { ClaimAssignmentreportComponent } from './claim-assignmentreport/claim-assignmentreport.component';
import { AccountAssignmentreportComponent } from './account-assignmentreport/account-assignmentreport.component';
import { ScrubberRejectionReportComponent } from './scrubber-rejection-report/scrubber-rejection-report.component';
import { ClaimSubmissionReportComponent  } from './claim-submission-report/claim-submission-report.component';

import { UserReportComponent } from './user-report/user-report.component';
import { RollingsummaryreportComponent } from './rollingsummaryreport/rollingsummaryreport.component';
import { PatientStatementReportComponent } from './patient-statement-report/patient-statement-report.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FilterPipe } from '../pipes/filter.pipe';
import { PatientAgingReportComponent } from './patient-aging-report/patient-aging-report.component';
import { CollectionAnalysisReportComponent } from './collection-analysis-report/collection-analysis-report.component';
import { PatientAgingAnalysisComponent } from './patient-aging-analysis/patient-aging-analysis.component';
import { VisitClaimActivityReportComponent } from './visit-claim-activity-report/visit-claim-activity-report.component';
import { ChargesBreakDownReportComponent } from './charges-break-down-report/charges-break-down-report.component';
import { PendingBatchReportComponent } from './pending-batch-report/pending-batch-report.component';
import { DenialReportComponent } from './denial-report/denial-report.component';
import { NegativeBalanceReportComponent } from './negative-balance-report/negative-balance-report.component';
import { CreditBalanceReportComponent } from './credit-balance-report/credit-balance-report.component';
import { EshaPatientAgingReportComponent } from './esha-patient-aging-report/esha-patient-aging-report.component';
import { EshaPlanAgingReportComponent } from './esha-plan-aging-report/esha-plan-aging-report.component';
import { UnpostedAdjustmentReportComponent } from './unposted-adjustment-report/unposted-adjustment-report.component';


@NgModule({
  declarations: [
    AgingSummaryPatientWiseComponent,
    AgingSummaryReportComponent,
    FinancialSummaryCPTWiseComponent,
    FinancialSummaryProviderWiseComponent,
    MainReportsComponent,
    RecallVisits,
    PracticeAnalysisComponent,
    PracticeAnalysisByProviderComponent,
    PatientBirthDays,
    PaymentDetail,
    CtpWisePaymentDetailsComponent,
    AppointmentDetailComponent,
    MissingAppointmentDetailComponent,
    ClaimPaymentReportComponent,
    InsuranceDetailReportComponent,
    HoldclaimsComponent,
    FilterPipe,
    ClaimAssignmentreportComponent,
    AccountAssignmentreportComponent,

    UserReportComponent,
    ScrubberRejectionReportComponent,
    RollingsummaryreportComponent,
    ClaimSubmissionReportComponent,
    PatientStatementReportComponent,
    PatientAgingReportComponent,
    CollectionAnalysisReportComponent,
    PatientAgingAnalysisComponent,
   VisitClaimActivityReportComponent,
   ChargesBreakDownReportComponent,
   PendingBatchReportComponent,
   DenialReportComponent,
   NegativeBalanceReportComponent,
   CreditBalanceReportComponent,
   EshaPatientAgingReportComponent,
   EshaPlanAgingReportComponent,
   UnpostedAdjustmentReportComponent
  ],
  imports: [
    SharedModule,
    Ng2SearchPipeModule,
    reportRoutingModule
  ]
})
export class ReportsModule { }
