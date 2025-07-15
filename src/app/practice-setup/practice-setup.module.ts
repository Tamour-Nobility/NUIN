import { NgModule } from '@angular/core';
import { AddEditPracticeComponent } from './addeditpractice/add-edit-practice.component';
import { LocationsComponent } from './Locations/locations.component';
import { PracticeListComponent } from './practiceList/practice-list.component';
import { PracticeTABComponent } from './practiceTAB/practice-tab.component';
import { ProvidersComponent } from './providers/providers.component';
import { SharedModule } from '../shared/shared.module';
import { practiceSetupRoutingModule } from './practiceSetupRouting.module';

@NgModule({
  declarations: [
    AddEditPracticeComponent,
    LocationsComponent,
    PracticeListComponent,
    PracticeTABComponent,
    ProvidersComponent
  ],
  imports: [
    SharedModule,
    practiceSetupRoutingModule
  ]
})
export class PracticeSetupModule { }
