
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RoleWiseRightsComponent } from './role-wise-rights/role-wise-rights.component';
import { UsersWiseRightsComponent } from './users-wise-rights/users-wise-rights.component';
import { RoleRightsComponent } from './role-rights.component';
import { TreeviewModule } from 'ngx-treeview';

@NgModule({
  declarations: [
    RoleWiseRightsComponent,
    UsersWiseRightsComponent,
    RoleRightsComponent
  ],
  imports: [
    SharedModule,
    TreeviewModule.forRoot()
  ]
})
export class RoleRightModule { }