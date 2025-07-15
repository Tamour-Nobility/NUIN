import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ERAImportComponent } from './eraimport/eraimport.component';
import { ERAClaims } from './era-claims/era-claims.component';
import { ERAViewer } from './era-viewer/era-viewer.component';
import { ERALayout } from './era-layout/era-layout.component';
import { ERARoutingModule } from './era-routing.module';
import { ErahistoryComponent } from './erahistory/erahistory.component';

@NgModule({
    declarations: [
        ERAImportComponent,
        ERAClaims,
        ERAViewer,
        ERALayout,
        ErahistoryComponent
    ],
    imports: [
        SharedModule,
        ERARoutingModule
    ]
})

export class ERAModule { }
