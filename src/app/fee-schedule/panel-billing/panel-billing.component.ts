
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUserViewModel } from '../../models/auth/auth';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { APIService } from '../../components/services/api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-panel-billing',
  templateUrl: './panel-billing.component.html',
  styleUrls: ['./panel-billing.component.css']
})
export class PanelBillingComponent implements OnInit {
  loggedInUser: CurrentUserViewModel;
  PracticeCode: any;
  panelBillingData: any[] = [];
  filteredPanelBillingData: any[] = [];
  dataTable: any;
  action: string = ''; // 'edit' or other actions
  Panel_Billing_Code_Id: number | null = null;

  constructor(
    public Gvars: GvarsService,
    private API: APIService,
    private route: ActivatedRoute,
    private router: Router,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Get route parameters
    this.route.params.subscribe(params => {
      this.action = params['action']; // e.g., 'edit'
      this.Panel_Billing_Code_Id = +params['id']; // e.g., panel code ID

      if (this.action === 'edit' && this.Panel_Billing_Code_Id) {
        this.loadPanelCodeDetails();
      }
    });
    this.loggedInUser = this.Gvars.currentUser;
    this.PracticeCode = this.loggedInUser.selectedPractice.PracticeCode;

    // Fetch data for current practice or handle "All"
    if (this.PracticeCode !== undefined) {
      this.getPanelBillingSummary(this.PracticeCode);
    } else {
      console.error('PracticeCode is not defined.');
    }
  }
  // Fetch panel code details for edit
  loadPanelCodeDetails() {
    this.API.getData(`/demographic/GetPanelCodeDetailsForEdits/${this.Panel_Billing_Code_Id}`).subscribe(
      (response: any) => {
        if (response.success) {
          // Populate form fields with fetched data
          const data = response.data;
          console.log('Panel Code Details:', data);
          // Bind data to your form fields here
        } else {
          console.log('Failed to load panel code details.');
        }
      },
      error => {
        console.log('An error occurred while fetching panel code details.');
      }
    );
  }

  /**
   * Navigate to Add/Edit Panel Code page.
   */
  navigateToAddEdit(): void {
    this.router.navigate(['/FeeSchedule', 'AddEditPanelCode']);
  }

  getPanelBillingSummary(practiceCode: number): void {
    const endpoint = `/Demographic/GetPanelBillingSummaryByPractice?practiceCode=${practiceCode}`;
    this.API.getData(endpoint).subscribe(
      (response: any) => {
        console.log('API Response GetPanelBillingSummaryByPractice:', response);

        // Destroy DataTable if already initialized
        if (this.dataTable) {
          this.dataTable.destroy();
        }

        if (response.Status === 'Success' && response.Response.length > 0) {
          this.panelBillingData = response.Response;

          // Map and format data for display
          this.filteredPanelBillingData = this.panelBillingData.map((item) => ({
            ...item,
            CreatedDate: item.CreatedDate ? moment(item.CreatedDate).format('YYYY-MM-DD') : '',
            ModifiedDate: item.ModifiedDate ? moment(item.ModifiedDate).format('YYYY-MM-DD') : '',
            // Status: item.Status ? 'Active' : 'Inactive',
          }));

          // After fetching the summary, fetch the details for each Panel Billing Code
          this.filteredPanelBillingData.forEach((panel) => {
            if (panel.Panel_Billing_Code_Id) {
              this.getPanelCodeDetails(panel.Panel_Billing_Code_Id); // Pass Panel_Billing_Code_Id here
            }
          });
        } else {
          console.warn('No data found for the provided practice code.');
          this.filteredPanelBillingData = [];
        }

        // Update table view and reinitialize DataTable
        this.chRef.detectChanges();
        const table: any = $('.dataTablePanel');
        this.dataTable = table.DataTable({
          order: [[1, 'asc']],
          scrollX: true,
          language: {
            emptyTable: 'No data available',
          },
        });
      },
      (error) => {
        console.error('Error fetching panel billing summary:', error);
      }
    );
  }

  getPanelCodeDetails(panelBillingCodeId: number): void {
    this.API.getData(`/demographic/GetPanelCodeDetailsForEdits?panelBillingCodeId=${panelBillingCodeId}`).subscribe(
      (response: any) => {
        if (response.Status === 'Success') {
          console.log('Panel Billing Code Details:', response.Response);
          // Store or display the details as needed
        } else {
          console.error(response.Status);
        }
      },
      (error) => {
        console.error('Error fetching panel billing code details:', error);
      }
    );
  }


  /**
   * Edit a specific panel billing record.
   * @param record Record to edit.
   */
  editRecord(record: any): void {
    console.log('Edit record:', record);
    // Logic for editing records
    // Navigate to AddEditPanelCodeComponent with the selected record's data
    this.router.navigate(['/FeeSchedule', 'AddEditPanelCode'], {
      state: { panelData: record },
    });
  }

  // Navigate to the edit page with panel code ID
  //  onEditPanelCode(panelCodeId: number) {
  //   this.router.navigateByUrl(`panelCode/edit/${panelCodeId}`);
  // }

  /**
   * View details of a specific panel billing record.
   * @param record Record to view.
   */
  // viewRecord(panelCodeId: any): void {
  //   console.log('View record:', panelCodeId);
  //   this.router.navigate(['FeeSchedule', 'add-edit-panel-code', panelCodeId]); 


  //   // Logic for viewing records
  // }

  viewRecord(panelCodeId: any): void {
    console.log('View record:', panelCodeId);
    this.router.navigate(['FeeSchedule', 'add-edit-panel-code', panelCodeId], {
      queryParams: { mode: 'view' },
    });
  }


  /**
   * Change the status of a specific panel billing record.
   * @param record Record to update.
   * @param status New status to set.
   */
  changeStatus(record: any, status: string): void {
    console.log(`Changing status of record ${record.Status} to ${status}`);
    // Logic for changing status
  }
  PanelCStatus(panelBillingCodeId: any) {
    this.confirmFun('Confirmation', 'Are you sure you want to Change Status?', () => {
      this.onYesClick();
    }, () => {

      // const endpoint = `/demographic/PanelCodeStatus?panelBillingCodeId=${panelBillingCodeId}`;
      // console.log('Calling API Endpoint:', endpoint); // Log this URL
      // this.API.getData(endpoint).subscribe(

      const endpoint = `/demographic/PanelCodeStatus?panelBillingCodeId=${panelBillingCodeId}`;
      this.API.getData(endpoint).subscribe(
        (data) => {
          this.getPanelBillingSummary(this.PracticeCode);
        }
      );
    });

  }

  onYesClick(): any {

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



  onPracticeChange(): void {
    if (this.PracticeCode) {
      this.getPanelBillingSummary(this.PracticeCode); // Fetch data for the selected practice
    } else {
      console.warn('No practice selected.');
      this.filteredPanelBillingData = []; // Clear the table if no practice is selected
    }
  }

  getPanelBillingCodeDetails(panelBillingCodeId: number): void {
    const endpoint = `/demographic/GetPanelCodeDetailsForEdits?panelBillingCodeId=${panelBillingCodeId}`;
    console.log('Calling API Endpoint:', endpoint); // Log this URL
    this.API.getData(endpoint).subscribe(
      (response: any) => {
        if (response.Status === 'Success') {
          console.log('Panel Billing Details:', response.Response);
        } else {
          console.error('API Response Status:', response.Status);
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }


  onEditPanelBillingCode(panelBillingCodeId: number): void {
    console.log('Panel Billing Code ID:', panelBillingCodeId);
    if (panelBillingCodeId) {
      this.getPanelBillingCodeDetails(panelBillingCodeId);
    } else {
      console.error('Invalid Panel Billing Code ID');
    }
  }

  onEditPanelCode(panelCodeId: number) {
    debugger;
    // Navigating to the AddEditPanelCode page with the ID in the route params  
    this.router.navigate(['FeeSchedule', 'add-edit-panel-code', panelCodeId]);

  }


}
