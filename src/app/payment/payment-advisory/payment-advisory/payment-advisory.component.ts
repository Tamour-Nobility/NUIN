import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { APIService } from '../../../components/services/api.service';
import { PaymentPostingComponent } from '../../payment-posting/payment-posting/payment-posting.component';
import { GvarsService } from '../../../services/G_vars/gvars.service';
import { PaymentServiceService } from '../../../services/payment-service.service';
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router';
import { PaymentsComponent } from '../../../Claims/Payments/payments.component';
import { ToastrService } from 'ngx-toastr';
import { ClaimCharges } from '../../../Claims/Classes/ClaimCharges'
import { Common } from '../../../services/common/common';
import { ClaimsPost,ClaimsPaymentDetailModel} from '../../models/payment-search-request.model';

@Component({
  selector: 'app-payment-advisory',
  templateUrl: './payment-advisory.component.html',
  styleUrls: ['./payment-advisory.component.css']
})
export class PaymentAdvisoryComponent implements AfterViewInit,OnInit{
  @Input() paymentDetail: any;
  @Output() onSelectPayment: EventEmitter<any> = new EventEmitter();
  searchForm: FormGroup;
  claimsData:any[]
  claimsNo:any;
  claimCharges: ClaimCharges[];
  patAccount:any;
  pervAmount:number;
  perPayments:number;
  patFName:any;
  Gindex:number=0;
  patLName:any;
  statuss:any;
  isPAyAdded:boolean=false
  postAmount:number=0;
  Balance:number=0;
  indexs:number=0;
  AddPaymentClaims:number[];
  list:number[];
  claimsPost:ClaimsPost
  claimsPaymentDetailModel:ClaimsPaymentDetailModel[]
  claimModalRef: BsModalRef;
  payModalRef:BsModalRef;
  @ViewChild(PaymentsComponent) pay;
  @ViewChild(PaymentPostingComponent) pat: PaymentPostingComponent;
  constructor(private modalService: BsModalService,public datepipe: DatePipe,public PC:PaymentServiceService,private API: APIService,private Gv: GvarsService,public router: Router,public toaster: ToastrService,) {
    this.claimsData=[]
    this.claimsPaymentDetailModel =[];

    this.claimsPost = new  ClaimsPost();
    this.list=[];
    this.AddPaymentClaims=[];
    this.searchForm = new FormGroup({
      CalimId: new FormControl('')
    }
    )

  }
  ngAfterViewInit(){
    this.claimsPaymentDetailModel[this.Gindex].claimPayments = this.pay.claimPaymentModel;
    console.log(this.pay.claimPaymentModel)
  }

  ngOnInit() {
    
  this.PC.paymentModel.subscribe(

    data=>{
      this.claimsPaymentDetailModel[this.Gindex].claimPayments=data;
    }
  )
debugger
  if(this.paymentDetail.Amount != undefined){
    this.Balance=Number(this.paymentDetail.Amount)-Number(this.paymentDetail.PostedAmount);
  }
  if(this.paymentDetail.PostedAmount != undefined){
    this.postAmount=Number(this.paymentDetail.PostedAmount);
  }

  this.clearFields();
  this.checkPostedClaims();
  }


close(){
  this.payModalRef.hide()
  let ndx=this.claimsPaymentDetailModel[this.indexs].claimPayments.length
  if(this.isPAyAdded == true){
    let ndx=this.claimsPaymentDetailModel[this.indexs].claimPayments.length
    this.claimsPaymentDetailModel[this.indexs].claimPayments[ndx-1].claimPayments.Amount_Paid=this.pervAmount
    return
  }
  this.claimsPaymentDetailModel[this.indexs].claimPayments[ndx-1].claimPayments.Amount_Paid=0
}

  searchByClaimId() {
   
    let calimId=Number(this.searchForm.value.CalimId)
    this.API.getData(`/Payments/GetClaimsSummary?ClaimId=${calimId}&practiceCode=${this.Gv.currentUser.selectedPractice.PracticeCode}`).subscribe(
      data => {
        if (data.Status === 'Sucess') {

          if(this.claimsData.length>0){
            for(let x=this.claimsData.length-1; x>=0; x--){

              if(this.claimsData[x].isPosted==null){
                if(data.Response[0].Claim_No==this.claimsData[x].Claim_No){
                  swal('Failed', 'ClaimNo cant be same', 'error');
                  return
                }
              }
          
        }
          }
      
        this.claimsData.push(...data.Response)
        } else {
          swal('Failed', data.Status);
        }
      });
   
  }
 public  clearFields(){
 
    this.claimsData=[]
    this.AddPaymentClaims=[]
    this.Gindex=0;
    this.isPAyAdded=false;
    this.claimsPaymentDetailModel=[];
    this.indexs=0;
  
  
}



checkPostedClaims(){
  this.API.getData(`/Payments/checkPostedClaims?batchno=${this.paymentDetail.BatchNo}&practiceCode=${this.Gv.currentUser.selectedPractice.PracticeCode}`).subscribe(
    data => {
      if (data.Status === 'Sucess') {

        this.claimsData.push(...data.Response)
       
      } else {
    
      }
    });
}
  onClick(firstName,lastName,pat_acc){
   
    const url = this.router.serializeUrl(
        this.router.createUrlTree(['/Patient/Demographics/Detail/',
        Common.encodeBase64(JSON.stringify({
            Patient_Account: pat_acc,
            PatientFirstName: firstName,
            PatientLastName: lastName,
            claimNo: 0,
            disableForm: true
        }))
    ])
      );
      const url_var = window.location.origin;
      const newurl= url_var +'/#'+ url
      window.open(newurl, '_blank');
   
  }
  onClaimV(firstName,lastName,pat_acc,claim_no){

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/Patient/Demographics/ClaimDetail/',
      Common.encodeBase64(JSON.stringify({
        Patient_Account: pat_acc,
        claimNo: claim_no,
        disableForm: true,
        PatientLastName: lastName,
        PatientFirstName: firstName
      }))])
    );

    const url_var = window.location.origin;
    const newurl= url_var +'/#'+ url
    window.open(newurl, '_blank');
    
  }
  editClaim(claimNo: number, PatientAccount: number,PatientLastName:any,PatientFirstName:any,template: TemplateRef<any>, index:number) {
    this.isPAyAdded = false;
 if(this.claimsPaymentDetailModel.length >0 ){
  this.claimsPaymentDetailModel.forEach((x, index) =>{
    if(x.claims_no == claimNo){
      this.isPAyAdded=true;
      var ndx=this.claimsPaymentDetailModel[index].claimPayments.length
      this.pervAmount=x.claimPayments[ndx-1].claimPayments.Amount_Paid;
      this.indexs=index;
      this.statuss='edit'
      this.payModalRef=this.modalService.show(template, { class: 'modal-lg' ,  backdrop : 'static',
      keyboard : false})
      
    
    }

  })
  
 }
    if(this.isPAyAdded!=false){
return
    }

      
    this.indexs=this.Gindex;
    this.claimsNo=claimNo;
    this.patAccount=PatientAccount;
    this.patFName=PatientFirstName;
    this.patLName=PatientLastName;
    this.statuss='add'
    this.API.getData(`/Payments/getClaimsDetails?claimNo=${claimNo}&patientaccount=${PatientAccount}`).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          this.claimsPaymentDetailModel[this.Gindex] = new ClaimsPaymentDetailModel()
          this.claimsPaymentDetailModel[this.Gindex]=data.Response
            this.claimsPaymentDetailModel[this.Gindex].claimPayments.forEach((item) => {
              item.claimPayments.Date_Entry = this.datepipe.transform(item.claimPayments.Date_Entry, 'MM/dd/yyyy');
              item.claimPayments.Date_Filing = this.datepipe.transform(item.claimPayments.Date_Filing, 'MM/dd/yyyy');
              item.claimPayments.DepositDate = this.datepipe.transform(item.claimPayments.DepositDate, 'MM/dd/yyyy');
              item.claimPayments.BATCH_DATE = this.datepipe.transform(item.claimPayments.BATCH_DATE, 'MM/dd/yyyy');
              item.claimPayments.isfromPosting=true;
          })

          if (this.claimsPaymentDetailModel[this.Gindex].claimCharges != null) {
            this.claimCharges = this.claimsPaymentDetailModel[this.Gindex].claimCharges;
            for (var x = 0; x < this.claimCharges.length; x++) {
                if (+this.claimCharges[x].claimCharges.Amount > 0 && +this.claimCharges[x].claimCharges.Units > 1)
                    this.claimCharges[x].amt = (+this.claimCharges[x].claimCharges.Amount / +this.claimCharges[x].claimCharges.Units) + "";
                else
                    this.claimCharges[x].amt = this.claimCharges[x].claimCharges.Amount;
                this.claimCharges[x].claimCharges.NDCList = this.claimsPaymentDetailModel[this.Gindex].claimCharges[x].claimCharges.NDCCodeList;
                this.claimsPaymentDetailModel[this.Gindex].claimCharges[x].claimCharges.DOE = this.datepipe.transform(this.claimsPaymentDetailModel[this.Gindex].claimCharges[x].claimCharges.DOE, 'MM/dd/yyyy');
                if (this.claimsPaymentDetailModel[this.Gindex].claimCharges[x].claimCharges.Dos_From != null) {
                    this.claimsPaymentDetailModel[this.Gindex].claimCharges[x].claimCharges.Dos_From = this.datepipe.transform(this.claimsPaymentDetailModel[this.Gindex].claimCharges[x].claimCharges.Dos_From, 'MM/dd/yyyy');
                }
                if (this.claimsPaymentDetailModel[this.Gindex].claimCharges[x].claimCharges.Dos_To != null) {
                    this.claimsPaymentDetailModel[this.Gindex].claimCharges[x].claimCharges.Dos_To = this.datepipe.transform(this.claimsPaymentDetailModel[this.Gindex].claimCharges[x].claimCharges.Dos_To, 'MM/dd/yyyy');
                }
            }
           
        }
      
       
          this.payModalRef=this.modalService.show(template, { class: 'modal-lg' ,  backdrop : 'static',
          keyboard : false})
           
          
        } else {
         
        }
      });
     
    
  }

  onOpenClaimModal(template: TemplateRef<any>) {
    this.claimModalRef = this.modalService.show(template, { class: 'modal-lg' ,   backdrop : 'static',
    keyboard : false})
  }
  receivedData(event:any[]){
    this.list=[];
    let filterList=[];
    let myVar=false

    event.forEach(x =>{
      if(this.claimsData.length>0){
        for(let i=this.claimsData.length-1; i>=0; i--){
          if(this.claimsData[i].isPosted==null){
            if(x.claimId==this.claimsData[i].Claim_No){
              myVar=true;
              
              
            }
          }
     

    }
      }
   
      filterList.push(x.claimId)
    }) 
   if(myVar !=false){
    swal('Failed', 'ClaimNo cant be same', 'error');
    return
   }

   this.list=filterList;
    console.log(this.list.join(","))

      this.API.getData(`/Payments/GetClaimsSummary?ClaimId=${this.list.join(",")}&practiceCode=${this.Gv.currentUser.selectedPractice.PracticeCode}`).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          
          this.claimsData.push(...data.Response)
          this.claimModalRef.hide()
         
        } else {
          swal('Failed', data.Status);
        }
      });
   

  
    
  }
  postClaims(){
 if(this.AddPaymentClaims.length ==0) {
  swal('Failed', "No Claim to Post.", 'error');
  return
 } 


 this.API.confirmFun('Confirmation', 'Posting '+this.AddPaymentClaims.length + 'claims ?', () => {
  this.claimsPost.batchNo=this.paymentDetail.BatchNo;   
  this.claimsPost.claimNo=this.AddPaymentClaims.join(",");
  this.claimsPost.postAmount=this.postAmount;
  console.log(this.claimsPost)
  this.API.PostData('/Payments/PostClaims', this.claimsPost, (response) => {
    if (response.Status == "Sucess") {
      this.toaster.success("Payments Post Successfuly", "Success");
      this.claimsPost=null;
      this.clearFields();
      this.AddPaymentClaims=[];
      this.onSelectPayment.emit({value:"post"})
      
    }
    else
      this.toaster.error(response.Response, response.Status)
  });

});
  

  }
  removePayment(indexs:number,claim_no:any){


    this.API.confirmFun('Confirmation', 'Do you want to remove claim ?', () => {
      this.claimsData.splice(indexs,1)

      if(this.claimsPaymentDetailModel.length>0){
        this.claimsPaymentDetailModel.forEach((c,index)=>{
          if(c.claims_no==claim_no){
            let ndx=this.claimsPaymentDetailModel[index].claimPayments.length
 
      this.Balance =Number(this.Balance)+ Number(this.claimsPaymentDetailModel[index].claimPayments[ndx-1].claimPayments.Amount_Paid);
    
      
      this.postAmount = Number(this.postAmount) - Number(this.claimsPaymentDetailModel[index].claimPayments[ndx-1].claimPayments.Amount_Paid);
          
           this.claimsPaymentDetailModel.splice(index,1)

           this.isPAyAdded=false;
           this.AddPaymentClaims.forEach((x,index) =>{
            if(x==claim_no){
              this.AddPaymentClaims.splice(index,1)
            }
           })
          }
        })
      }
    });

 
    
  }
 
  SaveClaimDetails(){


 
debugger
    if(this.isPAyAdded==true){
      
    let ndx=this.claimsPaymentDetailModel[this.indexs].claimPayments.length
    if(this.claimsPaymentDetailModel[this.indexs].claimPayments[ndx-1].claimPayments.Amount_Paid == null || this.claimsPaymentDetailModel[this.indexs].claimPayments[ndx-1].claimPayments.Amount_Paid == 0 ){
      swal('Failed', "Please Enter the Payment.", 'error'); 
      return
    }
     
    this.Balance=Number(this.pervAmount)+ Number(this.Balance)
    this.Balance =Number(this.Balance)- Number(this.claimsPaymentDetailModel[this.indexs].claimPayments[ndx-1].claimPayments.Amount_Paid);
      if(this.Balance < 0 ){
        this.Balance =Number(this.Balance)+ Number(this.claimsPaymentDetailModel[this.indexs].claimPayments[ndx-1].claimPayments.Amount_Paid);
        swal('Failed', "Amount paid can't be greated then Balance.", 'error');
        this.claimsPaymentDetailModel[this.indexs].claimPayments[ndx-1].claimPayments.Amount_Paid=0;
        return
      }
      this.postAmount=Number(this.postAmount)-Number(this.pervAmount);
      this.postAmount = Number(this.postAmount) + Number(this.claimsPaymentDetailModel[this.indexs].claimPayments[ndx-1].claimPayments.Amount_Paid);
      this.payModalRef.hide() 

    }

    let ndx=this.claimsPaymentDetailModel[this.Gindex].claimPayments.length
    
    if(this.claimsPaymentDetailModel[this.Gindex].claimPayments[ndx-1].claimPayments.Amount_Paid == null || this.claimsPaymentDetailModel[this.Gindex].claimPayments[ndx-1].claimPayments.Amount_Paid == 0 ){
      swal('Failed', "Please Enter the Payment.", 'error'); 

      return
    }

    this.PC.sendMessage('sentdata')
    this.claimsPaymentDetailModel[this.Gindex].claimCharges=this.claimCharges;
    this.claimsPaymentDetailModel[this.Gindex].claims_no=this.claimsPaymentDetailModel[this.Gindex].ClaimModel.Claim_No;
    this.claimsPaymentDetailModel[this.Gindex].patientAccount=this.claimsPaymentDetailModel[this.Gindex].ClaimModel.Patient_Account
    this.claimsPaymentDetailModel[this.Gindex].userID=this.Gv.currentUser.RolesAndRights[0].UserId
    this.claimsPaymentDetailModel[this.Gindex].practiceCode=this.Gv.currentUser.selectedPractice.PracticeCode
    this.claimsPaymentDetailModel[this.Gindex].batch_no=Number(this.paymentDetail.BatchNo)
    this.claimsPaymentDetailModel[this.Gindex].PostedAmount=this.postAmount;

    
    this.Balance =this.Balance- Number(this.claimsPaymentDetailModel[this.Gindex].claimPayments[ndx-1].claimPayments.Amount_Paid);
    if(this.Balance < 0 ){
      this.Balance=this.Balance+Number(this.claimsPaymentDetailModel[this.Gindex].claimPayments[ndx-1].claimPayments.Amount_Paid);
      swal('Failed', "Amount paid can't be greated then Balance.", 'error');
      this.claimsPaymentDetailModel[this.indexs].claimPayments[ndx-1].claimPayments.Amount_Paid=0;
      return
    }
    this.AddPaymentClaims.push(this.claimsPaymentDetailModel[this.Gindex].claims_no)
    this.postAmount = Number(this.postAmount) + Number(this.claimsPaymentDetailModel[this.Gindex].claimPayments[ndx-1].claimPayments.Amount_Paid);
    this.Gindex++;
console.log(this.claimsPaymentDetailModel)

this.payModalRef.hide()   
   
  }


  savePostPayments(){
    if(this.AddPaymentClaims.length ==0) {
      swal('Failed', "No Claim to Post.", 'error');
      return
    }
    this.API.confirmFun('Confirmation', 'Posting '+this.AddPaymentClaims.length + ' Claims ?', () => {
    this.claimsPaymentDetailModel[this.claimsPaymentDetailModel.length-1].PostedAmount=this.postAmount
    this.API.PostData('/Payments/SaveClaimsDetails', this.claimsPaymentDetailModel, (response) => {
      if (response.Status == "Sucess") {
        this.toaster.success("Payment Added Successfuly", "Success");
        this.claimsPost=null;
        this.clearFields();
        this.AddPaymentClaims=[];
        this.onSelectPayment.emit({value:"post"})
     
      }
      else{
        this.toaster.error(response.Response, response.Status)
      }
        
    });
  }
    )}
}