import { NgModule } from '@angular/core';
import { CalendarModule } from 'angular-calendar';

import { SchedulerComponent } from './scheduler/scheduler.component';
import { AppointmentSchedulerComponent } from './appointment-scheduler.component';
import { CalendarHeaderComponent } from '../../scheduler-utility/calendar-header.component';
import { SharedModule } from '../shared/shared.module';
import { AppointmentSchedulerRoutingModule } from './appointment-scheduler-routing.module';
import { OfficeTimingsComponent } from './office-timings/office-timings.component';
import { AddEditOfficeTimingComponent } from './office-timings/add-edit-office-timing/add-edit-office-timing.component';
import { AppointmentStatusComponent } from './appointment-status/appointment-status.component';
import { AddEditAppointmentStatusComponent } from './appointment-status/add-edit-appointment-status/add-edit-appointment-status.component';
import { AppointmentReasonsComponent } from './appointment-reasons/appointment-reasons.component';
import { AddEditAppointmentReasonComponent } from './appointment-reasons/add-edit-appointment-reason/add-edit-appointment-reason.component';
import { BlockAppointmentsComponent } from './block-appointments/block-appointments/block-appointments.component';
import { AddEditBlockAppointmentsComponent } from './block-appointments/add-edit-block-appointments/add-edit-block-appointments/add-edit-block-appointments.component';


@NgModule({
  declarations: [
    SchedulerComponent,
    AppointmentSchedulerComponent,
    CalendarHeaderComponent,
    OfficeTimingsComponent,
    AddEditOfficeTimingComponent,
    AppointmentStatusComponent,
    AddEditAppointmentStatusComponent,
    AppointmentReasonsComponent,
    AddEditAppointmentReasonComponent,
    BlockAppointmentsComponent,
    AddEditBlockAppointmentsComponent
  ],
  imports: [
    CalendarModule,
    SharedModule,
    AppointmentSchedulerRoutingModule,
  ],
  exports: []
})
export class AppointmentSchedulerModule { }
