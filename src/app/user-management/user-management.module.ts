import { NgModule } from '@angular/core';
import { UserManagementComponent } from './user-management.component';
import { SharedModule } from '../shared/shared.module';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';
import { TreeviewModule } from 'ngx-treeview';
import { employeesModule } from './employees/employees.module';
import { ModulesModule } from './module/modules.module';
import { PropertiesModule } from './properties/properties.module';
import { RoleModule } from './role/role.module';
import { RoleRightModule } from './role-rights/rolerights.module';
import { submoduleModule } from './sub-modules/submodule.module';
import { UserssModule } from './users/users.module';
import { UserManagementRoutingModule } from './userManagementRouting.module';

@NgModule({
  declarations: [
    UserManagementComponent
  ],
  imports: [
    SharedModule,
    PasswordStrengthBarModule,
    TreeviewModule,
    employeesModule,
    ModulesModule,
    PropertiesModule,
    RoleModule,
    RoleRightModule,
    submoduleModule,
    UserssModule,
    UserManagementRoutingModule
    ]
})
export class UserManagementModule { }
