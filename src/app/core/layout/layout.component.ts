import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { isNullOrUndefined } from 'util';
import { CurrentUserViewModel } from '../../models/auth/auth';
declare var $: any;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, AfterViewInit {
  loggedInUser: CurrentUserViewModel;
  PracticeCode: any;
  constructor(public Gvars: GvarsService) {
    this.loggedInUser = new CurrentUserViewModel();
  }

  ngOnInit() {
    this.loggedInUser = this.Gvars.currentUser;
    this.PracticeCode = this.loggedInUser.selectedPractice.PracticeCode;
  }

  ngAfterViewInit() {
    if (!this.PracticeCode)
      if (this.loggedInUser.Practices.length > 1) {
        $('#pracSelection').modal('show');
      }
  }

  onChangePractice() {
    let p = this.loggedInUser.Practices.find(t => t.PracticeCode == this.PracticeCode);
    if (!isNullOrUndefined(p)) {
      this.Gvars.currentUser.selectedPractice = p;
    }
  }
}
