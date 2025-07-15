import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NdcComponent } from './ndc.component';

const routes: Routes = [
   
    { path: '', component: NdcComponent }
    
   
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ndcRoutingModule { }
