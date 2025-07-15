import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { DynamicReportsComponent } from './dynamic-reports.component';
import { DynamicReportsRoutingModule } from './dynamic-reports.routing.module';
import { ChargesComponent } from './charges/charges.component';
import { PaymentsComponent } from './payments/payments.component';
import { OverAllByDosComponent } from './charges/overall-by-dos/overall-by-dos.component';
import { ByCPTDos } from './charges/by-cpt-dos/by-cpt-dos.component';
import { OverallPaymentsByMonth } from './payments/overall-payments-by-month/overall-payments-by-month.component';
import { OverallPaymentsByDaily } from './payments/overall-payments-by-daily/overall-payments-by-daily.component';
import { ChargesByHospital } from './charges/charges-by-hospital/charges-by-hospital.component';
import { ChargesByPrimaryDxDOS } from './charges/charges-by-primary-dx-dos/charges-by-primary-dx-dos.component';
import { ChargesByCarrierDos } from './charges/charges-by-carrier-dos/charges-by-carrier-dos.component';
import { PaymentByCarrier } from './payments/payment-by-carrier/payment-by-carrier.component';
import { PaymentByPrimaryDX } from './payments/payment-by-primary-dx/payment-by-primary-dx.component';
import { PaymentByPrimaryICD10 } from './payments/payment-by-primary-icd10/payment-by-primary-icd10.component';
import { CpaComponent } from './charges/by-cpa/cpa/cpa.component';

@NgModule({
  declarations: [
    DynamicReportsComponent,
    PaymentsComponent,
    ChargesComponent,
    OverAllByDosComponent,
    ByCPTDos,
    OverallPaymentsByMonth,
    OverallPaymentsByDaily,
    ChargesByHospital,
    ChargesByPrimaryDxDOS,
    ChargesByCarrierDos,
    PaymentByCarrier,
    PaymentByPrimaryDX,
    PaymentByPrimaryICD10,
    CpaComponent
  ],
  imports: [
    SharedModule,
    DynamicReportsRoutingModule
  ]
})
export class DynamicReportsModule { }
