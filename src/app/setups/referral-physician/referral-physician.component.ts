import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { APIService } from '../../components/services/api.service';


@Component({
  selector: 'app-referral-physician',
  templateUrl: './referral-physician.component.html',
  styleUrls: ['./referral-physician.component.css']
})
export class ReferralPhysicianComponent implements OnInit {
  count = 10;
  pattern = "";
  physicians : any;
  totalResults = 0;
  totalPages = 0;
  currentPage = 1;
  dataTable: any;
  filteredRecords: any;
  constructor(private apiService:APIService, private toastr: ToastrService, private router:Router) { }

  ngOnInit() {
    this.listPhysicians(this.currentPage,this.pattern);
  }

  countValueChanged(e){
    this.count = e.target.value;
    this.currentPage = 1;
    this.listPhysicians(this.currentPage, this.pattern);
  }

  listPhysicians(page,pattern){
    this.apiService.getData('/ReferralPhysicians/GetReferralPhysicians?page='+ page + '&count=' + this.count + '&pattern=' + pattern)
      .subscribe(
        data => {
          if (data.Status === "success") {
            this.physicians = data.Response.data;
            this.totalResults = data.Response.TotalRecords;
            this.currentPage = data.Response.CurrentPage;
            this.filteredRecords = data.Response.FilteredRecords;
            this.totalPages = Math.ceil(this.totalResults / this.count);
          }
        },
        error => {
          this.toastr.error("some error occured");
          console.error('An error occurred:', error);
        }
      );
  }

  onChangeActiveToggle(element){
    this.apiService.PostData('/ReferralPhysicians/ChangeActiveStatus?refCode=' + element.Referral_Code, {}, (response) => {
      if (response.Status === 'success') {
        this.toastr.success(response.Response);
        swal('Provider', 'Provider status has been changed successfully.', 'success');
        this.currentPage = 1;
        this.pattern = "";
      } else {
        this.toastr.error(response.Response);
      }
      this.listPhysicians(this.currentPage, this.pattern);
    });
  }

  onEdit(refCode){
    this.router.navigateByUrl('referral-physician/'+ refCode +'/edit');
  }
  onView(refCode){
    this.router.navigateByUrl('referral-physician/'+ refCode +'/view');
  }
  onDelete(element){
    const userConfirmed = window.confirm('The referral physician will be deleted. Continue?');
    if (userConfirmed) {
      this.apiService.PostData('/ReferralPhysicians/ChangeDeleteStatus?refCode=' + element.Referral_Code, {}, (response) => {
        if (response.Status === 'success') {
          this.toastr.success('Referral physician has been deleted successfully.', 'Success');
          this.currentPage = 1;
          this.pattern = "";
          this.listPhysicians(this.currentPage, this.pattern);
        } else {
          this.toastr.error('Failure to add detail', 'Error');
        }
      });
    }
  }


  applySearch(e) {
    setTimeout(() => {
      this.pattern = e.target.value;
      this.currentPage = 1;
      this.listPhysicians(this.currentPage,this.pattern);
    }, 1000)
  }

  

  formatDate(date){
    const momentDate = moment(date);
    if (momentDate.isValid()) {
      return momentDate.format('DD.MM.YYYY');
    } else {
      return '-';
    }
  }

  onPageChange(event) {
    this.currentPage = event;
    this.listPhysicians(this.currentPage, this.pattern);
  }

  loadNextPage(){ 
    if (this.currentPage < this.totalPages){ 
      let page = this.currentPage + 1;
      this.listPhysicians(page, this.pattern);
    } 
  } 
  loadPreviousPage(){ 
    if (this.currentPage > 1){
      let page = this.currentPage - 1;
      this.listPhysicians(page, this.pattern);
    } 
  }

  routeTo(){
    this.router.navigateByUrl('referral-physician/new/add');
  }

  ActiveInactiveProvider(element) {
    this.apiService.confirmFun('Confirmation', `Are you sure you want to ${!element.In_Active ? 'Deactivate' : 'activate'} this physician?`, () => {
      this.apiService.PostData('/ReferralPhysicians/ChangeActiveStatus?refCode=' + element.Referral_Code, {}, (response) => {
      console.log(response);
      if (response.Status === 'success') {
        this.toastr.success(response.Response);
        swal('Physician', 'Physician status has been changed successfully.', 'success');
        this.currentPage = 1;
        this.pattern = "";
      } else {
        this.toastr.error(response.Response);
      }
      this.listPhysicians(this.currentPage, this.pattern);
      });  
    });
  }

  getStatusBtn(element){
    if (element.In_Active == true){
      return 'Activate';
    }else{
      return 'Deactivate';
    }
  }
}


