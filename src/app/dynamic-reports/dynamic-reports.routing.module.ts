
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DynamicReportsComponent } from './dynamic-reports.component';
import { ChargesComponent } from './charges/charges.component';
import { PaymentsComponent } from './payments/payments.component';
import { OverAllByDosComponent } from './charges/overall-by-dos/overall-by-dos.component';
import { ByCPTDos } from './charges/by-cpt-dos/by-cpt-dos.component';
import { OverallPaymentsByMonth } from './payments/overall-payments-by-month/overall-payments-by-month.component'
import { OverallPaymentsByDaily } from './payments/overall-payments-by-daily/overall-payments-by-daily.component';
import { ChargesByHospital } from './charges/charges-by-hospital/charges-by-hospital.component';
import { ChargesByPrimaryDxDOS } from './charges/charges-by-primary-dx-dos/charges-by-primary-dx-dos.component';
import { ChargesByCarrierDos } from './charges/charges-by-carrier-dos/charges-by-carrier-dos.component';
import { PaymentByCarrier } from './payments/payment-by-carrier/payment-by-carrier.component';
import { PaymentByPrimaryDX } from './payments/payment-by-primary-dx/payment-by-primary-dx.component';
import { PaymentByPrimaryICD10 } from './payments/payment-by-primary-icd10/payment-by-primary-icd10.component';
import { CpaComponent } from './charges/by-cpa/cpa/cpa.component';

const routes: Routes = [
    {
        path: '',
        component: DynamicReportsComponent,
        children: [
            {
                path: 'charges',
                component: ChargesComponent,
                children: [
                    {
                        path: 'overall',
                        component: OverAllByDosComponent
                    },
                    {
                        path: 'by-cpt',
                        component: ByCPTDos
                    },
                    {
                        path: 'by-hospital',
                        component: ChargesByHospital
                    },
                    {
                        path: 'by-primary-dx-dos',
                        component: ChargesByPrimaryDxDOS
                    },
                    {
                        path: 'by-carrier',
                        component: ChargesByCarrierDos
                    },
                    {
                        path: 'cpa',
                        component: CpaComponent
                    }
                ]
            },
            {
                path: 'payments',
                component: PaymentsComponent,
                children: [
                    {
                        path: 'monthly',
                        component: OverallPaymentsByMonth
                    },
                    {
                        path: 'daily',
                        component: OverallPaymentsByDaily
                    },
                    {
                        path: 'by-carrier',
                        component: PaymentByCarrier
                    },
                    {
                        path: 'by-primary-dx',
                        component: PaymentByPrimaryDX
                    },
                    {
                        path: 'by-procedure-code',
                        component: PaymentByPrimaryICD10
                    }
                ]
            }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DynamicReportsRoutingModule { }