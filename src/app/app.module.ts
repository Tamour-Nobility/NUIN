// Modules
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { OwlModule } from 'ngx-owl-carousel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng2ImgToolsModule } from 'ng2-img-tools';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { PopoverModule } from "ngx-popover";
import { NgxSelectModule } from 'ngx-select-ex';
import { TagInputModule } from 'ngx-chips';
import { TreeviewModule } from 'ngx-treeview';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';
import { DatePipe, TitleCasePipe, UpperCasePipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MyDatePickerModule } from 'mydatepicker';
import { NgxMaskModule } from 'ngx-mask';

import { NgOtpInputModule } from 'ng-otp-input';



// Services
import { GvarService } from './components/services/GVar/gvar.service';
import { GvarsService } from './services/G_vars/gvars.service';
import { APIService } from './components/services/api.service';
import { ClaimService } from '../app/services/claim/claim.service'
import { AuthGuard } from './guards/auth.guard';
import { DashGuard } from './guards/dash.guard';

import { JWTInterceptors } from './helpers/jwt.interceptors';
import { EncryptDecryptAuthInterceptor } from './helpers/encrypt-decrypt-interceptor';

// User defined modules and components
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FileHandlerService } from './components/services/file-handler/filehandler.service';

import { EligblityComponent } from './eligblity/eligblity.component';
import { TasksModule } from './tasks/tasks.module';
import { ReferralPhysiciansModule } from './setups/referral-physician/referral-physician.module';
import { CustomEditsComponent } from './custom-edits/custom-edits.component';
import { TicketTrackerComponent } from './ticket-tracker/ticket-tracker.component';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { TicketAttachmentsComponent } from './ticket-attachments/ticket-attachments.component';
import { TicketResponseComponent } from './ticket-response/ticket-response.component';



@NgModule({
    declarations: [
        AppComponent,
        EligblityComponent,
        CustomEditsComponent,
        TicketTrackerComponent,
        CreateTicketComponent,
        TicketAttachmentsComponent,
        TicketResponseComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        Ng2ImgToolsModule,
        OwlModule,
        NgOtpInputModule,
        MyDatePickerModule,
        MyDateRangePickerModule,
        NgxMaskModule.forRoot(),
        FormsModule,
        NgxSelectModule,
        TagInputModule,
        BrowserAnimationsModule,
        TreeviewModule.forRoot(),
        PasswordStrengthBarModule,
        PopoverModule,
        DragDropModule,
        NgMultiSelectDropDownModule.forRoot(),
        NgxPaginationModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        NgxSpinnerModule,
        AuthModule,
        CoreModule,
        DashboardModule,
        SharedModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        TasksModule,
    ],
    providers: [
        ClaimService,
        GvarsService,
        APIService,
        DatePipe,
        DecimalPipe,
        CurrencyPipe,
        TitleCasePipe,
        UpperCasePipe,
        GvarService,
        AuthGuard,
        DashGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: EncryptDecryptAuthInterceptor,
            multi: true,
          },
        {
            provide: HTTP_INTERCEPTORS, useClass: JWTInterceptors, multi: true,

        },
       
        
   
        FileHandlerService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
