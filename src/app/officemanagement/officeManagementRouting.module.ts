import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficemanagementComponent } from './officemanagement.component';

const routes: Routes = [
  {
    path: '',
    component: OfficemanagementComponent
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class officeManagementRoutingModule { }