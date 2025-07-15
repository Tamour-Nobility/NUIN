import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DXComponent } from './dx.component';

const routes: Routes = [
   
    { path: '', component: DXComponent }
    
   
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class dxRoutingModule { }
