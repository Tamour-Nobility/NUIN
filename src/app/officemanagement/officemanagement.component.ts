import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef,  } from '@angular/core';
import { Company, Office, Shift, Department, Designation, Team, officeDepartmentDropdown, dropdownClass } from './classes/requestResponse'
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
declare var $: any
import 'datatables.net';
import { APIService } from '../components/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-officemanagement',
  templateUrl: './officemanagement.component.html',
  styleUrls: ['./officemanagement.component.css']
})
export class OfficemanagementComponent implements OnInit, OnDestroy {
  table: any;
  dataTable: any;
  dtCompanies: any;
  dtOffices: any;
  dtDepartmentList: any;
  dtTeams: any;
  dtShifts: any;
  dtDesignations: any;
  public tableWidget: any;

  selectedCompanyName: string = "";
  selectedCompanyId: number = 0;
  selectedOfficeId: number = 0;
  selectedDepartment: number = 0;
  selectedDepartmentId: number = 0;

  temp_var: boolean = true;
  nSelectedTeamRow: number = 0;
  nSelectedDeprow: number = 0;
  nSelectedShiftRow: number = 0;
  nSelectedCompanyrow: number = 0;
  nSelectedRow: number = 0;
  nSelectedDesignationRow: number = 0;
  strtext: string = "";
  listCompany: Company[];
  listCompanyForDd: Company[];
  objCompany: Company;
  officelist$: any[] = [];
  officelistForDd: any[] = [];
  objOffice: Office;
  listShift: Shift[];
  objShift: Shift;
  listDepartment: Department[];
  listDepartmentForDd: Department[];
  objDepartment: Department;
  listDesignation: Designation[];
  objDesignation: Designation;
  listTeam: Team[];
  objTeam: Team;
  objdropdownClass: officeDepartmentDropdown;
  strTabCheck: string = "C";
  strAddNew: string = "";
  strAddNewTitle: string = "Add New Company";
  iseditable: boolean;
  constructor(
    public API: APIService,
    private chRef: ChangeDetectorRef,
    private toasterService: ToastrService,
    public route:Router) {
    this.listCompany = [];
    this.objCompany = new Company;
    this.objOffice = new Office;
    this.listShift = [];
    this.objShift = new Shift;
    this.listDepartment = [];
    this.objDepartment = new Department;
    this.listDesignation = [];
    this.objDesignation = new Designation;
    this.listTeam = [];
    this.objTeam = new Team;
    this.objdropdownClass = new officeDepartmentDropdown;
  }

  ngOnInit() {
    this.strTabCheck = "C";
    this.checkTabSequence(this.strTabCheck);
  }


  checkTabSequence(str: string = "C") {
    this.strTabCheck = str;
    this.loadInfo(str);
  }

  selectRow(ndx: number) {
    this.nSelectedRow = ndx;
  }

  selectCompanyRow(ndx: number) {
    this.nSelectedCompanyrow = ndx;
  }

  selectShiftRow(ndx: number) {
    this.nSelectedShiftRow = ndx;
  }

  selectDepRow(ndx: number) {
    this.nSelectedDeprow = ndx;
  }

  selectTeamRow(ndx: number) {
    this.nSelectedTeamRow = ndx;
  }

  selectDesignationRow(ndx: number) {
    this.nSelectedDesignationRow = ndx;
  }

  loadInfo(Type: string) {
    this.cancelAll();
    if (Type == "C") { this.getCompanyList(); }
    else if (Type == "O") { this.getCompListForDropDown(); this.getOfficeList(this.listCompany[0].CompanyId); }
    else if (Type == "DEP") { this.getDepartmentList(); }
    else if (Type == "T") { this.onLoadTeamTab(); }
    else if (Type == "DES") { this.getDesignationList(); }
    else if (Type == "S") { this.getShiftList(); }
  }

  addNewInfo() {
    this.strAddNew = this.strTabCheck;
    if (this.strAddNew == "C") { this.strAddNewTitle = "Add New Company"; this.objCompany = new Company; }
    else if (this.strAddNew == "O") { this.strAddNewTitle = "Add New Office"; this.objOffice = new Office; }
    else if (this.strAddNew == "DEP") { this.strAddNewTitle = "Add New Department"; this.objDepartment = new Department; this.getCompListForDropDown(); this.iseditable = true; }
    else if (this.strAddNew == "T") { this.strAddNewTitle = "Add New Team"; this.objTeam = new Team; this.onLoadNewTeam(); }
    else if (this.strAddNew == "DES") { this.strAddNewTitle = "Add New Designation"; this.objDesignation = new Designation; this.getDeptListForDropdown(); }
    else if (this.strAddNew == "S") { this.strAddNewTitle = "Add New Shift"; this.objShift = new Shift; }

    if (this.listShift == undefined || this.listShift == null || this.listShift.length == 0)
      this.getShiftList();

    if (this.listDesignation == undefined || this.listDesignation == null || this.listDesignation.length == 0)
      this.getDesignationList();
  }

  cancelAll() {
    debugger
    this.strAddNew = "";
    this.objCompany = new Company;
    this.objDepartment = new Department;
    this.objOffice = new Office;
    this.objTeam = new Team;
    this.objDesignation = new Designation;
    this.objShift = new Shift;  
  }

  ngOnDestroy(): void {
    this.objCompany = new Company;
    this.objDepartment = new Department;
    this.objOffice = new Office;
    this.objTeam = new Team;
    this.objDesignation = new Designation;
    this.objShift = new Shift;
  }


  //---------------------------------Company.................................// 
  getCompanyList() {
    this.API.getData('/Company/GetCompanyList').subscribe(
      data => {
        if (data.Status == 'Sucess') {
          if (this.dtCompanies) {
            this.chRef.detectChanges();
            this.dtCompanies.destroy();
          }
          this.listCompany = data.Response;
          this.chRef.detectChanges();
          this.dtCompanies = $('.dtCompanies').DataTable({
            columnDefs: [
              { orderable: false, targets: [-1] }
            ],
            language: {
              emptyTable: "No data available"
            }
          });
          this.nSelectedCompanyrow = 0;
          this.viewCompanyDetails();
        }
        else
          this.toasterService.error('Failed to Get Data', 'Error');
      });
  }

  viewCompanyDetails() {
    if (this.listCompany && this.listCompany.length > 0) {
      this.objCompany = this.listCompany[this.nSelectedCompanyrow];
      this.selectedCompanyName = this.listCompany[this.nSelectedCompanyrow].CompanyName;
      this.selectedCompanyId = this.listCompany[this.nSelectedCompanyrow].CompanyId;
    }
    else
      this.objCompany = new Company();
  }

  saveCompany() {
    if (this.isNullOrEmpty(this.objCompany.CompanyName)) {
      this.toasterService.warning('Enter Company name', 'Validation Error');
      return;
    }

    this.objCompany.IsActive = true;
    var text = this.objCompany.CompanyId ? 'Company has been updated' : 'New company has been added';
    this.API.PostData('/Company/SaveCompany/', this.objCompany, (d) => {
      if (d.Status === 'Sucess') {
        this.toasterService.success(text, 'Success!');
        this.getCompanyList();
        this.strAddNew = "";
        this.strAddNewTitle = "";
      } else {
        this.toasterService.error('Failed to Add Company', 'Error');
      }
    });
  }

  getCompanyRecord(id: number) {
    this.strAddNew = "C";
    this.strAddNewTitle = "Edit Company Information";
  }

  deleteCompany(id: number) {
    this.API.confirmFun('Do you want to delete this Company information?', '', () => {
      this.API.getData('/Company/DeleteCompany?CompanyId=' + id).subscribe(
        data => {
          this.toasterService.success('Company information has been Deleted', 'Success');
          this.getCompanyList();
        });
    });

  }

  //---------------------------------Department................................// 
 
  getDepartmentList(id?: number) {
    this.API.getData('/Company/GetDepartmentList?officeId=' + id).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          if (this.dtDepartmentList) {
            this.chRef.checkNoChanges();
            this.dtDepartmentList.destroy();
          }
          this.listDepartment = data.Response;
          this.chRef.detectChanges();
          this.dtDepartmentList = $('.dtDepartmentList').DataTable({
            columnDefs: [{
              orderable: false, targets: [-1]
            }],
            langauge: {
              emptyTable: "No data available"
            }
          });
          this.nSelectedDeprow = 0;
          this.viewDepartmentDetails();
        }
        else
          this.toasterService.error('Failed to Get Data', 'Error');
      });
  }

  viewDepartmentDetails() {
    if (this.listDepartment && this.listDepartment.length > 0)
      this.objDepartment = this.listDepartment[this.nSelectedDeprow];
    else
      this.objDepartment = new Department();
  }

  saveDepartment() {
    if (this.canSaveDepartment()) {
      this.API.PostData('/Company/SaveDepartment/', this.objDepartment, (d) => {
        if (d.Status === 'Sucess') {
          this.toasterService.success('Department information has been saved', 'Success!');
          this.strAddNew = "";
          this.strAddNewTitle = "";
          this.getDepartmentList();
        }
        else {
          this.toasterService.error('Failed to add', 'Error');
        }
      });
    }
  }

  canSaveDepartment() {
    if (this.listCompanyForDd.length > 0 && !this.objDepartment.CompanyId) {
      this.objDepartment.CompanyId = this.listCompanyForDd[0].CompanyId;
    }
    if (this.officelistForDd.length > 0 && !this.objDepartment.OfficeId) {
      this.objDepartment.OfficeId = this.officelistForDd[0].OfficeId;
    }
    if (!this.objDepartment.DepartmentName || this.objDepartment.DepartmentName.length === 0) {
      this.toasterService.warning('Enter valid Department Name', 'Validation Error');
      return;
    }
    
    else if (!this.objDepartment.CompanyId) {
      this.toasterService.warning('Please Select Company', 'Validation Error');
      return;
    }
    else if (!this.objDepartment.OfficeId) {
      this.toasterService.warning('Please Select Office', 'Validation Error');
      return;
    }
    else
      return true;
  }

  getDepartmentRecord(did: number, cid: number, oid: number) {
    this.strAddNew = "DEP";
    this.strAddNewTitle = "Edit Department Information";
    this.iseditable = false;
    this.getCompListForDropDown();
    this.objDepartment.CompanyId = cid;
    this.getCompanyOfficeDropdown(cid);
    this.objDepartment.OfficeId = oid;
  }

  deleteDepartment(id: number) {
    if (id == undefined || id == null || id == 0) {
      this.toasterService.warning('Provide Valid Department Id', 'Validation Error');
      return;
    }
    this.API.confirmFun('Do you want to delete Department information?', '', () => {
      this.API.getData('/Company/DeleteDepartment?DepartmentId=' + id).subscribe(
        data => {
          this.toasterService.success('Department information has been Deleted.', 'Success!');
          this.getDepartmentList();
        });
    });

  }

  //---------------------------------Designation.................................// 
  
  getDesignationList() {
    this.API.getData('/Company/GetDesignationList').subscribe(
      data => {
        if (data.Status === 'Sucess') {
          if (this.dtDesignations) {
            this.chRef.detectChanges();
            this.dtDesignations.destroy();
          }
          this.listDesignation = data.Response;
          this.chRef.detectChanges();
          this.dtDesignations = $('.dtDesignations').DataTable({
            columnDefs: [
              { orderable: false, targets: [-1] }
            ],
            language: {
              emptyTable: "No data available"
            }
          });
          this.nSelectedDesignationRow = 0;
          this.viewDesignationDetails();
        } else
          this.toasterService.error('Failed to Get Data', 'Error');
      });
  }

  viewDesignationDetails() {
    if (this.listDesignation && this.listDesignation.length > 0) {
      this.objDesignation = this.listDesignation[this.nSelectedDesignationRow];
      this.getOfficeIdFromDept(this.objDesignation.DepartmentID);
    }
    else
      this.objDesignation = new Designation();
  }

  getOfficeIdFromDept(deptId: number) {
    if (deptId) {
      this.API.getData('/Company/GetOfficeIdFromDept?DeptId=' + deptId).subscribe(
        res => {
          if (res.Status == "success") {
            this.getDeptListForDropdown(res.Response);
          }
          else {
            swal('Error', 'Office Was Not Found', 'error');
          }
        });
    }
  }

  saveDesignation() {
    if (this.canSaveDesignation()) {
      this.API.PostData('/Company/SaveDesignation/', this.objDesignation, (d) => {
        if (d.Status === 'Sucess') {
          this.toasterService.success('Designation information has been saved.', 'Success!');
          this.strAddNew = "";
          this.strAddNewTitle = "";
          this.getDesignationList();

        } else {
          this.toasterService.error('Failed to add', 'Error');
        }
      });
    }
  }

  canSaveDesignation() {
    if (this.listDepartmentForDd.length > 0 && !this.objDesignation.DepartmentID) {
      this.objDesignation.DepartmentID = this.listDepartmentForDd[0].DepartmentId;
    }
    if (this.isNullOrEmpty(this.objDesignation.DesignationName)) {
      this.toasterService.warning('Enter Designation Name', 'Validation Error');
      return;
    }
    else if (!this.objDesignation.DepartmentID) {
      this.toasterService.warning('Select Department', 'Validation Error');
      return;
    }
    else
      return true;
  }

  getDesignation() {
    this.strAddNew = "DES";
    this.strAddNewTitle = "Edit Designation Information";
    // this.viewDesignationDetails();
    // if (this.listDesignation == undefined || this.listDesignation == null || this.listDesignation.length == 0)
    //   this.getDesignationList();
  }

  deleteDesignation(id: number) {
    if (id == undefined || id == null || id == 0) {
      this.toasterService.warning('Provide Valid Designation Id', 'Validation Error');
      return;
    }
    this.API.confirmFun('Do you want to delete selected Designation information?', '', () => {
      this.API.getData('/Company/DeleteDesignation?DesignationId=' + id).subscribe(
        data => {
          this.toasterService.success('Designation information has been Deleted.', 'Success!');
          this.getDesignationList();
        });
    });
  }

  //---------------------------------Office.................................// 
  getOfficeList(id?: number) {
    this.API.getData('/Company/GetOfficeList?companyId=' + id).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          if (this.dtOffices) {
            this.chRef.detectChanges();
            this.dtOffices.destroy();
          }
          this.officelist$ = data.Response;
          this.chRef.detectChanges();
          this.dtOffices = $('.dtOffices').DataTable({
            destroy: true,
            columnDefs: [
              { orderable: false, targets: [-1] }
            ],
            language: {
              emptyTable: "No data available"
            }
          });
          this.nSelectedRow = 0;
          this.viewOfficeDetails();
        }
        else
          this.toasterService.error('Failed to Get Data', 'Error');
        this.temp_var = false;
      });
  }

  viewOfficeDetails() {
    if (this.officelist$ != null && this.officelist$ != undefined && this.officelist$.length > 0)
      this.objOffice = this.officelist$[this.nSelectedRow];
    else
      this.objOffice = new Office();
  }

  saveOffice() {
    if (this.isNullOrEmpty(this.objOffice.OfficeName)) {
      this.toasterService.warning('Enter Office name.', 'Validation Error');
      return;
    }
    this.API.PostData('/Company/SaveOffice/', this.objOffice, (d) => {
      if (d.Status === 'Sucess') {
        this.toasterService.success('Office information has been saved.', 'Success!');
        this.strAddNew = "";
        this.strAddNewTitle = "";
        this.selectedCompanyId = this.objOffice.CompanyId;
        this.getOfficeList(this.objOffice.CompanyId);
      } else {
        this.toasterService.error('Failed to add', 'Error');
      }
    });
  }

  getOfficeRecord(id: number) {
    this.strAddNew = "O";
    this.strAddNewTitle = "Edit Office Information";
  }

  deleteOffice(id: number) {
    if (id == undefined || id == null || id == 0) {
      this.toasterService.warning('Provide Valid Office Id.', 'Validation Error');
      return;
    }
    this.API.confirmFun('Do you want to delete this Office information?', '', () => {
      this.API.getData('/Company/DeleteOffice?OfficeId=' + id).subscribe(
        data => {
          if (data.Status == "Sucess") {
            this.toasterService.success('Office information has been Deleted.', 'Success!');
            this.getOfficeList();
          }
          else
            this.toasterService.error('Failed to Delete', 'Error');
        });
    });
  }

  //---------------------------------Shifts.................................// 
  getShiftList() {
    this.API.getData('/Company/GetShiftList').subscribe(
      data => {
        if (data.Status === 'Sucess') {
          if (this.dtShifts) {
            this.chRef.detectChanges();
            this.dtShifts.destroy();
          }
          this.listShift = data.Response;
          this.chRef.detectChanges();
          this.dtShifts = $('.dtShifts').DataTable({
            columnDefs: [
              { orderable: false, targets: [-1] }
            ],
            language: {
              emptyTable: "No data available"
            }
          });
          this.nSelectedShiftRow = 0;
          this.viewShiftDetails();
        }
        else
          this.toasterService.error('Failed to Get Data', 'Error');
      });
  }

  viewShiftDetails() {
    if (this.listShift != null && this.listShift != undefined && this.listShift.length > 0)
      this.objShift = this.listShift[this.nSelectedShiftRow];
    else
      this.objShift = new Shift();
  }

  saveShift() {
    if (this.isNullOrEmpty(this.objShift.ShiftName)) {
      this.toasterService.warning('Enter Shift name.', 'Validation Error');
      return;
    }
    this.API.PostData('/Company/SaveShift/', this.objShift, (d) => {
      if (d.Status === 'Sucess') {
        this.toasterService.success('Shift information has been saved.', 'Success!');
        this.strAddNew = "";
        this.strAddNewTitle = "";
        this.getShiftList();
      } else {
        this.toasterService.error('Failed to add', 'Error');
      }
    });
  }

  getShiftRecord(id: number) {
    this.strAddNew = "S";
    this.strAddNewTitle = "Edit Shift Information";
  }

  deleteShift(id: number) {
    if (id == undefined || id == null || id == 0) {
      this.toasterService.warning('Provide Valid Shift Id.', 'Validation Error');
      return;
    }
    this.API.confirmFun('Do you want to delete this Shift information?', '', () => {
      this.API.getData('/Company/DeleteShift?ShiftId=' + id).subscribe(
        data => {
          if (data.Status == "Sucess") {
            this.toasterService.success('Shift information has been Deleted.', 'Success!');
            this.getShiftList();
          }
          else {
            this.toasterService.error('Failed to Delete', 'Error');
          }
        });
    });
  }

  //---------------------------------Teams.................................// 
  onLoadTeamTab() {
    this.getCompListForDropDown();
    this.getCompanyOfficeDropdown(this.listCompany[0].CompanyId);
    this.getTeamList(this.listCompany[0].CompanyId);
  }

  getTeamList(cId?: number, oId?: number, dId?: number) {
    if (dId) {
      this.selectedDepartmentId = dId;
    }
    this.API.getData('/Company/GetTeamList?companyId=' + cId + '&officeId=' + oId + '&departmentId=' + dId).subscribe(
      data => {
        if (data.Status == "Sucess") {
          if (this.dtTeams) {
            this.chRef.detectChanges();
            this.dtTeams.destroy();
          }
          this.listTeam = data.Response;
          this.chRef.detectChanges();
          this.dtTeams = $('.dtTeams').DataTable({
            "scrollX": true,
            columnDefs: [
              { orderable: false, targets: [-1] }
            ],
            language: {
              emptyTable: "No data available"
            }
          });
          this.nSelectedTeamRow = 0;
          this.viewTeamDetails();
        }
        else
          this.toasterService.error('Failed to Get Data', 'Error');
      });
  }

  viewTeamDetails() {
    if (this.listTeam != null && this.listTeam != undefined && this.listTeam.length > 0)
      this.objTeam = this.listTeam[this.nSelectedTeamRow];
    else
      this.objTeam = new Team();
  }

  async onLoadNewTeam() {
    this.selectedCompanyId = this.listCompanyForDd[0].CompanyId;
    this.getCompanyOfficeDropdown(this.listCompanyForDd[0].CompanyId);
    await new Promise(f => setTimeout(f, 300));
    this.getDeptListForDropdown(this.officelistForDd[0].OfficeId);
  }

  saveTeam() {
    if (this.canSaveTeam()) {
      this.objTeam.Company = this.selectedCompanyId;
      this.objTeam.OfficeId = this.selectedOfficeId;
      if (this.objTeam.TeamId == undefined || this.objTeam.TeamId == null)
        this.objTeam.TeamId = 0;
      this.API.PostData('/Company/SaveTeam/', this.objTeam, (d) => {
        if (d.Status === 'Sucess') {
          this.toasterService.success('Team information has been saved.', 'Success!');
          this.strAddNew = "";
          this.strAddNewTitle = "";
          this.getTeamList(this.objTeam.CompanyId, this.objTeam.OfficeId, this.objTeam.DepartmentId);
        } else {
          this.toasterService.error('Failed to add', 'Error');
        }
      });
    }
  }

  canSaveTeam() {
    if (this.listCompanyForDd.length > 0 && !this.selectedCompanyId) {
      this.selectedCompanyId = this.listCompanyForDd[0].CompanyId;
    }
    if (this.officelistForDd.length > 0 && !this.selectedOfficeId) {
      this.selectedOfficeId = this.officelistForDd[0].OfficeId;
    }
    if (this.listDepartmentForDd.length > 0 && !this.objTeam.DepartmentId) {
      this.objTeam.DepartmentId = this.listDepartmentForDd[0].DepartmentId;
    }
    if (!this.objTeam.TeamName) {
      this.toasterService.warning('Enter Team Name.', 'Validation Error');
      return;
    }
    else if (!this.objTeam.TeamLead) {
      this.toasterService.warning('Enter Teamlead Name.', 'Validation Error');
      return;
    }
    else if (!this.objTeam.TeamSupervisor) {
      this.toasterService.warning('Enter Team Supervisor Name.', 'Validation Error');
      return;
    }
    else if (!this.selectedOfficeId) {
      this.toasterService.warning('Select Office', 'Validation Error');
    }
    else if (!this.objTeam.DepartmentId) {
      this.toasterService.warning('Select Department', 'Validation Error');
    }
    else
      return true;
  }

  getTeamRecord(id: number) {
    this.strAddNew = "T";
    this.strAddNewTitle = "Edit Team Information";
    this.viewTeamDetails();
    if (this.listShift == undefined || this.listShift == null || this.listShift.length == 0)
      this.getShiftList();
    if (this.listDesignation == undefined || this.listDesignation == null || this.listDesignation.length == 0)
      this.getDesignationList();
  }

  deleteTeam(TeamId: number, OfficeId: number, DepartmentId: number, CompanyId: number) {
    if (TeamId == undefined || TeamId == null || TeamId == 0) {
      this.toasterService.warning('Provide Valid Team Id.', 'Validation Error');
      return;
    }
    this.API.confirmFun('Do you want to delete Selected Team information?', '', () => {
      this.API.getData('/Company/DeleteTeam?TeamId=' + TeamId + '&OfficeId=' + OfficeId + '&DepartmentId=' + DepartmentId + '&CompanyId=' + CompanyId).subscribe(
        data => {
          this.toasterService.success('Team information has been Deleted.', 'Success!');
          this.getTeamList(CompanyId, OfficeId, DepartmentId);
        });
    });
  }

  isNullOrEmpty(str: string): boolean {
    if (str == undefined || str == null || $.trim(str) == '')
      return true;
    else return false;
  }

  //----------- Dropdown Functions---------------
  async onChangeCompany(s?: string) {
    if (s == 'D') {
      this.getCompanyOfficeDropdown(this.objDepartment.CompanyId);
      this.selectedCompanyName = this.listCompany.find(c => c.CompanyId == this.selectedCompanyId).CompanyName;
    }
    else if (s == 'T') {
      this.getCompanyOfficeDropdown(this.selectedCompanyId);
      this.getTeamList(this.selectedCompanyId);
      this.selectedCompanyName = this.listCompany.find(c => c.CompanyId == this.selectedCompanyId).CompanyName;
    }
    else if (s == 'NT') {
      this.getCompanyOfficeDropdown(this.selectedCompanyId);
      await new Promise(f => setTimeout(f, 400));
      this.getDeptListForDropdown(this.officelistForDd[0].OfficeId);
      this.selectedCompanyName = this.listCompany.find(c => c.CompanyId == this.selectedCompanyId).CompanyName;
    }
    else {
      this.getOfficeList(this.selectedCompanyId);
      this.selectedCompanyName = this.listCompany.find(c => c.CompanyId == this.selectedCompanyId).CompanyName;
    }
  }

  onChangeOffice(s?: string) {
    this.getDeptListForDropdown(this.selectedOfficeId);
    if (s == 'T') {
      this.getTeamList(this.selectedCompanyId, this.selectedOfficeId);
    }
  }

  onChangeDepartment() {
    this.getTeamList(this.selectedCompanyId, this.selectedOfficeId, this.selectedDepartmentId);
  }

  //Get company list for dropdown
  getCompListForDropDown() {
    this.API.getData('/Company/GetCompanyList').subscribe(
      data => {
        if (data.Status == 'Sucess') {
          this.listCompanyForDd = data.Response;
          this.selectedCompanyId = this.listCompanyForDd[0].CompanyId;
        }
        else
          this.toasterService.error('Failed to Get Data', 'Error');
      });
  }

  //Get office list for dropdown
  getCompanyOfficeDropdown(id?: number) {
    this.API.getData('/Company/GetOfficeList?companyId=' + id).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          this.officelistForDd = data.Response;
        }
        else
          this.toasterService.error('Failed to Get Data', 'Error');
      });
  }

  //Get department list for dropdowms
  getDeptListForDropdown(id?: number) {
    this.API.getData('/Company/GetDepartmentList?officeId=' + id).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          this.listDepartmentForDd = data.Response;
        }
        else
          this.toasterService.error('Failed to Get Data', 'Error');
      });
  }
}
