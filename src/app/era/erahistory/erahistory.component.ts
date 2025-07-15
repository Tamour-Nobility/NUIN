
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { APIService } from '../../components/services/api.service';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any
@Component({
  selector: 'app-erahistory',
  templateUrl: './erahistory.component.html',
  styleUrls: ['./erahistory.component.css']
})
export class ErahistoryComponent implements OnInit {
  dataTableERAHistory: any;
  lastSevenDaysERA:any=[];
  prac:any;
  constructor(private API: APIService,
    private Gv: GvarsService,
    private toastService: ToastrService,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.eraHistory();
    const { snapshot } = this.route;
  }

  eraHistory(){
    if( localStorage.getItem('sp') === null){
      this.prac = {PracticeCode: '1010999'}
      this.prac = Number(this.prac['PracticeCode']);
      console.log("default Practice",this.prac);
    }else{
      this.prac=JSON.parse(localStorage.getItem('sp'));
      this.prac= this.prac['PracticeCode'];
      this.prac= Number(this.prac); 
      console.log("change Practice ERA/Import?practiceCode=1011002",this.prac);
    }
    
    var RolesAndRights=JSON.parse(localStorage.getItem('rr'));
    let userDetails = {
      UserID  : RolesAndRights[0].UserId,
      UserName : RolesAndRights[0].UserName,
      PracticeCode:this.prac,
    };
    console.log("userDetails",userDetails
    )
    this.API.PostData('/ERA/WeekHistoryOfERA',userDetails, (res) => {
      console.log("WeekHistoryOfERA",res)
      if (res.Status == "Successfull") {
        if (this.dataTableERAHistory) {
          this.chRef.detectChanges();
          this.dataTableERAHistory.destroy();
        }
        this.lastSevenDaysERA = res.Response;
        this.chRef.detectChanges();
        const table: any = $('.dataTableERAHistory');
        this.dataTableERAHistory = table.DataTable({
          columnDefs: [
            { orderable: false, targets: -1 }
          ],
          language: {
            emptyTable: "No data available"
          },
          order: [1, 'desc'],
        })
      }
      else
        swal(res.status, res.Response, 'error');
    });
  }

}
