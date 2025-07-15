import { NgModule } from "@angular/core";
import { APIService } from '../../components/services/api.service';
import { ReferralPhysicianComponent } from "./referral-physician.component";
import { AddEditReferralPhysicianComponent } from "./add-edit-referral-physician/add-edit-referral-physician.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ReferralPhysiciansRoutingModule } from "./referral-physician-routing.module";
import { SharedModule } from '../../shared/shared.module';
import { MyDatePickerModule } from "mydatepicker";
import { MyDateRangePickerModule } from "mydaterangepicker";
import { CommonModule } from "@angular/common";

@NgModule({

    declarations: [
      ReferralPhysicianComponent,
      AddEditReferralPhysicianComponent
    ],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      ReferralPhysiciansRoutingModule,
      MyDatePickerModule,
      MyDateRangePickerModule,
      CommonModule
    ],
  
    providers: [
      APIService
    ],
  
  })
  
  export class ReferralPhysiciansModule { }