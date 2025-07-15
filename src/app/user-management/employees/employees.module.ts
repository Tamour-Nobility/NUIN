import { NgModule } from '@angular/core';
import { AddEditEmployeeComponent } from './add-edit-employee/add-edit-employee.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { ListEmployeesComponent } from './list-employees/list-employees.component';
import { EmployeesComponent } from './employees.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    AddEditEmployeeComponent,
    EmployeeDetailComponent,
    ListEmployeesComponent,
    EmployeesComponent
  ],
  imports: [
    SharedModule
  ]
})
export class employeesModule { }