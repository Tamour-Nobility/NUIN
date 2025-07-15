import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  ProviderCptPlan, ProviderCptPlan_Details, Practice, Post_ProviderCptPlan,
  check_providercptinformation, get_providercptinformation
} from '../fee-schedule-model';
import { APIService } from '../../components/services/api.service';
import { Common } from '../../services/common/common';
import { Revenue_Codes } from '../../Claims/Classes/ClaimAssignee';
import { ClaimService } from '../../services/claim/claim.service';
import { GvarsService } from '../../services/G_vars/gvars.service';

@Component({
  selector: 'app-provider-cptfee-schedule-temp',
  templateUrl: './provider-cptfee-schedule-temp.component.html',
  styleUrls: ['./provider-cptfee-schedule-temp.component.css']
})
export class ProviderCptfeeScheduleTempComponent implements OnInit {
  nSelectedRow: number = 0;
  billingtype:boolean=true;
  dtProviderCPTFee: any;
  dtProviderDetailCPTFee: any;
  listProviderCPTFee: ProviderCptPlan[];
  listCPTDetail: ProviderCptPlan_Details[];
  listPractice: Practice[];
  ddlPracticeCode: String | number = 0;
  showPlanTable: boolean = false;
  isNewCPT: boolean;
  isNewCPT2: boolean;
  RevenueCode:Revenue_Codes;
  RevenueCodes:Revenue_Codes[];
  ProviderCptPDetailsModel: ProviderCptPlan_Details;
  postproviderplancpt: Post_ProviderCptPlan;
  check_info: check_providercptinformation;
  get_information: get_providercptinformation[];
  Provider_Code: number = 0;
  Checkpraccode:any;

  public providercode:Array<number>=[];
  public location_code: Array<number>=[];
  public Location_State:  Array<string>=[];
  public provid_FName:  Array<string>=[];
  public provid_LName: Array<string>=[];
  //public Name: Array<string>=[];
  

  constructor(private chRef: ChangeDetectorRef, private claimService: ClaimService,
    public GV: GvarsService,
    public API: APIService) {
      this.RevenueCodes=[]
    this.listProviderCPTFee = [];
    this.listPractice = [];
    this.listCPTDetail = [];
    this.get_information = [];
    this.RevenueCode=new Revenue_Codes();

    

    if(this.GV.currentUser.selectedPractice.Billing_Type==null ||this.GV.currentUser.selectedPractice.Billing_Type=="Professional" )
  
  {
    this.billingtype=false;
  }
  
  }

  ngOnInit() {
    this.getPractice();
  }

  selectRow(ndx: number) {
    this.nSelectedRow = ndx;
  }

  fillCPTDetails(Provider_Cpt_Plan_Id: any) {
    this.getCPTDetails(Provider_Cpt_Plan_Id);
  }

  getAgingSummaryReport(PracticeCode: any) {
    this.API.getData('/Setup/GetProviderFeeSchedule?PracticeCode=' + PracticeCode).subscribe(
      d => {
        if (d.Status == "Sucess") {
          debugger;
          if (this.dtProviderCPTFee) {
            this.dtProviderCPTFee.destroy();
          }
          this.listProviderCPTFee = d.Response;
          this.chRef.detectChanges();
          this.dtProviderCPTFee = $('.dtProviderCPTFee').DataTable({
            language: {
              emptyTable: "No data available"
            }
          });
        }
        else {
          swal('Failed', d.Status, 'error');
        }
        if (this.dtProviderDetailCPTFee) {
          this.dtProviderDetailCPTFee.destroy();
        }
        this.listCPTDetail = [];
        this.chRef.detectChanges();
        this.dtProviderDetailCPTFee = $('.dtProviderDetailCPTFee').DataTable({
          language: {
            emptyTable: "No data available"
          }
        });

      })
  }
  getPractice() {
    this.API.getData('/Setup/GetPracticeList').subscribe(
      d => {
        if (d.Status == "Sucess") {
          this.listPractice = d.Response;
          this.listPractice = this.listPractice.map(practice => {
            return {
                ...practice,  // Keep all existing properties
                PracticeLabel: `${practice.Id} | ${practice.Name}`  // Add new combined property
              };
             });
          this.ddlPracticeCode = 0;
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }
  onchangePractice(selectedPracticeCode?: any) {
    if(selectedPracticeCode!=0)
      {
        let practiceCode=selectedPracticeCode
        if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
          const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
          practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
        }
        this.Checkpraccode=practiceCode
      }
    if (this.Checkpraccode == undefined || this.Checkpraccode == null || this.Checkpraccode == 0) {
      swal('Failed', "Please Select Practice", 'error');
      return;
    }
    this.get_information=[];
    this.provid_FName=[];
    this.provid_LName=[];
    this.providercode=[];
    this.location_code=[];
    this.Location_State=[];
    this.isNewCPT = false;
    this.isNewCPT2 = false;
    this.getAgingSummaryReport(this.Checkpraccode);
  }

  getCPTDetails(ProviderCPTPlanId: any) {
    if (ProviderCPTPlanId == undefined || ProviderCPTPlanId == null || ProviderCPTPlanId == 0)
      return;
    this.showPlanTable = true;
    this.isNewCPT = false;
    this.API.getData('/Setup/GetProviderPlanDetails?ProviderCPTPlanId=' + ProviderCPTPlanId).subscribe(
      d => {
        if (d.Status == "Sucess") {
          if (this.dtProviderDetailCPTFee) {
            this.dtProviderDetailCPTFee.destroy();
          }
          this.listCPTDetail = d.Response;
          debugger
          this.chRef.detectChanges();
          this.dtProviderDetailCPTFee = $('.dtProviderDetailCPTFee').DataTable({
            language: {
              emptyTable: "No data available"
            }
          });
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }

  //Backend_Team


  addNewProviderCptPlan(e: any) {
    let practiceCode=this.ddlPracticeCode
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    this.isNewCPT2 = true;
    this.postproviderplancpt = new Post_ProviderCptPlan();
    this.check_info = new check_providercptinformation();
    this.get_information=[];
    this.postproviderplancpt.Cpt_Plan = "CUSTM";
    this.postproviderplancpt.Provider_Code = 0;
    this.postproviderplancpt.Percentage_Higher = 0;
    this.postproviderplancpt.Facility_Code = 0;
    this.postproviderplancpt.InsPayer_Id = 0;
    this.postproviderplancpt.Practice_Code = practiceCode;
    this.getpracticeinfo_ForCPTPlan(practiceCode);

    $('.dtProviderCPTFee tr:last').after($('#cpt'));
    $('.dtProviderCPTFee tr:last').after($('#cptTr'));
  }

  getpracticeinfo_ForCPTPlan(Practicecode: any) {
    this.API.getData('/Setup/getpracticeinformationforcptplan?Practicecode=' + Practicecode).subscribe(
      data => {
        if (data.Status == "Success") {
          this.get_information = data.Response;
          this.location_code= [...new Set(this.get_information.map(item => item['location_code']))];
          this.Location_State= [...new Set(this.get_information.map(item => item['Location_State']))];
          //this.provid_FName=  [...new Set(this.get_information.map(item => item['provid_FName']))];
         // this.provid_LName=[...new Set(this.get_information.map(item => item['provid_LName']))];
          this.providercode=[...new Set(this.get_information.map(item => item['Provider_Code']))];
        }
        else {
          swal('Failed', data.Status, 'error');
        }
      });
  }

  SetProvider(value: any) {
    this.postproviderplancpt.Provider_Code = value;
  }

  SetInsstate(value: any) {
    this.postproviderplancpt.Insurance_State = value;
  }

  Setlocationcode(value: any) {
    this.postproviderplancpt.Location_Code = value;
  }
  Setselfpay(value:any){
    this.postproviderplancpt.self_pay = value;
  }

  saveNewProviderCptPlan(model: Post_ProviderCptPlan) {
    if (this.canSaveNewProviderCptPlan()) {
      model.Provider_Cpt_Plan_Id = "0";
      model.Cpt_Plan = "CUSTM";
      model.Facility_Code = 0;
      model.Percentage_Higher = 0;
      model.InsPayer_Id = 0;
      this.check_info.Practice_Code = model.Practice_Code;
      this.check_info.Provider_Code = model.Provider_Code;
      this.check_info.Location_Code = model.Location_Code;
      this.check_info.Location_State = model.Insurance_State;
      this.API.PostData('/Setup/checkproviderFeeinformation', this.check_info, (result) => {
        if (result.Status == "Success") {
          this.API.PostData('/Setup/PostproviderFeeSchedule', model, (result) => {
            if (result.Status == "Success") {
              this.getAgingSummaryReport(model.Practice_Code);
              swal('Success', result.Status, 'success');
              this.get_information=[];
              this.provid_FName=[];
              this.provid_LName=[];
              this.providercode=[];
              this.location_code=[];
              this.Location_State=[];
              this.isNewCPT2 = false;
            }else if(result.Status == "dup"){
              swal('Failed',"Duplication error" , 'error');
            }
            else {
              swal('Failed', result.Status, 'error');
            }
          });
        }
        else {
          swal('Failed', result.Status, 'error');
        }
      });
    }
    else{
      swal('Failed', "ERROR Fields are missing", 'error');
    }
  }
  canSaveNewProviderCptPlan() {
    if (Common.isNullOrEmpty(this.postproviderplancpt.Provider_Code)) {
      swal('Validation Error', 'Provider Code is Missing', 'error');
      return;
    }
    else if (Common.isNullOrEmpty(this.postproviderplancpt.Insurance_State)) {
      swal('Validation Error', 'Insurance_State is Missing', 'error');
      return;
    }
    else if (Common.isNullOrEmpty(this.postproviderplancpt.Location_Code)) {
      swal('Validation Error', 'Location_Code is Missing', 'error');
      return;
    }
    else if (Common.isNullOrEmpty(this.postproviderplancpt.Cpt_Plan)) {
      swal('Validation Error', 'Cpt_Plan is Missing', 'error');
      return;
    }
    else if (Common.isNullOrEmpty(this.postproviderplancpt.self_pay)) {
      swal('Validation Error', 'self_pay is Missing', 'error');
      return;
    }

    else {
      return true;
    }
  }
  onCanclenewprovidercptplan() {
    this.isNewCPT2 = false;
  }
  addNewCPT(e: any) {
    this.isNewCPT = true;
    this.ProviderCptPDetailsModel = new ProviderCptPlan_Details();
    this.ProviderCptPDetailsModel.Provider_Cpt_Plan_Id = this.listProviderCPTFee[this.nSelectedRow].Provider_Cpt_Plan_Id;
    $('.dtProviderCPTFee tr:last').after($('#cpt'));
    $('.dtProviderCPTFee tr:last').after($('#cptTr'));
  }
  onKeypressRevenue(event: any){
    if (event.key == "Enter" || event.key == "Tab") {
      let pRevenueCode = event.target.value;
      if(pRevenueCode){
        this.API.getData('/Setup/GetRevenueCodes?Code=' + pRevenueCode).subscribe(
          d => {
            if (d.Status == "Success") {
              this.RevenueCode = d.Response;
              this.ProviderCptPDetailsModel.Revenue_Description=this.RevenueCode.description;
            }
            else {
              swal('Invalid Revenue Code', d.Status, 'error');

            }
          }
        )
      }
    }
  }
  
  onKeypressCpt(event: any) {
    if (event.key == "Enter" || event.key == "Tab") {
      let pCPTCode = event.target.value;
     // this.checkCPTDuplicate(pCPTCode, this.ProviderCptPDetailsModel.Provider_Cpt_Plan_Id);
      if (pCPTCode) {
        this.API.getData('/Setup/GetDescriptionByCPT?ProviderCPTPCode=' + pCPTCode).subscribe(
          d => {
            if (d.Status == "Sucess") {
              if (this.ProviderCptPDetailsModel.Cpt_Description) {
                this.ProviderCptPDetailsModel.Cpt_Description = '';
              }
              this.ProviderCptPDetailsModel.Cpt_Description = d.Response.Cpt_Description;
              this.ProviderCptPDetailsModel.Alternate_Code = d.Response.Alternate_Code;
              console.log("Alternate_Code onKeypressCpt", d.Response);
            }
            else {
              swal('Failed', d.Status, 'error');
            }
          }
        )
      }
    }
  }

   //.. Added by Pir Ubaid - CPT With Multiple Description
   onKeypressAlternateCode(event: any) {
    if (event.key == "Enter" || event.key == "Tab") {
      let pAlternateCode = event.target.value;
      let pCPTPlanId =  this.ProviderCptPDetailsModel.Provider_Cpt_Plan_Id;
      this.checkAlternateCodeDuplicate(pAlternateCode,pCPTPlanId);
      if (pAlternateCode) {
        this.API.getData('/Setup/GetByAlternateCode?AlternateCode=' + pAlternateCode + '&&ProviderCPTPlainId=' + pCPTPlanId).subscribe(
          d => {
            if (d.Status == "Sucess") {
              if (this.ProviderCptPDetailsModel.Cpt_Description) {
                this.ProviderCptPDetailsModel.Cpt_Description = '';
              }
              this.ProviderCptPDetailsModel.Cpt_Description = d.Response.Cpt_Description;
              this.ProviderCptPDetailsModel.Cpt_Code = d.Response.Cpt_Code;
              console.log("Alternate_Code onKeypressAlternateCode", d.Response);
            }
            else {
              swal('Failed', d.Status, 'error');
              this.ProviderCptPDetailsModel.Alternate_Code = '';
            }
          }
        )
      }
    }
   }

   
   //..

  // checkCPTDuplicate(pCPTCode: string, pCPTPlanId: string) {
  //   if (pCPTCode && pCPTPlanId) {
  //     this.API.getData('/Setup/CheckDuplicateCPT?ProviderCPTCode=' + pCPTCode + '&&ProviderCPTPlainId=' + pCPTPlanId).subscribe(
  //       d => {
  //         if (d.Status == "Duplicate") {
  //           swal('Validation', 'CPT already exists', 'warning');
  //           this.ProviderCptPDetailsModel.Cpt_Code = '';
  //           this.ProviderCptPDetailsModel.Cpt_Description = '';
  //         }
  //       }
  //     );
  //   }
  // }
  checkCPTDuplicate(pCPTCode: string, pCPTPlanId: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (pCPTCode && pCPTPlanId) {
        this.API.getData('/Setup/CheckDuplicateCPT?ProviderCPTCode=' + pCPTCode + '&&ProviderCPTPlainId=' + pCPTPlanId).subscribe(
          d => {
            if (d.Status === "Duplicate") {
              if (!this.ProviderCptPDetailsModel.Alternate_Code || this.ProviderCptPDetailsModel.Alternate_Code.trim() === '') {
                // Only reset Cpt_Code and show error if Alternate_Code is not provided
                this.ProviderCptPDetailsModel.Cpt_Code = '';
              swal('Validation', 'CPT already exists', 'warning');
              this.ProviderCptPDetailsModel.Cpt_Code = '';
              this.ProviderCptPDetailsModel.Cpt_Description = '';
              resolve(false);  // Duplicate found
            }else {
              // If Alternate Code exists, do not reset Cpt_Code and proceed
              resolve(true);
            }
          }
             else {
              resolve(true);  // No duplicate found
            }
          }
        );
      } else {
        resolve(true);  // No need to check if either value is missing
      }
    });
  }

  // saveCPT(model: ProviderCptPlan_Details) {
  //   debugger
  //   if (this.canSaveCPT(model)) {
  //     this.API.PostData('/Setup/PostProviderCptPlanDetails', model, (result) => {
  //       if (result.Status == "Success") {
  //         swal('Success', 'CPT Added', 'success');
  //         this.getCPTDetails(model.Provider_Cpt_Plan_Id);
  //         this.isNewCPT = false;
  //.. Added by Pir Ubaid - CPT With Multiple Description
  checkAlternateCodeDuplicate(AlternateCode: string, pCPTPlanId: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (AlternateCode && AlternateCode.trim() !== '') {
        this.API.getData('/Setup/CheckDuplicateAlternateCode?AlternateCode=' + AlternateCode + '&&ProviderCPTPlainId=' + pCPTPlanId).subscribe(
          d => {
            if (d.Status === "Duplicate") {
              swal('Validation', 'Alternate Code already exists', 'warning').then(() => {
                this.ProviderCptPDetailsModel.Alternate_Code = '';  // Clear the duplicate Alternate_Code
                resolve(false);  // Duplicate found, validation failed
                return;
              });
            } else {
              resolve(true);  // No duplicate found, validation passed
            }
          },
          error => {
            console.error('Error checking Alternate Code duplicate:', error);
            resolve(false);  // Handle error case, prevent submission
          }
        );
      } else {
        // If AlternateCode is empty or null, resolve as valid
        resolve(true);  // Assumes empty code is valid for now
      }
    });
  }
  
  

  //..

  // saveCPT(model: ProviderCptPlan_Details) {
  //   if (this.canSaveCPT(model)) {
  //     this.API.PostData('/Setup/PostProviderCptPlanDetails', model, (result) => {
  //       if (result.Status == "Success") {
  //         swal('Success', 'CPT Added', 'success');
  //         this.getCPTDetails(model.Provider_Cpt_Plan_Id);
  //         this.isNewCPT = false;
  //       }
  //     });
  //   }
  // }
  // async saveCPT(model: ProviderCptPlan_Details) {
  //   const pCPTCode = model.Cpt_Code;  // Getting the CPT code from the model
  //   const pCPTPlanId = model.Provider_Cpt_Plan_Id;
  
  //   const isNotDuplicate = await this.checkCPTDuplicate(pCPTCode, pCPTPlanId);
    
  //   if (isNotDuplicate && this.canSaveCPT(model)) {
  //     this.API.PostData('/Setup/PostProviderCptPlanDetails', model, (result) => {
  //       if (result.Status === "Success") {
  //         swal('Success', 'CPT Added', 'success');
  //         this.getCPTDetails(model.Provider_Cpt_Plan_Id);
  //         this.isNewCPT = false;
  //       }
  //     });
  //   }
  // }
  // async saveCPT(model: ProviderCptPlan_Details) {
  //   debugger
  //   debugger
  //   const pCPTCode = model.Cpt_Code;  // Getting the CPT code from the model
  //   const pCPTPlanId = model.Provider_Cpt_Plan_Id;
  //   const pAlternateCode = model.Alternate_Code;  // Getting the Alternate Code from the model
  
  //   const isNotDuplicate = await this.checkCPTDuplicate(pCPTCode, pCPTPlanId);
  //   const isAlternateCodeDuplicate =await this.checkAlternateCodeDuplicate(pAlternateCode);
    
  //   // If it's not a duplicate or the Alternate Code is provided, proceed with saving
  //   // if (isNotDuplicate ||isAlternateCodeDuplicate || (pAlternateCode && pAlternateCode.trim() !== '')) 
  //   if (isNotDuplicate && (isAlternateCodeDuplicate || (pAlternateCode && pAlternateCode.trim() !== '')))
  //   {
  //     if (this.canSaveCPT(model)) {
  //       this.API.PostData('/Setup/PostProviderCptPlanDetails', model, (result) => {
  //         if (result.Status === "Success") {
  //           swal('Success', 'CPT Added', 'success');
  //           this.getCPTDetails(model.Provider_Cpt_Plan_Id);
  //           this.isNewCPT = false;
  //         }
  //       });
  //     }
  //   } else {
  //     // If there is a duplicate CPT and Alternate Code is null or empty, show an error
  //     swal('Validation', 'CPT already exists, and Alternate Code is required.', 'warning');
  //   }
  // }



  // async saveCPT(model: ProviderCptPlan_Details) {
  //   debugger;
  //   const pCPTCode = model.Cpt_Code;  // Getting the CPT code from the model
  //   const pCPTPlanId = model.Provider_Cpt_Plan_Id;
  //   const pAlternateCode = model.Alternate_Code;  // Getting the Alternate Code from the model
  
  //   try {
  //     // Await both validation checks
  //     const isNotDuplicate = await this.checkCPTDuplicate(pCPTCode, pCPTPlanId);
  //     const isAlternateCodeValid = await this.checkAlternateCodeDuplicate(pAlternateCode);
  
  //     // Proceed with saving only if both validations pass
  //     if (isNotDuplicate && isAlternateCodeValid) {
  //       if (this.canSaveCPT(model)) {
  //         this.API.PostData('/Setup/PostProviderCptPlanDetails', model, (result) => {
  //           if (result.Status === "Success") {
  //             swal('Success', 'CPT Added', 'success');
  //             this.getCPTDetails(model.Provider_Cpt_Plan_Id);
  //             this.isNewCPT = false;
  //           } else {
  //             swal('Error', 'Failed to add CPT', 'error');
  //           }
  //         });
  //       }
  //     } else {
  //       // Handle validation errors
  //       // if (!isNotDuplicate) {
  //       //   swal('Validation', 'CPT already exists.', 'warning');
  //       // }
  //       // if (!isAlternateCodeValid) {
  //       //   // This block should not normally be reached because checkAlternateCodeDuplicate handles its own validation
  //       //   swal('Validation', 'Alternate Code validation failed.', 'warning');
  //       // }
  //     }
  //   } catch (error) {
  //     console.error('Error during CPT save:', error);
  //     swal('Error', 'An unexpected error occurred.', 'error');
  //   }
  // }
  
  //..
  async saveCPT(model: ProviderCptPlan_Details) {
    debugger;
    const pCPTCode = model.Cpt_Code;  // Getting the CPT code from the model
    const pCPTPlanId = model.Provider_Cpt_Plan_Id;
    const pAlternateCode = model.Alternate_Code;  // Getting the Alternate Code from the model
    
    try {
      // Await both validation checks
      const isNotDuplicate = await this.checkCPTDuplicate(pCPTCode, pCPTPlanId);
      const isAlternateCodeValid = await this.checkAlternateCodeDuplicate(pAlternateCode,pCPTPlanId);
      
      // Check and retrieve data for the alternate code
      if (pAlternateCode) {
        const alternateCodeResponse = await this.API.getData('/Setup/GetByAlternateCode?AlternateCode=' + pAlternateCode).toPromise();
        
        if (alternateCodeResponse.Status === "Sucess") {
          // Update model with the fetched data
          model.Cpt_Description = alternateCodeResponse.Response.Cpt_Description;
          model.Cpt_Code = alternateCodeResponse.Response.Cpt_Code;
        } else {
          swal('Failed', alternateCodeResponse.Status, 'error');
          model.Alternate_Code = ''; // Clear the alternate code if it failed
          return; // Stop further execution as alternate code validation failed
        }
      }
  
      // Proceed with saving only if both validations pass
      if (isNotDuplicate && isAlternateCodeValid) {
        if (this.canSaveCPT(model)) {
          this.API.PostData('/Setup/PostProviderCptPlanDetails', model, (result) => {
            if (result.Status === "Success") {
              swal('Success', 'CPT Added', 'success');
              this.getCPTDetails(model.Provider_Cpt_Plan_Id);
              this.isNewCPT = false;
            } else {
              swal('Error', 'Failed to add CPT', 'error');
            }
          });
        }
      }
    } catch (error) {
      console.error('Error during CPT save:', error);
      swal('Error', 'An unexpected error occurred.', 'error');
    }
  }
  
  //..

  canSaveCPT(model: ProviderCptPlan_Details) {
    debugger
    if (!model.Cpt_Code) {
      swal('Validation Error', 'CPT Code is Missing', 'warning');
      return;
    }
    else if (!model.Cpt_Description) {
      swal('Validation Error', 'CPT Description is Missing', 'warning');
      return;
    }
    else if(this.billingtype)
      {
      //  if (!model.Revenue_Code) {
      //   swal('Validation Error', 'Revenue Code is Missing', 'warning');
      //   return;
      // }
      // else if (!model.Revenue_Description) {
      //   swal('Validation Error', 'Revenue Description is Missing', 'warning');
      //   return;
      // }
           //Added BY Hamza akhlaq for fee schedule enhancement
     if (!model.Charges ) {
      swal('Validation Error', 'Charges is Missing', 'warning');
      return;
    }
    else if (!model.Non_Facility_Participating_Fee) {
        swal('Validation Error', 'Non Facility Participating Fee is Missing', 'warning');
        return;
      }
      else if (!model.Non_Facility_Non_Participating_Fee) {
        swal('Validation Error', 'Non Facility Non Participating Fee is Missing', 'warning');
        return;
      }
      else if (!model.Facility_Participating_Fee) {
        swal('Validation Error', 'Facility Participating Fee is Missing', 'warning');
        return;
      }
      else if (!model.Facility_Non_Participating_Fee) {
        swal('Validation Error', 'Facility Non Participating Fee is Missing', 'warning');
        return;
      }
  
 
      return true;
    }
        //Added BY Hamza akhlaq for fee schedule enhancement
        else if (!model.Charges ) {
          swal('Validation Error', 'Charges is Missing', 'warning');
          return;
        }
     
    else if (!model.Non_Facility_Participating_Fee) {
      swal('Validation Error', 'Non Facility Participating Fee is Missing', 'warning');
      return;
    }
    else if (!model.Non_Facility_Non_Participating_Fee) {
      swal('Validation Error', 'Non Facility Non Participating Fee is Missing', 'warning');
      return;
    }
    else if (!model.Facility_Participating_Fee) {
      swal('Validation Error', 'Facility Participating Fee is Missing', 'warning');
      return;
    }
    else if (!model.Facility_Non_Participating_Fee) {
      swal('Validation Error', 'Facility Non Participating Fee is Missing', 'warning');
      return;
    }

    else {
      return true;
    }
  }

  onCancleCPT() {
    this.isNewCPT = false;
  }
}

