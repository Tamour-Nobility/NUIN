import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GvarsService } from '../app/services/G_vars/gvars.service'
import { CurrentUserViewModel } from './models/auth/auth';
import { JwtHelper } from 'angular2-jwt';
import { AuthService } from './services/auth/auth.service';
import { Common } from './services/common/common';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private router: Router,
    private GV: GvarsService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute) {
  }

  ngOnInit() {

    $(document).ready(function () {
 //     $("body").toggleClass.remove("mini-navbar");
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

    const userObj = this.authService.getTokenFromLS();
    if (userObj) {
      debugger
      this.GV.currentUser = new CurrentUserViewModel();
      let decStr = this.jwtHelper.decodeToken(userObj.jwt);
      this.GV.currentUser.exp = decStr.exp;
      this.GV.currentUser.iat = decStr.iat;
      this.GV.currentUser.nbf = decStr.nbf;
      this.GV.currentUser.role = decStr.role;
      this.GV.currentUser.userId = decStr.UserId;
      this.GV.currentUser.unique_name = decStr.unique_name;
      this.GV.currentUser.Practices = userObj.practices;
      if (this.GV.currentUser.Practices.length > 0) {
        var selectedPractice = this.authService.getPractice();
        if (selectedPractice)
          this.GV.currentUser.selectedPractice = selectedPractice;
        else
          this.GV.currentUser.selectedPractice = this.GV.currentUser.Practices[0];
      }
      this.GV.currentUser.RolesAndRights = userObj.roleAndRights;
      if (this.GV.currentUser.RolesAndRights.length > 0) {
        localStorage.setItem('loginStatus', '1');
        this.GV.currentUser.Menu = this.GV.currentUser.RolesAndRights.map(r => r.ModuleName);
        this.GV.currentUser.Menu = this.GV.currentUser.Menu.filter(Common.Distinct);
        if (this.GV.isReportingPerson())
          this.authService.GetAuthorizedRoute("reporting");
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
