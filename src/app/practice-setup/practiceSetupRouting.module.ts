import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PracticeTABComponent } from './practiceTAB/practice-tab.component';
import { PracticeListComponent } from './practiceList/practice-list.component';
import { AddEditPracticeComponent } from './addeditpractice/add-edit-practice.component';


const routes: Routes = [
  {
    path: 'PracticeTAB', component: PracticeTABComponent
  },
  { path: 'PracticeList', component: PracticeListComponent },
  { path: 'Practice', component: AddEditPracticeComponent },
  { path: 'EditPractice/:id/:Type', component: PracticeTABComponent }

]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class practiceSetupRoutingModule { }