import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentSearchComponent } from './payment-search/payment-search/payment-search.component';
import { PatientModule } from '../patient/patient.module';
import { ClaimsModule } from '../Claims/claims.module'
import { PaymentAdvisoryComponent } from './payment-advisory/payment-advisory/payment-advisory.component';
import { PaymentPostingComponent } from './payment-posting/payment-posting/payment-posting.component';

@NgModule({
    declarations: [
        PaymentSearchComponent,
        PaymentAdvisoryComponent,
        PaymentPostingComponent],
    imports: [
        SharedModule,
        PaymentRoutingModule,
        PatientModule,
        ClaimsModule
    ]
})

export class PaymentModule { }
