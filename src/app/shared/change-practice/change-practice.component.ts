import { Component, OnInit, ViewChild } from '@angular/core';
import { CurrentUserViewModel } from '../../models/auth/auth';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { isNullOrUndefined } from 'util';
import { AuthService } from '../../services/auth/auth.service';
import { DashboardRefreshService } from '../../services/data/dashboard.service';
import { PatientRefreshService } from '../../services/data/patient-refresh.service';
declare var $: any;

@Component({
  selector: 'app-change-practice',
  templateUrl: './change-practice.component.html',
  styleUrls: ['./change-practice.component.css']
})
export class ChangePracticeComponent implements OnInit {
  loggedInUser: CurrentUserViewModel;
  PracticeCode: any;
  private isDashboardComponentInitialized = false;
  constructor(public Gvars: GvarsService,
    private authService: AuthService,
    private dashboardRefresh: DashboardRefreshService, private patRefresh: PatientRefreshService) {
    this.loggedInUser = new CurrentUserViewModel();
  }

  ngOnInit() {
    debugger
    this.loggedInUser = this.Gvars.currentUser;
    this.PracticeCode = this.loggedInUser.selectedPractice.PracticeCode;
    this.loggedInUser.Practices = this.loggedInUser.Practices.map(practice => {
      return {
          ...practice,  // Keep all existing properties
          PracticeLabel: `${practice.PracticeCode} | ${practice.PracticeName}`  // Add new combined property
      };
  });
  

  


    let SelectedPractice = this.loggedInUser.Practices.find(t => t.PracticeCode == this.PracticeCode);
    this.authService.setPractice(SelectedPractice);
  }
  
  onChangePractice() {
    debugger
    let selectedPractice = this.loggedInUser.Practices.find(t => t.PracticeCode == this.PracticeCode);
    if (selectedPractice) {
      this.Gvars.setSelectedPractice(selectedPractice);
      this.authService.setPractice(selectedPractice);
    }
    let p = this.loggedInUser.Practices.find(t => t.PracticeCode == this.PracticeCode);
    if (!isNullOrUndefined(p)) {
      
      this.Gvars.currentUser.selectedPractice = p;
      let isDash:boolean =false
      this.Gvars.currentUser.Menu.includes("Dashboard")? isDash=true:isDash=false
      this.authService.GetAuthorizedRoute(this.Gvars.currentUser.Menu[0]);
      if(isDash==true){
        this.dashboardRefresh.refresh.next();
      }else{
        this.patRefresh.refresh.next();
      }
      this.authService.setPractice(p);

      this.authService.setPractice(p);

      //Added by HAMZA ZULFIQAR as per USER STORY 119: Reporting Dashboard Implementation For All Practices
       // this.Gvars.external_practice=this.Gvars.external_practices.includes(this.Gvars.currentUser.selectedPractice.PracticeCode)

      }
  }


  show() {
    $('#pracSelection').modal('show');
  }

  hide() {
    $('#pracSelection').modal('hide');
  }
}