import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { ModuleComponent } from './module/module.component';
import { AddEditModuleComponent } from './module/add-edit-module/add-edit-module.component';
import { ModuleDetailComponent } from './module/module-detail/module-detail.component';
import { RoleComponent } from './role/role.component';
import { AddEditRoleComponent } from './role/add-edit-role/add-edit-role.component';
import { RoleDetailComponent } from './role/role-detail/role-detail.component';
import { SubModulesComponent } from './sub-modules/sub-modules.component';
import { AddEditSubModuleComponent } from './sub-modules/add-edit-sub-module/add-edit-sub-module.component';
import { SubModuleDetailComponent } from './sub-modules/sub-module-detail/sub-module-detail.component';
import { PropertiesComponent } from './properties/properties.component';
import { AddEditPropertiesComponent } from './properties/add-edit-properties/add-edit-properties.component';
import { DetailPropertiesComponent } from './properties/detail-properties/detail-properties.component';
import { UsersComponent } from './users/users.component';
import { AddEditUserComponent } from './users/add-edit-user/add-edit-user.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { EmployeesComponent } from './employees/employees.component';
import { AddEditEmployeeComponent } from './employees/add-edit-employee/add-edit-employee.component';
import { EmployeeDetailComponent } from './employees/employee-detail/employee-detail.component';
import { RoleRightsComponent } from './role-rights/role-rights.component';
import { RoleWiseRightsComponent } from './role-rights/role-wise-rights/role-wise-rights.component';
import { UsersWiseRightsComponent } from './role-rights/users-wise-rights/users-wise-rights.component';


const routes: Routes = [
    {
        path: 'module',
        component: ModuleComponent,
        children: [
            { path: '', redirectTo: 'module', pathMatch: 'full' },
            { path: 'add', component: AddEditModuleComponent },
            { path: 'edit/:id', component: AddEditModuleComponent },
            { path: 'detail/:id', component: ModuleDetailComponent }
        ]
    },
    {
        path: 'role',
        component: RoleComponent,
        children: [
            { path: '', redirectTo: 'role', pathMatch: 'full' },
            { path: 'add', component: AddEditRoleComponent },
            { path: 'edit/:id', component: AddEditRoleComponent },
            { path: 'detail/:id', component: RoleDetailComponent }
        ]
    },
    {
        path: 'submodule',
        component: SubModulesComponent,
        children: [
            { path: '', redirectTo: 'submodule', pathMatch: 'full' },
            { path: 'add', component: AddEditSubModuleComponent },
            { path: 'edit/:id', component: AddEditSubModuleComponent },
            { path: 'detail/:id', component: SubModuleDetailComponent }
        ]
    },
    {
        path: 'properties', component: PropertiesComponent, children: [
            { path: '', redirectTo: 'properties', pathMatch: 'full' },
            { path: 'add', component: AddEditPropertiesComponent },
            { path: 'edit/:id', component: AddEditPropertiesComponent },
            { path: 'detail/:id', component: DetailPropertiesComponent }
        ]
    },
    {
        path: 'users', component: UsersComponent, children: [
            { path: '', redirectTo: 'users', pathMatch: 'full' },
            { path: 'add', component: AddEditUserComponent },
            { path: 'edit/:id', component: AddEditUserComponent },
            { path: 'detail/:id', component: UserDetailComponent }
        ]
    },
    {
        path: 'employees', component: EmployeesComponent, children: [
            { path: '', redirectTo: 'employees', pathMatch: 'full' },
            { path: 'edit/:id', component: AddEditEmployeeComponent },
            { path: 'detail/:id', component: EmployeeDetailComponent }
        ]
    },
    {
        path: 'rights', component: RoleRightsComponent, children: [
            { path: '', redirectTo: "rights", pathMatch: 'full' },
            { path: 'rolewise', component: RoleWiseRightsComponent },
            { path: 'userwise', component: UsersWiseRightsComponent }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserManagementRoutingModule { }