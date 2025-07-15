import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ERAImportComponent } from './eraimport/eraimport.component';
import { ErahistoryComponent } from './erahistory/erahistory.component';
import { ERAViewer } from './era-viewer/era-viewer.component';
import { ERALayout } from './era-layout/era-layout.component';
import { ERAClaims } from '../era/era-claims/era-claims.component';

const routes: Routes = [
    {
        path: '',
        component: ERALayout,
        children: [
            {
                path: 'era',
                component: ERAImportComponent,
            },
            {
                path: 'erahistory',
                component: ErahistoryComponent,
            },
            {
                path: 'view/:id',
                component: ERAViewer
            },
            {
                path: 'claims/:id',
                component: ERAClaims
            }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ERARoutingModule { }
