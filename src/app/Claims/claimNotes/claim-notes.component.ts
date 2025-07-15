import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { APIService } from '../../components/services/api.service';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { Router, ActivatedRoute } from '@angular/router';
import { claimNotes } from '../Classes/claimNotes'
import { Subject } from 'rxjs';
declare var $: any
import 'datatables.net';
import { FormControl } from '@angular/forms';
import { stringify } from '@angular/core/src/util';
import * as moment from 'moment';

@Component({
  selector: 'app-claim-notes',
  templateUrl: './claim-notes.component.html',
  styleUrls: ['./claim-notes.component.css']
})
export class ClaimNotesComponent implements OnInit {
  public claimNotesModel: claimNotes;
  Response: any = [];
  public temp_var: Object = false;
  retPostData: string;
  btnMenu: number = 0;
  numbtncheck: number = 0;
  autochecknumber=0
  myDataTable: any;
  ediTable:any;
  EDIHistory:any=[];
  // tdClaimNotes: any;
  @Input() claimNo: number;
  isDisabled:boolean = false;
  constructor(private cd: ChangeDetectorRef, public router: Router, public route: ActivatedRoute, public API: APIService, public Gv: GvarsService) {
    this.claimNotesModel = new claimNotes;
    this.claimNotesModel.Response.Note_Id = 0;
    this.claimNotesModel.Response.Note_Detail = "";
    this.claimNotesModel.Response.Claim_Notes_Id = 0;
  }

  ngOnInit() {
    this.IsButtonDisable();
    this.get(this.autochecknumber);
    this.numbtncheck = 0;
  }
  get(Checkautonote: any) {
    const apiUrl = `/Demographic/GetClaimNotes?ClaimNo=${this.claimNo}&number=${Checkautonote || 0}`;
    this.API.getData(apiUrl).subscribe(data => {
      if (data.Status === 'Sucess') {
        if (this.myDataTable) {
          this.cd.detectChanges();
          this.myDataTable.destroy();
        }
      }
      this.Response = data;
      this.temp_var = true;
      // 🔐 Safe check before destroying again
      if (this.myDataTable) {
        this.myDataTable.destroy();
      }
      this.cd.detectChanges();
      this.myDataTable = $('.myDataTable').DataTable({
        language: {
          emptyTable: "No data available"
        },
        order:[]
      });
    });
  }
  

  getUserManualNotes(){
    this.API.getData('/Demographic/GetClaimNotes?ClaimNo=' + this.claimNo).subscribe(
      data => {
        if (data.Status == 'Sucess') {
          if (this.myDataTable) {
            this.cd.detectChanges();
            this.myDataTable.destroy();
          }
        }
        this.Response = data;
        this.temp_var = true;
        this.myDataTable.destroy();
        this.cd.detectChanges();
        this.myDataTable = $('.myDataTable').DataTable({
          language: {
            emptyTable: "No data available"
          }
        });
      }
    );
  }

  ediHistoryDetail(){
    var claimNo =this.claimNo.toString();
    this.API.PostData(`/Demographic/ShowPacket277CAClaimReason?claimNo=${claimNo}` , claimNo,(data)=>{
          if (data.Status=== 'Success') {
              if (this.ediTable) {
                this.cd.detectChanges();
                this.ediTable.destroy();
            }
            if(data.Response!=null && data.Response.length!=0 && data.Response[0].Submit_Date==''){
              this.EDIHistory = data.Response;
            this.cd.detectChanges();
            const table: any = $('.ediTable');
            this.ediTable = table.DataTable({
                columnDefs: [
                    { orderable: false, }
                ],
                language: {
                    emptyTable: "Claim not submitted - No data available"
                }
            });
            }
            else{
              this.EDIHistory = data.Response;
              this.cd.detectChanges();
              const table: any = $('.ediTable');
              this.ediTable = table.DataTable({
                  columnDefs: [
                      { orderable: false, }
                  ],
                  language: {
                      emptyTable: "No data available"
                  }
              });
            }
            
          } else {
              swal('Failed', data.Status, 'error');
              this.ediTable = $('.ediTable').DataTable({
                columnDefs: [
                    { orderable: false, }
                ],
                language: {
                    emptyTable: "No data available"
                }
            });
              
          }
    })
  }
  refresh() {
    this.cd.detectChanges();
  }
  resetFields() {
    this.claimNotesModel = new claimNotes;
  }
  getClaimNote(ID) {
    this.numbtncheck = 2;
    this.API.getData('/Demographic/GetClaimNote?ClaimNotesId=' + ID).subscribe(
      data => {
        this.claimNotesModel.Response = data.Response;
        this.refresh();
      }
    );
  }
  ClosePage() {
    this.API.confirmFun('Do you want to close this Patient Form?', '', () => {
      this.router.navigate(['/PatientSearch'])
    });
  }
  saveClaimNotes() {
    if (this.claimNo == 0 || this.claimNo == null || this.claimNo == undefined)
    {
      return swal('Error', 'Save the claim first.', 'error');
    }
    if ($.trim(this.claimNotesModel.Response.Note_Detail) == "") {
      return swal('Error', 'Please enter any notes.', 'info');
    }
    this.claimNotesModel.Response.Claim_No = this.claimNo;
    this.claimNotesModel.Response.IsAuto_Note=false;
    this.claimNotesModel.Status = "OK";
    this.API.PostData('/Demographic/SaveClaimNotes/', this.claimNotesModel.Response, (d) => {
      if (d.Status == "Sucess") {
        swal('', 'Notes has been saved', 'success');
        //this.myDataTable.destroy();
        this.claimNotesModel.Response.Note_Detail=""
        this.claimNotesModel.Response.Claim_Notes_Id=0;
        this.get(2);
      }
      else {
        this.retPostData = d;
        swal({
          type: 'error',
          title: 'Error',
          text: this.retPostData,
          footer: ''
        })
      }
    })
  }
  checkStatus(numCheck: number) {
    this.numbtncheck = numCheck;
    this.autochecknumber=numCheck;
    this.refresh();
    if (numCheck == 0 || numCheck == 2) {
      this.get(numCheck);
    }
    if (numCheck == 1) {
      this.ediHistoryDetail();
    }
  }
  IsButtonDisable(){
     this.isDisabled= this.Gv.IsbuttonDisable();
    }

    IsEditable(detail:string,isAutoNote: boolean , createdDate,createdby)
    {
      if(createdby != this.Gv.currentUser.userId)
       {
        isAutoNote = true;
       }
      if (createdDate) {
        const currentDate = new Date();
        const createdDateObj = new Date(createdDate); 
        const timeDifference = currentDate.getTime() - createdDateObj.getTime();
        const hoursDifference = timeDifference / (1000 * 3600); 
        if (hoursDifference >= 24) {
          isAutoNote = true;
        }
        let res=  detail.includes('[Auto Note]') || isAutoNote ;
      return  res;
       }
    }
}
