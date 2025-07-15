import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { APIService } from '../../components/services/api.service';
import { Common } from '../../services/common/common';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatatableService } from '../../../app/services/data/datatable.service';
import { CurrentUserViewModel } from '../../models/auth/auth';
import { GvarsService } from '../../services/G_vars/gvars.service';
import * as moment from 'moment';


@Component({
  selector: 'app-component-scrubber',
  templateUrl: './component-scrubber.component.html',
  styleUrls: ['./component-scrubber.component.css']
})
export class ComponentScrubberComponent implements OnInit {
  dataTable:any;
  Clear=true;
  All=false;
  Error=false;
  customedits=false;
  allTable:any;
  clearTable: any;
  errorTable:any;
  bucketTable:any;
  showScruberTable:any="Clear";
  scrubberAllClaims:any=[];
  scrubberAllCleanClaims:any=[];
  scrubberAllErrorClaims:any=[];
  prac:any;
  spFound:boolean = false;
  routeSubscription: Subscription;
  TypeofScrubber: any;
  onHideLabel: boolean = false;
  customValues: any=[];
  customvaluesortedarray:any=[];
  loggedInUser: CurrentUserViewModel;
  Menus:any=[];
  Menu: string[];
  ViewMode: boolean = false;

  constructor(private chRef: ChangeDetectorRef,
    public API: APIService,
    private router: Router,
    protected activeRouter:ActivatedRoute,
    private datePipe: DatePipe,
    private datatableService:DatatableService,
    private gvService: GvarsService,

    ) 
    { 
      debugger
      this.routeSubscription= this.activeRouter.params.subscribe(params => {
        this.TypeofScrubber = params['type'];

        // this.setData();
      });
      this.ngOnInit();
       
    }

    // setData() {
    //   this.dataservice.setData(this.TypeofScrubber);
      
    // }



  ngOnInit() {
    debugger
    //this.CustomEditHide();
    //update
    console.log("check scrubber type",this.TypeofScrubber)
    this.loggedInUser = this.gvService.currentUser;
    if(this.TypeofScrubber == "scrubberType" )
    {
      this.scrubberGetAllCleanClaims()
      this.CustomEditHide();
      // this.scrubberGetAllViolation();
      // this.showscrubbertable('Custom Edits');
    }
    if( this.TypeofScrubber == 'update'){
      this.showscrubbertable('Custom Edits');
      this.CustomEditHide();

    }
    
      this.scrubberGetAllCleanClaims()
      this.scrubberGetAllViolation();
      //this.showscrubbertable('Custom Edits');
    
    
  }
  

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'MM-dd-yyyy');
  }

  CustomEditHide(){
    debugger
  debugger
   this.Menus=this.loggedInUser.Menu;
   this.Menus.forEach(element =>
     {
    if(element==="Custom_Edits"){
      debugger
      this.ViewMode = true;
      
    }
   });
   
  }
  VlidateCustomEdit(tableName){
    debugger
  this.CustomEditHide();
    debugger
   if(this.ViewMode ==true){
this.showscrubbertable(tableName);
   }
   else{
    return;
   }
  }
  
  showscrubbertable(tableName){
    this.showScruberTable=tableName 
    switch (this.showScruberTable) {
      case "All":
        this.scrubberAllDetails()
        this.All=true
        this.Clear=false
        this.Error=false
        this.onHideLabel=false;
        break;
      case "Error":
        this.scrubberGetAllViolation();
        this.All=false
        this.Clear=false
        this.Error=true
        this.onHideLabel=false;
        break;
        case "Custom Edits":
          this.getCustomEdits();
          this.onHideLabel=true;
          this.All=false
          this.Clear=false
          this.Error=false
          break;
      default:
        this.scrubberGetAllCleanClaims();
        this.All=false
        this.Clear=true
        this.Error=false
        
    }
  }
  // Added by Hamza Akhlaq For Custom_Edits

  getCustomEdits() {
    debugger
    this.API.getData('/Scrubber/GetAllCustomEdits/?Practice_Code='+this.gvService.currentUser.selectedPractice.PracticeCode).subscribe(
     data => {
          if (this.dataTable) {
            this.dataTable.destroy();
          }
          this.customValues = data;
          this.customvaluesortedarray = [];
          for (let i = 0; i < this.customValues.length; i++) {
                    const item = this.customValues[i];
                    if(item.Created_Date!=null && item.Created_Date!="" ){
                      item.Created_Date = moment(item.Created_Date).format('YYYY-MM-DD');
                    }
                    if(item.Modified_Date!=null && item.Modified_Date!=""){
                      item.Modified_Date=moment(item.Modified_Date).format('YYYY-MM-DD');
 
                    }
                    if(item.Status==true){
                       item.Status='Active'
                    }
                    if(item.Status==false){
                      item.Status='InActive'
                    }
                    if (item.Edit_Name!== null && item.Edit_Name !== "" && item.Edit_Description !== null && item.Edit_Description !== ""&& item.ErrorMessage!== null&& item.ErrorMessage!== "") {
                      this.customvaluesortedarray.push(item);
                    }
                  }
          this.chRef.detectChanges();
          const table: any = $('.dataTableASR');
          this.dataTable = table.DataTable({
            "order": [[8, "desc"]],
            "scrollX": true,
            language: {
              emptyTable: "No data available"
            }
          });
      
      })
  }
 
 
  onAddCustomEdits()
  {
    
    this.router.navigateByUrl('customEdits/add/new')
  
  }
  
  onEditCustomEdits(val:any)
  {
    debugger
    console.log("id",val);
    this.router.navigateByUrl('customEdits/edit/'+ val)
  }
  
  
  onViewCustomEdits(val:any)
  {
    debugger
    this.router.navigateByUrl('customEdits/view/'+ val)
  }
  CustomEditsStatus(val:any) {
    this.confirmFun('Confirmation', 'Are you sure you want to Change Stauts?', () => {
    this.onYesClick();
    }, () => {
   
      this.API.getData('/Scrubber/CustomEditsStatus/' + val).subscribe(
        (data) => {
          this.getCustomEdits();
        }
      );
    });

  }
  


  confirmFun(title: string, text: string, yesCallback: () => void, noCallback: () => void) {
    swal({
      title: title,
      text: text,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        // User clicked "Yes"
        yesCallback();
      } else {
        // User clicked "No, keep it"
        noCallback();
      }
    });
  }

  onNoClick(): any {
    this.router.navigateByUrl('claimsubmission/scrubber/update')
   
  }
  
  onYesClick(): any {
  
  }

  scrubberAllDetails(){
      if (this.allTable)
          this.allTable.destroy();
      this.scrubberAllClaims= this.scrubberAllCleanClaims.concat(this.scrubberAllErrorClaims);
      this.chRef.detectChanges();
      this.allTable = $('.allTable').DataTable({
          columnDefs: [
              { orderable: false, targets: -1 }
          ],
          language: {
              emptyTable: "No data available"
          }
      }); 

  }
  scrubberGetAllCleanClaims(){

this.prac=JSON.parse(localStorage.getItem('sp'));

if( localStorage.getItem('sp') === null){
  this.prac = {PracticeCode: '1010999'}
  this.prac = Number(this.prac['PracticeCode']);
}else{
  this.prac=JSON.parse(localStorage.getItem('sp'));
  this.prac= this.prac['PracticeCode'];
  this.prac= Number(this.prac); 
}


  this.API.PostData('/Scrubber/getAllCleanClaims?practiceCode='+ this.prac, this.prac,   data => {
    if (data.Status.toUpperCase() === 'SUCCESS') {
        if (this.clearTable)
            this.clearTable.destroy();
        this.scrubberAllCleanClaims = data.Response;
        this.scrubberAllDetails();
        this.chRef.detectChanges();
        this.clearTable = $('.clearTable').DataTable({
            columnDefs: [
                { orderable: false, targets: -1 }
            ],
            language: {
                emptyTable: "No data available"
            }
        });
    } else {
        swal('Failed', data.Status, 'error');
        this.clearTable = $('.clearTable').DataTable({
          columnDefs: [
              { orderable: false, targets: -1 }
          ],
          language: {
              emptyTable: "No data available"
          }
      });
        
    }
})
  
  }

  scrubberGetAllViolation(){

      
    this.prac=JSON.parse(localStorage.getItem('sp'));

    if( localStorage.getItem('sp') === null){
      this.prac = {PracticeCode: '1010999'}
      this.prac = Number(this.prac['PracticeCode']);
    }else{
      this.prac=JSON.parse(localStorage.getItem('sp'));
      this.prac= this.prac['PracticeCode'];
      this.prac= Number(this.prac); 
    }


    

      this.API.PostData('/Scrubber/getViolatedClaims?practiceCode='+ this.prac, this.prac,  data => {
          if (data.Status.toUpperCase() === 'SUCCESS') {
              if (this.errorTable)
                  this.errorTable.destroy();
              this.scrubberAllErrorClaims =[]
              
              var a=[]
              

              for(var res=0;res<data.Response.length;res++){
                console.log("this.scrubberAllErrorClaims",data.Response[res].ErrorMessage.split(','))
              a=data.Response[res].ErrorMessage.split(',')
              var b=''
              for(var i=0;i<a.length;i++){
                var z=a[i].trim()
                if(!b.includes(z) && z!=''){
                  b+= z+ ', '
                }
              }
              data.Response[res].ErrorMessage=b.replace(/,(?=\s*$)/, '')
              console.log("b",b.replace(/,(?=\s*$)/, ''))
              this.scrubberAllErrorClaims.push(data.Response[res])
              }


              
              
              this.scrubberAllDetails();
              this.chRef.detectChanges();
              this.errorTable = $('.errorTable').DataTable({
                  columnDefs: [
                      { orderable: false, targets: -1 }
                  ],
                  language: {
                      emptyTable: "No data available"
                  }
              });
          } else {
              swal('Failed', data.Status, 'error');
              this.errorTable = $('.errorTable').DataTable({
                columnDefs: [
                    { orderable: false, targets: -1 }
                ],
                language: {
                    emptyTable: "No data available"
                }
            });
          }
      }
  );
  }

  editClaim(claimNo, patientAccount, firstName, lastName) {
    this.router.navigate(['/Patient/Demographics/ClaimDetail/',
      Common.encodeBase64(JSON.stringify({
        Patient_Account: patientAccount,
        claimNo: claimNo,
        disableForm: false,
        PatientLastName: lastName,
        PatientFirstName: firstName
      }))]);
  }


}
