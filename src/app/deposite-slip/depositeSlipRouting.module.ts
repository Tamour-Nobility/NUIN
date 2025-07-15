import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DespositSlipComponent } from './desposit-slip.component';

const routes: Routes = [
  {
    path: '',
    component: DespositSlipComponent
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class depositeSlipRoutingModule { }