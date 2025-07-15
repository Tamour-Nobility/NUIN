
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AddEditPropertiesComponent } from './add-edit-properties/add-edit-properties.component';
import { DetailPropertiesComponent } from './detail-properties/detail-properties.component';
import { ListPropertiesComponent } from './list-properties/list-properties.component';
import { PropertiesComponent } from './properties.component';

@NgModule({
  declarations: [
    AddEditPropertiesComponent,
    DetailPropertiesComponent,
    ListPropertiesComponent,
    PropertiesComponent
  ],
  imports: [
    SharedModule
  ]
})
export class PropertiesModule { }