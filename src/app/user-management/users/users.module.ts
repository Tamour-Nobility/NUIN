import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ListUserComponent } from './list-user/list-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UsersComponent } from './users.component';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';


@NgModule({
  declarations: [
    AddEditUserComponent,
    UserDetailComponent,
    ListUserComponent,
    ResetPasswordComponent,
    UsersComponent
  ],
  imports: [
    SharedModule,
    PasswordStrengthBarModule
  ]
})
export class UserssModule { }