import { NgModule } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TopnavbarComponent } from './topnavbar/topnavbar.component';
import { SharedModule } from '../shared/shared.module';
import { ErrorPageComponent } from './error-page/error-page.component';
import { BaseComponent } from './base/base.component';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';

@NgModule({
  declarations: [
    FooterComponent,
    LayoutComponent,
    NavbarComponent,
    TopnavbarComponent,
    ErrorPageComponent,
    BaseComponent
  ],
  imports: [
    SharedModule,
    PasswordStrengthBarModule
  ]
})
export class CoreModule { }
