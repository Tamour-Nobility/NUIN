import { Component, OnInit } from '@angular/core';
import { CurrentUserViewModel } from '../models/auth/auth';
import { GvarsService } from '../services/G_vars/gvars.service';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-claim-submission',
  templateUrl: './claim-submission.component.html',
  styleUrls: ['./claim-submission.component.css']
})
export class ClaimSubmissionComponent implements OnInit {
  loggedInUser: CurrentUserViewModel;
  TypeofScrubber: any;
  private dataSubscription: Subscription;
  public data: string;
  public someCustomOption:string;
  route: ActivatedRoute;
  currentUrl :string;
  isScrubberTabActive: boolean = false;
  

  constructor(private gvService: GvarsService, protected activeRouter:ActivatedRoute,public router: Router) { 
    this.activeRouter.params.subscribe(params => {
      console.log(" this.TypeofScrubber   ffdsfdsfds", params)
      this.TypeofScrubber = params['type'];
    });

    
  }
  

  ngOnInit() {
 
    this.loggedInUser = this.gvService.currentUser;
    
   
  }

  isBillingPerson() {
    return this.loggedInUser && this.loggedInUser.role && (this.loggedInUser.role.toLowerCase() === 'billing executive' ||
           this.loggedInUser.role.toLowerCase() === 'billing' || this.loggedInUser.role.toLowerCase() === 'lead billing');
  }


}
