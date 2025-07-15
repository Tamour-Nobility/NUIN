import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { AppointmentSchedulerComponent } from './appointment-scheduler.component';
import { OfficeTimingsComponent } from './office-timings/office-timings.component';
import { AppointmentStatusComponent } from './appointment-status/appointment-status.component';
import { AppointmentReasonsComponent } from './appointment-reasons/appointment-reasons.component';
import { BlockAppointmentsComponent } from './block-appointments/block-appointments/block-appointments.component';

const routes: Routes = [
  {
    path: '', component: AppointmentSchedulerComponent, children: [
      { path: 'scheduler', component: SchedulerComponent },
      { path: 'officeTiming', component: OfficeTimingsComponent },
      { path: 'statuses', component: AppointmentStatusComponent },
      { path: 'reasons', component: AppointmentReasonsComponent },
      { path: 'block-appointments', component: BlockAppointmentsComponent }
    ]
  },


]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentSchedulerRoutingModule { }