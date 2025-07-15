import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import {DataService} from '.././data.service'
import { APIService } from '../components/services/api.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
declare var $: any

@Component({
  selector: 'app-eligblity',
  templateUrl: './eligblity.component.html',
  styleUrls: ['./eligblity.component.css']
})
export class EligblityComponent implements OnInit {
  
 
  constructor( private dataService: DataService,private chRef: ChangeDetectorRef,private API: APIService,) { }
  pracTable: any;
  eligbilityDetails:any=[];
  benefitData:any=[];
  activeCoverage:any=[];
  coInsurance:any=[];
  coPayment:any=[];
  deductible:any=[];
  limitations:any=[];
  outOfPocket:any=[];
  nonCovered:any=[];
  primaryCareProvider:any=[];
  other:any=[];
  patientFirstName:any="";
  patientMiddleName:any="";
  patientLastName:any="";
  patientSex:any="";
  patientDateofBirth:any="";
  patientAddress:any="";
  patientCity:any="";
  patientState:any="";
  patientZip:any="";
  providerFirstName:any="";
  providerLastName:any="";
  eligibilityDate:any="";
  planBegin:any="";
  relationship:any="";
  date:any=[];
  benefitentity:any=[];
  allMedicalName:any=[];
  serviceTypeCode:any=[];
  tempVariable:any

  ngOnInit() {
    // $(function () {
    //   $('[data-toggle="tooltip"]').tooltip()
    // })

    this.API.getData(`/Demographic/GetServiceTypeCodesDescription`).subscribe(response => {
      console.log("My first api response",response);
      if(response.Status=="Success"){
        this.serviceTypeCode=response.Response;
        this.dividedJsonData();
      }
    });


    var eligibilityData= localStorage.getItem("mydata")
    console.log("my localStorage Data",eligibilityData)
   var obj= JSON.parse(eligibilityData);
    this.eligbilityDetails=[]
                this.eligbilityDetails.push(obj) ;
                console.log("my data response",this.eligbilityDetails)

    if(obj.eligibilityresponse.hasOwnProperty('dependent')){
          this.patientFirstName=this.eligbilityDetails[0].eligibilityresponse.dependent.patientname.first;
          this.patientMiddleName=this.eligbilityDetails[0].eligibilityresponse.dependent.patientname.middle;
          this.patientLastName=this.eligbilityDetails[0].eligibilityresponse.dependent.patientname.last;
          this.patientSex=this.eligbilityDetails[0].eligibilityresponse.dependent.sex;
          this.patientDateofBirth=this.eligbilityDetails[0].eligibilityresponse.dependent["date-of-birth"];
          this.patientDateofBirth=this.patientDateofBirth.slice(4, 6)+'-'+this.patientDateofBirth.slice(6, 8)+'-'+this.patientDateofBirth.slice(0, 4);
          this.patientAddress=this.eligbilityDetails[0].eligibilityresponse.dependent.patientname.patientaddress;
          this.patientCity=this.eligbilityDetails[0].eligibilityresponse.dependent.patientname.patientcity;
          this.patientState=this.eligbilityDetails[0].eligibilityresponse.dependent.patientname.patientstate;
          this.patientZip=this.eligbilityDetails[0].eligibilityresponse.dependent.patientname.patientzip;
          this.benefitData=this.eligbilityDetails[0].eligibilityresponse.dependent.benefit;
          if(this.eligbilityDetails[0].eligibilityresponse.dependent.hasOwnProperty('date')){
            
            if(this.eligbilityDetails[0].eligibilityresponse.dependent.date.length>0){
             for(let i=0;i<this.eligbilityDetails[0].eligibilityresponse.dependent.date.length;i++){
               let dateofservice =this.eligbilityDetails[0].eligibilityresponse.dependent.date[i]["date-of-service"]
               this.eligbilityDetails[0].eligibilityresponse.dependent.date[i]["date-of-service"]=dateofservice.slice(4, 6)+'-'+dateofservice.slice(6, 8)+'-'+dateofservice.slice(0, 4);
               this.date.push(this.eligbilityDetails[0].eligibilityresponse.dependent.date[i]);
             }
            }else{
             let dateofservice=this.eligbilityDetails[0].eligibilityresponse.dependent.date["date-of-service"];
               this.eligbilityDetails[0].eligibilityresponse.dependent.date["date-of-service"]=dateofservice.slice(4, 6)+'-'+dateofservice.slice(6, 8)+'-'+dateofservice.slice(0, 4);
               this.date.push(this.eligbilityDetails[0].eligibilityresponse.dependent.date)
            }
         }
          if(obj.eligibilityresponse.inforeceiver.hasOwnProperty('providername')){
            this.providerFirstName=this.eligbilityDetails[0].eligibilityresponse.inforeceiver.providername.first;
            this.providerLastName=this.eligbilityDetails[0].eligibilityresponse.inforeceiver.providername.last;
        }
  }
  if(obj.eligibilityresponse.subscriber.hasOwnProperty('benefit')){
          this.patientFirstName=this.eligbilityDetails[0].eligibilityresponse.subscriber.patientname.first;
          this.patientMiddleName=this.eligbilityDetails[0].eligibilityresponse.subscriber.patientname.middle;
          this.patientLastName=this.eligbilityDetails[0].eligibilityresponse.subscriber.patientname.last;
          this.patientSex=this.eligbilityDetails[0].eligibilityresponse.subscriber.sex;
          this.patientDateofBirth=this.eligbilityDetails[0].eligibilityresponse.subscriber["date-of-birth"];
          this.patientDateofBirth=this.patientDateofBirth.slice(4, 6)+'-'+this.patientDateofBirth.slice(6, 8)+'-'+this.patientDateofBirth.slice(0, 4);
          this.patientAddress=this.eligbilityDetails[0].eligibilityresponse.subscriber.patientname.patientaddress;
          this.patientCity=this.eligbilityDetails[0].eligibilityresponse.subscriber.patientname.patientcity;
          this.patientState=this.eligbilityDetails[0].eligibilityresponse.subscriber.patientname.patientstate;
          this.patientZip=this.eligbilityDetails[0].eligibilityresponse.subscriber.patientname.patientzip;
          if(this.eligbilityDetails[0].eligibilityresponse.subscriber.hasOwnProperty('date')){
            
             if(this.eligbilityDetails[0].eligibilityresponse.subscriber.date.length>0){
              for(let i=0;i<this.eligbilityDetails[0].eligibilityresponse.subscriber.date.length;i++){
                let dateofservice =this.eligbilityDetails[0].eligibilityresponse.subscriber.date[i]["date-of-service"]
                this.eligbilityDetails[0].eligibilityresponse.subscriber.date[i]["date-of-service"]=dateofservice.slice(4, 6)+'-'+dateofservice.slice(6, 8)+'-'+dateofservice.slice(0, 4);
                this.date.push(this.eligbilityDetails[0].eligibilityresponse.subscriber.date[i]);
              }
             }else{
              let dateofservice=this.eligbilityDetails[0].eligibilityresponse.subscriber.date["date-of-service"];
                this.eligbilityDetails[0].eligibilityresponse.subscriber.date["date-of-service"]=dateofservice.slice(4, 6)+'-'+dateofservice.slice(6, 8)+'-'+dateofservice.slice(0, 4);
                this.date.push(this.eligbilityDetails[0].eligibilityresponse.subscriber.date)
             }
          }
          
          
          this.benefitData=this.eligbilityDetails[0].eligibilityresponse.subscriber.benefit;
          if(obj.eligibilityresponse.subscriber.hasOwnProperty('relationship')){
            this.relationship=this.eligbilityDetails[0].eligibilityresponse.subscriber.relationship.relationshipcode;
          }
          if(obj.eligibilityresponse.inforeceiver.hasOwnProperty('providername')){
            this.providerFirstName=this.eligbilityDetails[0].eligibilityresponse.inforeceiver.providername.first;
            this.providerLastName=this.eligbilityDetails[0].eligibilityresponse.inforeceiver.providername.last;
        }
  }
  
    
  }
//   get data() :any{
//     return this.dataService.sharedData
// }


Tooltip() {
  this.tempVariable = $.trim($($("selectfgfgdfgdfgdfgdf")));
}

dividedJsonData(){
  console.log("benefit all data",this.benefitData)
  const keys = ['info', 'coveragelevel','servicetype','servicetypecode','time_period_qualifier','plancoveragedescription','quantity','quantityqualifier','percent','benefitamount'],
  filtered = this.benefitData.filter(
      (s => (o: { [x: string]: any; }) => 
          (k => !s.has(k) && s.add(k))
          (keys.map(k => o[k]).join('|'))
      )
      (new Set)
  );

console.log("new data",filtered);
this.benefitData=filtered;
  for(var i=0;i<this.benefitData.length;i++){
    // console.log("for loof data",this.benefitData[i])
    var coveragelevel=this.benefitData[i].hasOwnProperty('coveragelevel');
    var info=this.benefitData[i].hasOwnProperty('info');
    var servicetype=this.benefitData[i].hasOwnProperty('servicetype');
    var servicetypecode=this.benefitData[i].hasOwnProperty('servicetypecode');
    var time_period_qualifier=this.benefitData[i].hasOwnProperty('time_period_qualifier');
    var benefitamount=this.benefitData[i].hasOwnProperty('benefitamount');
    var yes_no_response_code=this.benefitData[i].hasOwnProperty('yes_no_response_code');
    var plannetworkindicator=this.benefitData[i].hasOwnProperty('plannetworkindicator');
    var quantity=this.benefitData[i].hasOwnProperty('quantity');
    var quantityqualifier=this.benefitData[i].hasOwnProperty('quantityqualifier');
    var message=this.benefitData[i].hasOwnProperty('message');
      if(info || coveragelevel || servicetype || servicetypecode || time_period_qualifier || benefitamount || yes_no_response_code || plannetworkindicator || quantity || message || quantityqualifier){
          
          if(this.benefitData[i].hasOwnProperty('servicetypecode')){
            this.benefitData[i].servicetypecode=this.benefitData[i].servicetypecode.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ',');
            var nameArr = this.benefitData[i].servicetypecode.split(',');
            var allMedicalValue=""
            for(var j=0;j<this.serviceTypeCode.length;j++){
              
              var serviceTypeCodeValue=this.serviceTypeCode[j]
              nameArr.forEach(myFunction);
              function myFunction(item) {
                var searchValue= item
               if(serviceTypeCodeValue.CODE==searchValue){
                // console.log("item",searchValue)
                allMedicalValue +=  serviceTypeCodeValue.DESCRIPTION+ ",";
                  // console.log("allMedicalName",allMedicalValue)
               }
             }
         
           }
           this.benefitData[i].servicetypecode= allMedicalValue.slice(0, -1);
           
          }
          if(!time_period_qualifier){
            this.benefitData[i].time_period_qualifier="";
          }
          if(!quantityqualifier){
            this.benefitData[i].quantityqualifier="";
          }

          if(!message){
            this.benefitData[i].message="No Info";
          }

          if(!this.benefitData[i].hasOwnProperty('quantity')){
            this.benefitData[i].quantity="";
          }
          if(this.benefitData[i].hasOwnProperty('benefitamount')){
            this.benefitData[i].benefitamount="$"+parseInt(this.benefitData[i].benefitamount).toLocaleString('en-US');
          }
          else{
            this.benefitData[i].benefitamount=""
          }
          if(this.benefitData[i].hasOwnProperty('percent')){
            this.benefitData[i].percent=parseFloat(this.benefitData[i].percent)*100 +" %";
          }
          else{
            this.benefitData[i].percent="";
          }
          
          if(this.benefitData[i].hasOwnProperty('plannetworkindicator')){
            switch(this.benefitData[i].plannetworkindicator) {
              case 'In Plan-Network':
                this.benefitData[i].plannetworkindicator="In-Network";
                break;
              case 'Out of Plan-Network':
                this.benefitData[i].plannetworkindicator="Out-Network";
                break;
            }
            
          }
        switch (this.benefitData[i].info) {
          case 'Active Coverage':
            this.activeCoverage.push(this.benefitData[i]);
            break;
          case 'Co-Insurance':
              this.coInsurance.push(this.benefitData[i]);
            break;
          case 'Co-Payment':
            this.coPayment.push(this.benefitData[i]);
            break;
          case 'Deductible':
            this.deductible.push(this.benefitData[i]);
            break;
          case 'Limitations':
            this.limitations.push(this.benefitData[i]);
            break;
          case 'Out of Pocket (Stop Loss)':
            this.outOfPocket.push(this.benefitData[i]);
            break;
          case 'Non-Covered':
            this.nonCovered.push(this.benefitData[i]);
            break;
          case 'Primary Care Provider':
            if(!this.benefitData[i].hasOwnProperty('benefitentity')){
              this.benefitentity=[]
            }else{
              if(this.benefitData[i].benefitentity.length>0){
                
                for(let b=0;b<this.benefitData[i].benefitentity.length;b++){

                  this.benefitentity.push(this.benefitData[i].benefitentity[b]);
                }
              }
              else{
                this.benefitentity.push(this.benefitData[i].benefitentity);
              }
            }
            
            
            
            if(this.benefitData[i].hasOwnProperty('coveragelevel')){
              this.primaryCareProvider.push(this.benefitData[i]);
            }
            break;
            default:
            this.other.push(this.benefitData[i]);
            break;
        }
      }
 
  }
  
  console.log("All Active Coverage Data",this.activeCoverage);
  console.log("All coInsurance Data",this.coInsurance);
  console.log("All deductible Data",this.deductible);
  console.log("All limitations Data",this.limitations);
  console.log("All Out of Pocket (Stop Loss) Data",this.outOfPocket);
  console.log("Primary Care Provider",this.primaryCareProvider);
  console.log("coPayment",this.coPayment);
  console.log("benefitentity",this.benefitentity);
  console.log("date dfgkhsdfjkghsdfjkgh",this.date);


// Code of Pagenation
  if (this.pracTable)
        this.pracTable.destroy();
   
    this.chRef.detectChanges();
    this.pracTable = $('.pracTable').DataTable({
        columnDefs: [
            { orderable: false, targets: -1 }
        ],
        language: {
            emptyTable: "No data available"
        }
    });
  //End Code of Pagenation  
  }
 
}
