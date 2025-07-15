import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentSearchComponent } from './payment-search/payment-search/payment-search.component';

const routes: Routes = [
    {
        path: '',
        component: PaymentSearchComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentRoutingModule { }
