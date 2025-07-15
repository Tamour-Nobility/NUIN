import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AddEditModuleComponent } from './add-edit-module/add-edit-module.component';
import { ListModuleComponent } from './list-module/list-module.component';
import { ModuleDetailComponent } from './module-detail/module-detail.component';
import { ModuleComponent } from './module.component';

@NgModule({
  declarations: [
    AddEditModuleComponent,
    ListModuleComponent,
    ModuleDetailComponent,
    ModuleComponent

  ],
  imports: [
    SharedModule
  ]
})
export class ModulesModule { }