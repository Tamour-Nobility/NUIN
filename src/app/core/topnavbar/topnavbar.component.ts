import { Component, OnInit, ViewChild } from '@angular/core';
declare var $: any
import { AuthService } from '../../services/auth/auth.service';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { CurrentUserViewModel } from '../../models/auth/auth';
import { ChangePracticeComponent } from '../../shared/change-practice/change-practice.component';

@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.css']
})
export class TopnavbarComponent implements OnInit {
  @ViewChild(ChangePracticeComponent) CP: ChangePracticeComponent;
  loggedInUser: CurrentUserViewModel;
  constructor(private authService: AuthService,
    private gvService: GvarsService) {
    this.loggedInUser = new CurrentUserViewModel();
  }

  public ngOnInit() {
    console.log("loggedInUser.selectedPractice.PracticeName",this.loggedInUser.selectedPractice.PracticeName)
    this.loggedInUser = this.gvService.currentUser;
    $(document).ready(function () {
      $('.navbar-minimalize').on('click', function (event) {
        event.preventDefault();
        $("body").toggleClass("mini-navbar");
        SmoothlyMenu()
      });
    });
    function SmoothlyMenu() {
      if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
          // Hide menu in order to smoothly turn on when maximize menu
          $('#side-menu').hide();
          // For smoothly turn on menu
          setTimeout(
              function () {
                  $('#side-menu').fadeIn(400);
              }, 200);
      } else if ($('body').hasClass('fixed-sidebar')) {
          $('#side-menu').hide();
          setTimeout(
              function () {
                  $('#side-menu').fadeIn(400);
              }, 100);
      } else {
          // Remove all inline style from jquery fadeIn function to reset menu state
          $('#side-menu').removeAttr('style');
      }
  }
  }
  onClickLogout() {
    this.authService.Logout();
  }
  onChangePracticeClick() {
    this.CP.show();
  }
}