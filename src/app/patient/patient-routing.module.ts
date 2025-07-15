import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientSearchComponent } from './search/patient-search.component';

const routes: Routes = [
  {
    path: 'PatientSearch',
    component: PatientSearchComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
