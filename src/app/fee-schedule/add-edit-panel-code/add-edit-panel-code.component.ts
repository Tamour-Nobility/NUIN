import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { APIService } from '../../components/services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PanelBillingFrontEnd, PanelBillingFrontEndList } from '../../models/panel-billing-front-end';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Common } from './../../services/common/common';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-add-edit-panel-code',
  templateUrl: './add-edit-panel-code.component.html',
  styleUrls: ['./add-edit-panel-code.component.css']
})
export class AddEditPanelCodeComponent implements OnInit {
  M1Options = ['Option 1', 'Option 2', 'Option 3']; // Example options for M1
  M2Options = ['Option A', 'Option B', 'Option C']; // Example options for M2
  M3Options = ['Option X', 'Option Y', 'Option Z']; // Example options for M3
  M4Options = ['Option 1', 'Option 2', 'Option 3']; // Example options for M4
  panelBilling: PanelBillingFrontEnd[] = [new PanelBillingFrontEnd()];
  panelBillingEditsList = new PanelBillingFrontEndList();
  modifiers: any;
  selectedId: number;
  panelBillingData: any = {}; // To hold the fetched data
  listPracticesList: any[];
  selectedPractice: any;
  selectedProvider: any;
  selectedLocation: any;
  panelCode: string = '';
  isEditMode: boolean = false;
  isViewMode: boolean = false; // Flag for view mode
  c = {
    CPTCode: ''
  };
  practices: any[] = []; // Populate with actual practices
  providers: any[] = []; // Populate with actual providers
  // locations: any[] = []; // Populate with actual locations
  providerList: any;
  locationList: any[];
  PanelBilling: FormGroup;
  ViewMode: boolean = false;

  ColumnName_List1: any = [];
  // Add variables for error messages
  errorMessages = {
    practice: '',
    panelCode: ''
  }
  originalPanelCode: string = ''; // To store the initial Panel Code value
  rowsToDelete: number[] = []; // Array to track deleted row IDs



  constructor(public httpClient: HttpClient, public API: APIService, private cd: ChangeDetectorRef, private gv: GvarsService, private router: Router, private toaster: ToastrService, private route: ActivatedRoute, private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Check if mode is 'view'
    this.route.queryParams.subscribe((params) => {
      if (params['mode'] === 'view') {
        this.isViewMode = true;
        this.PanelBilling.disable(); // Disable the entire form group
      }
    });
    // Get the 'id' from route parameters
    this.selectedId = +this.route.snapshot.paramMap.get('id')!;
    // Fetch the data for the selected id
    if (this.selectedId) {
      this.isEditMode = true;
      this.loadData(this.selectedId); // Call API to load data based on the ID
    }
    this.getPractices();

    // this.GetLocations();
    //this.AddRowForPanelCode();
    this.InitForm();
    this.getModifiers();
  }
  InitForm() {
    this.PanelBilling = new FormGroup({
      practice: new FormControl('', [
        Validators.required,
      ]),
      provideId: new FormControl('', [
        Validators.required,
      ]

      ),
      Location: new FormControl('', [
        Validators.required,
      ]),
      PanelCode: new FormControl('', [
        Validators.required,
      ]),
    })
  }
  // Populate form fields with the fetched data
  loadData(selectedId: number): void {
    debugger
    debugger
    const endpoint = `/demographic/GetPanelCodeDetailsForEdits?panelBillingCodeId=${selectedId}`;
    console.log('Calling API Endpoint:', endpoint); // Log this URL
    this.API.getData(endpoint).subscribe(
      (response) => {
        if (response.Status === 'Success' && response.Response) {
          const data = response.Response;
          console.log('Panel Billing Data after edit button loadData: ', data);
          // Populate the form fields with the fetched data
          console.log('Before patchValue:', this.PanelBilling.value);
          debugger
          this.GetProviders(response.Response[0].Practice_Code);
          this.GetLocations(response.Response[0].Practice_Code);
          debugger
          this.PanelBilling.patchValue({
            practice: data[0].Practice_Code,
            provideId: data[0].Provider_Code,
            Location: data[0].Location_Code,
            PanelCode: data[0].Panel_Code,
          });
          this.originalPanelCode = data[0].Panel_Code;
          this.selectedId = response.Panel_Billing_Code_Id; // Ensure the unique ID is stored
          const panelData = this.panelBilling[0];
          this.panelBilling = data.map(data => {
            return {
              ...data,
              CPTCode: data.Cpt_Code,
              CPTDescription: data.Cpt_Description,
              AlternateCode: data.Alternate_Code,
              Units: data.Units,
              Charges: data.Charges,
              M_1: data.M_1,
              M_2: data.M_2,
              M_3: data.M_3,
              M_4: data.M_4,
              Panel_Billing_Code_Id: data.Panel_Billing_Code_Id,
              // BaseCharge: data.Charges,
              BaseCharge: parseFloat(data.Units) > 0 ? data.Charges / data.Units : data.Charges, // Derive BaseCharge
            };
          });
          // Disable form fields based on the mode
          if (this.isViewMode) {
            // In view mode, disable all fields
            console.log('Disabling all fields (View Mode)');
            this.PanelBilling.get('practice').disable();
            this.PanelBilling.get('provideId').disable();
            this.PanelBilling.get('Location').disable();
            this.PanelBilling.get('PanelCode').disable();
          } else if (this.isEditMode) {
            // In edit mode, disable all fields except PanelCode
            console.log('Disabling fields except PanelCode (Edit Mode)');
            this.PanelBilling.get('practice').disable();
            this.PanelBilling.get('provideId').disable();
            this.PanelBilling.get('Location').disable();
          }
          console.log('Updated panelBilling array:', this.panelBilling);
          console.log('After patchValue:', this.PanelBilling.value);
          this.cdr.detectChanges();
          // Optionally, populate any other data such as modifiers, CPT codes, etc.
          this.modifiers = data[0].Modifiers || [];
          // Populate other form values (if needed, e.g., table values)
          this.cdr.detectChanges(); // This helps Angular detect any changes made programmatically
        }

      },
      (error) => {
        console.error('Error fetching panel code data:', error);
      }
    );
  }

  getModifiers() {
    this.API.getData('/Demographic/GetModifiers').subscribe(
      data => {
        if (data.Status == 'Sucess') {

          this.modifiers = data.Response;
        }

      })
  }
  resetFields() {
    this.PanelBilling.get('practice').enable();
    this.PanelBilling.get('provideId').enable();
    this.PanelBilling.get('Location').enable();
    this.selectedPractice = '';
    this.selectedProvider = '';
    this.selectedLocation = '';
    this.panelCode = '';  // Reset panelCode here
    this.PanelBilling.reset();  // Reset all form fields

    // Reset each item in the panelBilling array
    this.panelBilling.forEach(item => {
      item.CPTCode = '';
      item.CPTDescription = '';
      item.AlternateCode = '';
      item.Units = '';
      item.M_1 = '';
      item.M_2 = '';
      item.M_3 = '';
      item.M_4 = '';
      item.Charges = '';
    });
  }

  // savePanelCode() {
  //   // Logic to save the panel code
  // }

  // onPracticeChange(event: any) {
  //   const selectedPracticeId = event.target.value;

  //   if (selectedPracticeId > 0) {  // Ensure valid practice id is selected
  //     this.PanelBilling.controls['practice'].setValue(event.target.value);
  //     // Reset provider and location fields
  //     this.PanelBilling.controls['provideId'].setValue(null);
  //     this.PanelBilling.controls['Location'].setValue(null);
  //     this.GetProviders(selectedPracticeId);
  //     this.GetLocations(selectedPracticeId); // Fetch locations for selected practice
  //   } else {
  //     // If no valid practice is selected, reset provider and location fields
  //     this.PanelBilling.controls['provideId'].setValue(null);
  //     this.PanelBilling.controls['Location'].setValue(null);
  //   }

  // }
  // onPracticeChange(event: any) {
  //   const selectedPracticeId = event.target.value;
  
  //   if (selectedPracticeId > 0) { // Ensure a valid practice ID is selected
  //     this.PanelBilling.controls['practice'].setValue(selectedPracticeId);
  
  //     // Clear provider and location dropdowns and reset the form controls
  //     this.providerList = []; // Clear existing providers
  //     this.locationList = []; // Clear existing locations
  //     this.PanelBilling.controls['provideId'].setValue(null);
  //     this.PanelBilling.controls['Location'].setValue(null);
  
  //     // Fetch providers and locations for the selected practice
  //     this.GetProviders(selectedPracticeId);
  //     this.GetLocations(selectedPracticeId);
  //   } else {
  //     // If no valid practice is selected, reset provider and location fields
  //     this.providerList = [];
  //     this.locationList = [];
  //     this.PanelBilling.controls['provideId'].setValue(null);
  //     this.PanelBilling.controls['Location'].setValue(null);
  //   }
  // }
  onPracticeChange(event: any) {
    const selectedPracticeId = event.target.value;
  
    if (selectedPracticeId > 0) { // Ensure a valid practice ID is selected
      this.PanelBilling.controls['practice'].setValue(selectedPracticeId);
  
      // Clear provider and location dropdowns and reset the form controls
      this.providerList = []; // Clear existing providers
      this.locationList = []; // Clear existing locations
      this.PanelBilling.controls['provideId'].setValue(null);
      this.PanelBilling.controls['Location'].setValue(null);
  
      // Fetch providers and locations for the selected practice
      this.GetProviders(selectedPracticeId);
      this.GetLocations(selectedPracticeId);
    } else {
      // Reset all fields when no valid practice is selected
      this.PanelBilling.controls['practice'].setValue(null); // Reset practice field
      this.providerList = []; // Clear provider dropdown
      this.locationList = []; // Clear location dropdown
      this.PanelBilling.controls['provideId'].setValue(null); // Reset provider field
      this.PanelBilling.controls['Location'].setValue(null); // Reset location field
    }
  }
  
  
  GetProviders(id: number) {
    this.API.getData(`/Report/GetProvidersBYPractice?PracticeId=${id}`).subscribe(
      d => {
        if (d.Status === "success") {
          debugger
          this.providerList = d.Response;
          console.log("Providers", this.providerList)
          if (!this.providerList.find(p => p.Name === 'All')) {
            this.providerList = [{ ProviderId: 0, ProviderFullName: 'All' }, ...this.providerList];
          }

        } else {
          swal('Failed', d.Status, 'error');
        }
      },
      error => {
        swal('Error', 'Something went wrong', 'error');
      }
    );
  }
  getPractices() {
    this.API.getData('/Setup/GetPracticeList').subscribe(
      d => {
        if (d.Status == "Sucess") {
          this.listPracticesList = d.Response;
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }

  GetLocations(practiceCode: number) {
    this.API.getData(`/demographic/GetPanelBillingLocationSelectList?practiceCode=${practiceCode}&all=true`).subscribe(
      d => {
        if (d.Status === "Success") {
          this.locationList = d.Response;

          console.log("Locations", this.locationList);
          // Add "ALL" to the location list if it doesn't exist
          if (!this.locationList.find(l => l.Name === 'All')) {
            this.locationList = [{ Id: 0, Name: 'All' }, ...this.locationList];
          }
        } else {
          swal('Failed', d.Status, 'error');
        }
      },
      error => {
        swal('Error', 'Something went wrong', 'error');
      }
    );
  }


  onprovideChange(event: any) {
    debugger
    const selectedProviderId = event.target.value; // Get the selected ProviderId
    const selectedProvider = this.providerList.find(provider => provider.ProviderId.toString() === selectedProviderId);

    if (selectedProvider) {
      this.PanelBilling.controls['provideId'].setValue(event.target.value);
      this.selectedProvider = selectedProvider.ProviderFullName; // Assign the full name to selectedProvider
    } else {
      this.selectedProvider = ''; // Clear if no provider is found
    }
  }
  onLocationChange(event: any) {
    this.selectedLocation = event.target.value;
    this.PanelBilling.controls['Location'].setValue(event.target.value);
  }


  get areRequiredFieldsFilled(): boolean {
    return this.PanelBilling.get('practice').valid &&
      this.PanelBilling.get('provideId').valid &&
      this.PanelBilling.get('Location').valid &&
      this.PanelBilling.get('PanelCode').valid;
  }
  AddRowForPanelCode() {
    debugger; // For debugging in your development tools

    // Check if there are no existing rows and initialize the array with a new row
    if (this.panelBilling.length === 0) {
      this.panelBilling.push(new PanelBillingFrontEnd());
    } else {
      const lastRow = this.panelBilling[this.panelBilling.length - 1];

      // Validate all mandatory fields before adding a new row
      if (!lastRow.CPTCode) {
        this.toaster.error('CPT code is required. Please enter a valid CPT code.', 'Error');
        return; // Stop further action if CPT code is empty
      }

      if (!lastRow.Units) {
        this.toaster.error('Unit field is required. Please enter a valid unit value.', 'Error');
        return; // Stop further action if Units is empty
      }

      if (!lastRow.Charges) {
        debugger;
        this.toaster.error('Panel CPT code cannot be saved with empty charge field.', 'Error');
        return; // Stop further action if Charges is empty
      }

      if (!lastRow.CPTDescription) {
        this.toaster.error('CPT Description is required. Please enter a valid CPT Description.', 'Error');
        return; // Stop further action if CPT Description is empty
      }

      // If all required fields are filled, add a new row
      this.panelBilling.push(new PanelBillingFrontEnd());
    }
  }

  /**
   * Validate whether the character entered is alphanumeric (a-z, A-Z, 0-9).
   * If the character is alphanumeric, allow it; otherwise, prevent the character from being entered.
   * @param event KeyboardEvent
   * @returns boolean If the character is alphanumeric, return true; otherwise, return false.
   */
  allowAlphanumericOnly(event: KeyboardEvent): boolean {
    debugger
    const charCode = event.charCode;
    if ((charCode >= 48 && charCode <= 57) || // 0-9
      (charCode >= 65 && charCode <= 90) || // A-Z
      (charCode >= 97 && charCode <= 122)) { // a-z
      return true; // Allow alphanumeric characters
    }
    event.preventDefault(); // Prevent non-alphanumeric characters
    return false;
  }
  DeleteRowOfCustomRule(index: number) {
    if (this.panelBilling.length <= 1) {
      // Show a warning message if trying to delete the last remaining row
      swal("Cannot Delete", "At least one row must remain.", "warning");
      return;
    }

    this.API.confirmFun(
      "Confirm Delete",
      "Are you sure you want to delete this row?",
      () => {
        const deletedRow = this.panelBilling.splice(index, 1)[0]; // Remove the row from the table

        if (deletedRow.Panel_Billing_Code_CPTId) {
          // Track the deleted row's ID if it exists in the database
          this.rowsToDelete.push(deletedRow.Panel_Billing_Code_CPTId);

          // Prepare the request payload
          const requestPayload = { ids: this.rowsToDelete };

          // Call the PostData method to delete the rows
          this.API.PostData('/demographic/deleteRows', this.rowsToDelete, (response) => {
            console.log('Rows deleted successfully', response);
            // Optionally, clear the rowsToDelete array if deletion is successful
            this.rowsToDelete = [];
          });
        }

        this.cd.detectChanges(); // Trigger change detection to update the view
      },

    );
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
  showConfirmationDialog() {
    this.confirmFun('Confirmation', 'Are you sure you want to cancel?', () => {
      this.onYesClick();
    }, () => {
      this.onNoClick();
    });
  }
  deleteConfirmationDialog(index: number) {
    debugger
    this.confirmFun('Confirmation', 'Are you sure you want to delete?', () => {
      // On confirmation, proceed with deletion
      this.DeleteRowOfCustomRule(index);
    }, () => {
      // On cancel, do nothing
      console.log('Deletion cancelled.');
    });
  }

  onYesClick(): any {

  }
  onNoClick(): any {
    this.router.navigateByUrl('/FeeSchedule/PanelBilling')
  }

  onEditClick() {
    debugger
    this.isViewMode = false; // Enable edit mode
    this.PanelBilling.get('PanelCode').enable();
  }


  async savePanelCode() {
    debugger
    debugger;
    this.clearErrorMessages(); // Reset error messages first

    // Prepare panel billing data with mapped CPT codes
    const panelBillingData = {
      practiceCode: this.PanelBilling.get('practice').value,
      providerCode: this.PanelBilling.get('provideId').value,
      locationCode: this.PanelBilling.get('Location').value,
      panelCode: this.PanelBilling.get('PanelCode').value,
      Panel_Billing_Code_Id: +this.route.snapshot.paramMap.get('id')!,
      cptCodes: this.panelBilling.map(item => ({
        CPTCode: item.CPTCode,
        CPTDescription: item.CPTDescription,
        M_1: item.M_1,
        M_2: item.M_2,
        M_3: item.M_3,
        M_4: item.M_4,
        AlternateCode: item.AlternateCode,
        Charges: item.Charges,
        Units: item.Units,
        Panel_Billing_Code_CPTId: item.Panel_Billing_Code_CPTId,
        Panel_Billing_Code_Id: item.Panel_Billing_Code_Id
      }))
    };
    const isUpdate = panelBillingData.Panel_Billing_Code_Id && panelBillingData.Panel_Billing_Code_Id > 0;

    // Validate required fields at the form level
    const requiredFields = [
      { control: 'practice', errorMessage: 'Practice selection is required. Please select Practice' },
      { control: 'provideId', errorMessage: 'Provider selection is required. Please select a Provider' },
      { control: 'Location', errorMessage: 'Location selection is required. Please select a Location' },
      { control: 'PanelCode', errorMessage: 'Panel code is required. Please enter a valid Panel code' }
    ];

    for (let field of requiredFields) {
      if (this.PanelBilling.get(field.control).invalid) {
        console.error(field.errorMessage);
        this.toaster.error(field.errorMessage, 'Error');
        this.PanelBilling.get(field.control).markAsTouched();
        return; // Stop further checks
      }
    }

    // Validate Charges field in each CPT row
    for (let i = 0; i < panelBillingData.cptCodes.length; i++) {
      debugger
      const item = panelBillingData.cptCodes[i];
      if (item.Charges === null || item.Charges === undefined || item.Charges === " " || item.Charges === "" || parseFloat(item.Charges) === 0) {
        this.toaster.error(
          `Row ${i + 1}: Panel CPT code cannot be saved with an empty charge field.`,
          'Error'
        );
        return; // Stop processing if any Charges field is invalid
      }
    }
    debugger
  //    // Validate alternate codes
  // for (let i = 0; i < panelBillingData.cptCodes.length; i++) {
  //   const item = panelBillingData.cptCodes[i];
  //   if (item.AlternateCode.trim()) {
  //     try {
  //       const response: any = await this.API.getData(
  //         `/demographic/GetPanelAlternateCode?PracticeCode=${panelBillingData.practiceCode}&ProviderCode=${panelBillingData.providerCode}&LocationCode=${panelBillingData.locationCode}&AlternateCode=${item.AlternateCode}`
  //       ).toPromise();

  //       if (response.Status === 'Success' && response.Response && response.Response.length > 0) {
  //         const data = response.Response[0];
  //         item.CPTCode = data.Cpt_Code.trim() || '';
  //         item.CPTDescription = data.Cpt_Description || '';
  //         item.Charges = data.Charges || '';
  //         item.Units = item.Units || 1;
  //       } else {
  //         this.toaster.error(`Row ${i + 1}: Alternate code '${item.AlternateCode}' is invalid.`, 'Error');
  //         return; // Stop processing if an alternate code is invalid
  //       }
  //     } catch (error) {
  //       console.error(`Error validating alternate code '${item.AlternateCode}' for row ${i + 1}:`, error);
  //       this.toaster.error(`An error occurred while validating alternate code for row ${i + 1}.`, 'Error');
  //       return;
  //     }
  //   }
  // }
//CHECK THE IF USER REMOVED THE ALTERENATE CODE FROM THE ROW AND THEN DIRECT CLICK ON SAVE BUTTON THEN IT WILL BE EMPTY AND ERROR WILL APPEAR (Because the cpt code and cpt description was against the alternate code which user added before but later on just removed it without pressing tab or enter and update / save it)
// Loop through the cptCodes array to validate each entry
// for (let i = 0; i < panelBillingData.cptCodes.length; i++) {
//   const item = panelBillingData.cptCodes[i];

//   try {
//     // Make the API call with the necessary parameters
//     const response: any = await this.API.getData(
//       `/Demographic/IsAlternateCodeRemoved?AlternateCode=${item.AlternateCode}&CptCode=${item.CPTCode}&CptDescription=${item.CPTDescription}`
//     ).toPromise();

//     // Handle the response based on the status
//     if (response.Status === 'Success') {
//       // Successfully matched CPT Code and Description with Alternate Code
//       console.log(`Row ${i + 1}: Success for Alternate Code '${item.AlternateCode}'`);

//       // Update the item fields with the data returned (if necessary)
//       item.CPTCode = response.Response.Cpt_Code;
//       item.CPTDescription = response.Response.Cpt_Description;
//     } else {
//       // If the response indicates an error
//       this.toaster.error(
//         `Row ${i + 1}: ${response.Message || 'An error occurred.'}`,
//         'Error'
//       );
//     }
//   } catch (error) {
//     // Handle any error during the API call
//     console.error(`Error validating alternate code '${item.AlternateCode}' for row ${i + 1}:`, error);
//     this.toaster.error(
//       `An error occurred while validating alternate code for row ${i + 1}.`,
//       'Error'
//     );
//   }
// }
// for (let i = 0; i < panelBillingData.cptCodes.length; i++) {
//   const item = panelBillingData.cptCodes[i];
  
//   try {
//     // Make sure that the URL is properly formed
//     const response: any = await this.API.getData(
//       `/Demographic/IsAlternateCodeRemoved?AlternateCode=${item.AlternateCode}&CptCode=${item.CPTCode}&CptDescription=${item.CPTDescription}`
//     ).toPromise();

//     // Check if response is valid
//     if (!response) {
//       throw new Error(`No response received for Alternate Code ${item.AlternateCode}`);
//     }

//     // Handle the response based on the status
//     if (response.Status === 'Success') {
//       // Proceed with success logic
//       item.CPTCode = response.Response.Cpt_Code || '';
//       item.CPTDescription = response.Response.Cpt_Description || '';
//       item.Charges = response.Response.Charges || '';
//       item.Units = item.Units || 1;
//     } else {
//       // Handle error
//       this.toaster.error(`Row ${i + 1}: ${response.Message}`, 'Error');
//       return;  // Stop processing if any error occurs
//     }

//   } catch (error) {
//     console.error('Error during API call:', error);
//     this.toaster.error(`An error occurred while validating Alternate Code for row ${i + 1}: ${error.message}`, 'Error');
//     return;  // Stop further processing on error
//   }


// }
// Validate alternate codes
for (let i = 0; i < panelBillingData.cptCodes.length; i++) {
  debugger
  const item = panelBillingData.cptCodes[i];

  if (item.AlternateCode.trim()) {
    try {
      const response: any = await this.API.getData(
        `/demographic/GetPanelAlternateCode?PracticeCode=${panelBillingData.practiceCode}&ProviderCode=${panelBillingData.providerCode}&LocationCode=${panelBillingData.locationCode}&AlternateCode=${item.AlternateCode}`
      ).toPromise();

      if (response.Status === 'Success' && response.Response && response.Response.length > 0) {
        const data = response.Response[0];
        item.CPTCode = data.Cpt_Code.trim() || '';
        item.CPTDescription = data.Cpt_Description || '';
        const baseCharge = data.Charges || 0; // Base charge fetched from API
        const units = item.Units || 1; // Default units to 1 if not set

        // Calculate charges as a multiple of units
        item.Charges = units * baseCharge;
        item.Units = units; // Ensure units are retained
      } else {
        this.toaster.error(`Row ${i + 1}: Alternate code '${item.AlternateCode}' is invalid.`, 'Error');
        return; // Stop processing if an alternate code is invalid
      }
    } catch (error) {
      console.error(`Error validating alternate code '${item.AlternateCode}' for row ${i + 1}:`, error);
      this.toaster.error(`An error occurred while validating alternate code for row ${i + 1}.`, 'Error');
      return;
    }
  }
}


    // **Check for duplicate rows within cptCodes**
    const hasDuplicates = panelBillingData.cptCodes.some((row, index, array) =>
      array.findIndex(
        r =>
          r.CPTCode == row.CPTCode &&
          r.CPTDescription == row.CPTDescription &&
          r.M_1 == row.M_1 &&
          r.M_2 == row.M_2 &&
          r.M_3 == row.M_3 &&
          r.M_4 == row.M_4 &&
          r.AlternateCode == row.AlternateCode &&
          r.Charges == row.Charges &&
          r.Units == row.Units
      ) !== index
    );

    if (hasDuplicates) {
      this.toaster.error('Duplicate rows are not allowed. Please ensure all rows are unique.', 'Error');
      return; // Stop further processing if duplicates are found
    }


    // Check for unique PanelCode before saving
    try {
      const uniquenessCheckResponse: any = await this.API.getData(`/demographic/CheckPanelCodeExists?PracticeCode=${panelBillingData.practiceCode}&ProviderCode=${panelBillingData.providerCode}&LocationCode=${panelBillingData.locationCode}&PanelCode=${panelBillingData.panelCode}&panelBillingCodeId=${+this.route.snapshot.paramMap.get('id')!}`).toPromise();

      if (uniquenessCheckResponse.Status === 'Exists') {
        console.warn('Panel code already exists');
        this.toaster.error('Entered Panel code already exists. Please enter a unique Panel code.', 'Error');
        return; // Stop further processing if PanelCode exists
      }

      // Validate other required fields in each row of `cptCodes`
      for (let i = 0; i < panelBillingData.cptCodes.length; i++) {
        debugger
        const item = panelBillingData.cptCodes[i];
        if (!item.CPTCode || !item.CPTDescription || !item.Units || !item.Charges) {
          this.toaster.error(`Row ${i + 1} is incomplete. Please fill out all required fields.`, 'Error');
          return; // Stop the save action if any row is incomplete
        }
      }

      // If all validations pass and PanelCode is unique, proceed with saving
      console.log("Form and row data are valid. Proceeding with save...");

      // Save data via PostData method and handle response
      this.API.PostData('/demographic/AddOrUpdatePanelCPTCodes', panelBillingData, (response) => {
        if (response.Status.includes('Successfully')) {
          console.log('Data saved successfully');
          if (isUpdate) {
            swal("Panel Code", "Panel Code has been updated successfully.", "success");
          } else {
            swal("Panel Code", "Panel Code has been created successfully.", "success");
          }
          this.resetFields(); // Reset form if necessary
          this.router.navigateByUrl('/FeeSchedule/PanelBilling');
        } else {
          console.warn('Failed to save data:', response.Status);
        }
      });
    } catch (error) {
      console.error('Error checking panel code uniqueness:', error);
      this.toaster.error('An error occurred while checking the panel code uniqueness.', 'Error');
    }
  }


  // Helper function to clear error messages
  clearErrorMessages() {
    this.errorMessages = { practice: '', panelCode: '' };
  }


  // onKeypressPanelCodeCpt(event: KeyboardEvent, index: number): void {
  //   debugger;

  //   // Check for Enter or Tab key press
  //   if (event.key == "Enter" || event.key == "Tab") {
  //     const cptCode = (event.target as HTMLInputElement).value;

  //     if (cptCode.trim() !== '') {
  //       console.log('Calling API with CPT code:', this.PanelBilling.value);
  //       if (this.PanelBilling.controls['practice'] && this.PanelBilling.controls['provideId'] && this.PanelBilling.controls['Location'] && this.PanelBilling.controls['PanelCode']) {
  //         const data = {
  //           cptCode,
  //           practiceCode: this.PanelBilling.controls['practice'].value,
  //           providerCode: this.PanelBilling.controls['provideId'].value,
  //           locationCode: this.PanelBilling.controls['Location'].value,

  //         };
  //         this.callApiWithCPT(data, index);
  //       } else {
  //         // Show alert and reset CPTCode field
  //         swal("Panel Code", "Please select all required fields before entering the CPT code.", "error")
  //           .then(() => {
  //             // Stop further Enter/Tab propagation
  //             event.preventDefault();
  //             event.stopPropagation();

  //             // Reset CPTCode in the model and clear the input field
  //             (event.target as HTMLInputElement).value = '';
  //             const item = this.panelBilling.find(item => item[0].CPTCode === cptCode);
  //             if (item) item.CPTCode = '';
  //           });
  //       }
  //     }
  //   }
  // }
  // onKeypressPanelCodeCpt(event: KeyboardEvent, index: number): void {
  //   debugger;
  
  //   // Check for Enter or Tab key press
  //   if (event.key == "Enter" || event.key == "Tab") {
  //     const cptCode = (event.target as HTMLInputElement).value;
  
  //     if (cptCode.trim() !== '') {
  //       console.log('Calling API with CPT code:', this.PanelBilling.value);
  
  //       // Check if the required fields have valid values
  //       const practiceCode = this.PanelBilling.controls['practice'].value;
  //       const providerCode = this.PanelBilling.controls['provideId'].value;
  //       const locationCode = this.PanelBilling.controls['Location'].value;
  //       const panelCode = this.PanelBilling.controls['PanelCode'].value;
  
  //       // Validate if all required fields are filled
  //       if (practiceCode && providerCode && locationCode && panelCode) {
  //         const data = {
  //           cptCode,
  //           practiceCode,
  //           providerCode,
  //           locationCode
  //         };
  
  //         this.callApiWithCPT(data, index);
  //       } else {
  //         // Show alert and reset CPTCode field if any required field is missing
  //         swal("Panel Code", "Please select all required fields before entering the CPT code.", "error")
  //           .then(() => {
  //             // Stop further Enter/Tab propagation
  //             event.preventDefault();
  //             event.stopPropagation();
  
  //             // Reset CPTCode in the model and clear the input field
  //             (event.target as HTMLInputElement).value = '';
  //             const item = this.panelBilling.find(item => item[0].CPTCode === cptCode);
  //             if (item) item.CPTCode = '';
  //           });
  //       }
  //     }
  //   }
  // }
  onKeypressPanelCodeCpt(event: KeyboardEvent, index: number): void {
    debugger;
  
    // Check for Enter or Tab key press
    if (event.key === "Enter" || event.key === "Tab") {
      const cptCode = (event.target as HTMLInputElement).value.trim();
  
      if (cptCode !== '') {
        console.log('Calling API with CPT code:', this.PanelBilling.value);
  
        // Define required fields and their error messages
        const requiredFields = [
          { control: 'practice', errorMessage: 'Practice selection is required. Please select Practice' },
          { control: 'provideId', errorMessage: 'Provider selection is required. Please select a Provider' },
          { control: 'Location', errorMessage: 'Location selection is required. Please select a Location' },
          { control: 'PanelCode', errorMessage: 'Panel code is required. Please enter a valid Panel code' }
        ];
  
        // Check each required field for validity
        for (let field of requiredFields) {
          const control = this.PanelBilling.get(field.control);
          const controlValue = control.value;
  
          // if (!control || control.invalid || !control.value) 
          if (controlValue === null || controlValue === undefined || controlValue === '') {
            // Show specific error message
            console.error(field.errorMessage);
            this.toaster.error(field.errorMessage, 'Error');
  
            // Mark the field as touched for visual feedback
            control.markAsTouched();
  
            // Stop further Enter/Tab propagation
            event.preventDefault();
            event.stopPropagation();
  
            // Reset CPTCode in the model and clear the input field
            (event.target as HTMLInputElement).value = '';
            if (this.panelBilling[index]) {
              this.panelBilling[index].CPTCode = '';
            }
  
            return; // Exit the function if a required field is missing or invalid
          }
        }
  
        // If all required fields are valid, proceed to call the API
        const data = {
          cptCode,
          practiceCode: this.PanelBilling.get('practice').value,
          providerCode: this.PanelBilling.get('provideId').value,
          locationCode: this.PanelBilling.get('Location').value
        };
  
        this.callApiWithCPT(data, index);
      }
    }
  }
  


  callApiWithCPT(data: any, index: number) {
    const { practiceCode, providerCode, locationCode, cptCode } = data;

    this.API.getData(`/demographic/getPanelCodeCpt?PracticeCode=${practiceCode}&ProviderCode=${providerCode}&LocationCode=${locationCode}&cptCode=${cptCode}`).subscribe(
      (response: any) => {
        console.log('API response:', response);

        if (response.Status === 'Success' && response.Response && response.Response.length > 0) {
          const data = response.Response[0];

          this.panelBilling[index].CPTDescription = data.Cpt_Description || '';
          this.panelBilling[index].AlternateCode = data.Alternate_Code || '';
          this.panelBilling[index].Charges = data.Charges || ' ';
          this.panelBilling[index].Units = 1;
          (this.panelBilling[index] as any).BaseCharge = parseFloat(data.Charges) || 0;
        } else if (response.Status === 'No Data Found') {
          // Show error message if CPT code is invalid
          swal("Invalid CPT Code", "Please enter a valid code.", "error").then(() => {
            // Clear the invalid CPT code from the input field and model
            this.panelBilling[index].CPTCode = '';
            this.panelBilling[index].CPTDescription = '';
            this.panelBilling[index].Charges = '';
          });
        } else {
          console.log('Error in response:', response.Status);
        }
      },
      (error) => {
        console.error('Error fetching panel code CPT:', error);
      }
    );
  }

  onKeyPressPanelAlternateCode(event: KeyboardEvent, index: number): void {
    // Check for Enter or Tab key press
    debugger
    if (event.key == "Enter" || event.key == "Tab") {
      // event.preventDefault(); // Prevent default tab behavior

      const Alternate_Code = (event.target as HTMLInputElement).value;
      //   const requireAlternateCodeLength = 5;

      if (Alternate_Code.trim() !== '') {
        if (this.PanelBilling.valid) {
          const data = {
            Alternate_Code,
            practiceCode: this.PanelBilling.controls['practice'].value,
            providerCode: this.PanelBilling.controls['provideId'].value,
            locationCode: this.PanelBilling.controls['Location'].value
          };
          this.getPanelALternateCode(data, index);
        } else {
          swal("Panel Code", "Please select all required fields before entering the CPT code.", "error")
            .then(() => {
              (event.target as HTMLInputElement).value = '';
              const item = this.panelBilling.find(item => item.AlternateCode === Alternate_Code);
              if (item) item.CPTCode = '';
            });
        }
      }
    }
  }
  getPanelALternateCode(data: any, index: number) {
    debugger
    const { practiceCode, providerCode, locationCode, Alternate_Code } = data;

    this.API.getData(`/demographic/GetPanelAlternateCode?PracticeCode=${practiceCode}&ProviderCode=${providerCode}&LocationCode=${locationCode}&AlternateCode=${Alternate_Code}`).subscribe(
      (response: any) => {
        console.log('API response:', response);

        if (response.Status === 'Success' && response.Response && response.Response.length > 0) {
          const data = response.Response[0];
          this.panelBilling[index].CPTCode = data.Cpt_Code.trim() || '';
          this.panelBilling[index].CPTDescription = data.Cpt_Description || '';
          this.panelBilling[index].AlternateCode = data.Alternate_Code || '';
          this.panelBilling[index].Charges = data.Charges || '';
          (this.panelBilling[index] as any).BaseCharge = parseFloat(data.Charges) || 0;
          this.panelBilling[index].Units = 1
        } else if (response.Status === 'No Data Found') {
          swal("Invalid Alternate Code", "Please enter a valid code.", "error").then(() => {
            this.panelBilling[index].CPTCode = '';
            this.panelBilling[index].AlternateCode = '';
          });
        } else {
          console.log('Error in response:', response.Status);
        }
      },
      (error) => {
        console.error('Error fetching panel code CPT:', error);
      }
    );
  }



  // Example method to send data (could be a service call to the backend)
  sendCptData(data: any): void {
    console.log('Sending CPT Data:', data);

  }
  onBlurUnit(index: number) {
    debugger;
    // Ensure the panelBilling array and the specific index entry are available
    if (this.panelBilling && this.panelBilling[index]) {
      const currentEntry = this.panelBilling[index];
  
      // Check if Units is empty, undefined, or 0 and CPTCode is not empty
      if ((!currentEntry.Units || currentEntry.Units === 0 || currentEntry.Units === "0") && currentEntry.CPTCode) {
        currentEntry.Units = 1; // Set default units to 1
      }
    } else {
      console.error(`No entry found in panelBilling for index ${index}`);
    }
  }
  

  CPTKeyPressEventUnit(event: any, units: string, index: number) {
    debugger
    let unitValue = units === "" || units === "0" ? "1" : units;

    // Access BaseCharge directly if it exists

    const BaseCharge = (this.panelBilling[index] as any).BaseCharge;
    console.log()

    // Calculate Charges based on BaseCharge and units
    this.panelBilling[index].Charges = (BaseCharge * parseFloat(unitValue)).toString();
    console.log('BaseCharge and units:', this.panelBilling[index].Charges);
  }

  checkPanelCodeExists(panelCode: string, practiceCode: string, providerCode: string, locationCode: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.API.getData(`/demographic/CheckPanelCodeExists?PanelCode=${panelCode}&PracticeCode=${practiceCode}&ProviderCode=${providerCode}&LocationCode=${locationCode}`)
        .subscribe(
          (response: any) => {
            if (response.Status === 'Exists') {
              resolve(true); // Panel code already exists
            } else {
              resolve(false); // Panel code is unique
            }
          },
          (error) => {
            console.error('Error checking panel code existence:', error);
            reject(error); // Handle error appropriately
          }
        );
    });
  }

}

