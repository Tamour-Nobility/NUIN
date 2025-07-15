import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClaimLevelComponent } from './claim-level/claim-level.component';
import { AccountLevelComponent } from './account-level/account-level.component';
import { TasksComponent } from './tasks.component';


const routes: Routes = [
  {
    

      path: '',
      component: TasksComponent, children: [
        {
          path: 'claimlevel',
          component: ClaimLevelComponent
        },
        {
          path: 'accountlevel',
          component: AccountLevelComponent
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
