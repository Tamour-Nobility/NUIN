import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GvarsService } from '../services/G_vars/gvars.service';

@Component({
  selector: 'app-main-reports',
  templateUrl: './main-reports.component.html'

})
export class MainReportsComponent implements OnInit {
  isRouted: boolean = false;
  isDHF:boolean=false;
  constructor(private route: ActivatedRoute , private Gv:GvarsService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(qs => {
      if (qs && qs['PracticeCode']) {
        this.isRouted = true;
      }
      else {
        this.isRouted = false;
      }
    })


    // this is the temp solution need change it in future
    console.log('this.Gv.currentUser.selectedPractice.Division',this.Gv.currentUser.selectedPractice.Division)

    this.Gv.currentUser.Practices.forEach(x=>{
      if(x.PracticeCode == 35510231){
this.isDHF=true;
      }
    })
  }

 



}
