import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./auth/Login/login.component";
import { LayoutComponent } from "./core/layout/layout.component";
import { AuthGuard } from "./guards/auth.guard";
import { DashBoardComponent } from "./dashboard/dash-board.component";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorPageComponent } from './core/error-page/error-page.component';
import { EligblityComponent } from "./eligblity/eligblity.component";
import { DashGuard } from './guards/dash.guard';
import { CustomEditsComponent } from "./custom-edits/custom-edits.component";
import { TicketTrackerComponent } from "./ticket-tracker/ticket-tracker.component";
import { CreateTicketComponent } from "./create-ticket/create-ticket.component";
import { TicketResponseComponent } from "./ticket-response/ticket-response.component";


const appRoutes: Routes = [
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    {
        path: '', component: LayoutComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
            { path: '', component: DashBoardComponent, canActivate: [DashGuard] },
            { path: 'eligblity', component: EligblityComponent },
            { path: 'customEdits/:type/:id', component: CustomEditsComponent },
            { path: 'dashboard', component: DashBoardComponent },
            {path: 'ticket-tracker', component : TicketTrackerComponent},
          { path: 'create-ticket', component: CreateTicketComponent },         // for creating new ticket
            { path: 'create-ticket/:id', component: CreateTicketComponent } ,     // for editing ticket
            { path: 'ticketresponse', component: TicketResponseComponent } ,     // for respnse ticket


            { path: 'patient', loadChildren: './patient/patient.module#PatientModule' },
            { path: '', loadChildren: './practice-setup/practice-setup.module#PracticeSetupModule' },
           
            { path: 'claimsubmission', loadChildren: './claim-submission/claim-submission.module#ClaimSubmissionModule' },
            { path: 'users', loadChildren: './user-management/user-management.module#UserManagementModule' },
            { path: 'OfficeMGM', loadChildren: './officemanagement/officemanagement.module#OfficemanagementModule' },
            { path: 'ReportSetup', loadChildren: './reports/reports.module#ReportsModule' },
            { path: 'Tasks', loadChildren: './tasks/tasks.module#TasksModule' },
            { path: 'FeeSchedule', loadChildren: './fee-schedule/fee-schedule.module#FeeScheduleModule' },
            { path: 'EDISetup', loadChildren: './edisetup/edisetup.module#EDISetupModule' },
            { path: 'appointments', loadChildren: './appointment-scheduler/appointment-scheduler.module#AppointmentSchedulerModule' },
            { path: 'Facility', loadChildren: './setups/Facility/facility.module#facilityModule' },
            { path: 'guarantors', loadChildren: './setups/guarantors/guarantors.module#GuarantorsModule' },
            { path: 'procedures', loadChildren: './setups/Procedures/procedures.module#proceduresModule' },
            { path: 'diagnosis', loadChildren: './setups/dx/dx.module#dxModule' },
            { path: 'ndc', loadChildren: './setups/ndc/ndc.module#ndcModule' },
            { path: 'DepositSlip', loadChildren: './deposite-slip/deposite-slip.module#DepositeSlipModule' },
            { path: 'Patient/Demographics', loadChildren: './Claims/claims.module#ClaimsModule' },
            { path: 'InsuranceSetup', loadChildren: './setups/setups.module#SetupsModule' },
            { path: 'reporting', loadChildren: './dynamic-reports/dynamic-reports.module#DynamicReportsModule' },
            { path: 'era', loadChildren: './era/era.module#ERAModule' },
           // { path: 'payment', loadChildren: './payment/payment.module#PaymentModule' },
            { path: 'referral-physician', loadChildren: './setups/referral-physician/referral-physician.module#ReferralPhysiciansModule'},
        ]
    },
    { path: '404', component: ErrorPageComponent },
    { path: '**', redirectTo: '/404' }
];
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(appRoutes, { useHash: true })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {

}