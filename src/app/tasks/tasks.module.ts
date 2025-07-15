import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from '../tasks/tasks.component';
import { ClaimLevelComponent } from './claim-level/claim-level.component';
import { AccountLevelComponent } from './account-level/account-level.component';


@NgModule({
  declarations: [TasksComponent, ClaimLevelComponent, AccountLevelComponent ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    SharedModule
  ]
})
export class TasksModule { }
