import { NgModule } from '@angular/core';
import { DashBoardComponent } from './dash-board.component';
import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import 'chartjs-plugin-datalabels';



@NgModule({
  declarations: [
    DashBoardComponent
  ],
  imports: [
    SharedModule,
    ChartsModule
  ]
})
export class DashboardModule { }
