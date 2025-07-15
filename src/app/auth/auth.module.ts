import { ErrorHandler, NgModule } from '@angular/core';
import { LoginComponent } from './Login/login.component';
import { SharedModule } from '../shared/shared.module';
import { NgOtpInputModule } from 'ng-otp-input';


@NgModule({
  declarations: [
    LoginComponent,

  ],
  imports: [
    SharedModule,
    NgOtpInputModule
  ]
  ,
  providers: [

   
  ],
})
export class AuthModule { }
