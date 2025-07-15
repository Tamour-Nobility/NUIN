import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AddEditSubModuleComponent } from './add-edit-sub-module/add-edit-sub-module.component';
import { ListSubModuleComponent } from './list-sub-module/list-sub-module.component';
import { SubModuleDetailComponent } from './sub-module-detail/sub-module-detail.component';
import { SubModulesComponent } from './sub-modules.component';

@NgModule({
  declarations: [
    AddEditSubModuleComponent,
    ListSubModuleComponent,
    SubModuleDetailComponent,
    SubModulesComponent
  ],
  imports: [
    SharedModule
  ]
})
export class submoduleModule { }