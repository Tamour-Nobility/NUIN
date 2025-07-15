import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EdiSetupMainComponent } from './edi-setup-main.component';


const routes: Routes = [
    {
        path: '',
        component: EdiSetupMainComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class edisetupRoutingModule { }