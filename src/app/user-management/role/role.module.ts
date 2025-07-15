
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AddEditRoleComponent } from './add-edit-role/add-edit-role.component';
import { ListRoleComponent } from './list-role/list-role.component';
import { RoleDetailComponent } from './role-detail/role-detail.component';
import { RoleComponent } from './role.component';

@NgModule({
  declarations: [
    AddEditRoleComponent,
    ListRoleComponent,
    RoleDetailComponent,
    RoleComponent
  ],
  imports: [
    SharedModule
  ]
})
export class RoleModule { }