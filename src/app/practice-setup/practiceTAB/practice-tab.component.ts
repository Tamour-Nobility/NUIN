import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { GvarService } from '../../components/services/GVar/gvar.service';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ComboFillingList, PracticeNotesList,
  PracticeNotesModel, Practice_Notes, PracticeNotes, PracticeModel, Provider_Working_Days_Time
  , ProviderPayer, ProviderNotes, ProviderNotesModel, SpecialInstructionModel
  , ProviderResources, ReportingModel
} from '../practiceList/Classes/practiceClass';
import { APIService } from '../../components/services/api.service';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { WCBRating, SpecialtyGroups, Specilization } from '../providers/Classes/providersClass';
import 'datatables.net'
import { Common } from '../../../app/services/common/common';
import { AddEditPracticeComponent } from '../addeditpractice/add-edit-practice.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalWindow } from '../../shared/modal-window/modal-window.component';
import { InsuranceSearchComponent } from '../../shared/insurance-search/insurance-search.component';
import { PracTabInsuranceSearchComponent } from '../../shared/prac-tab-insurance-search copy/prac-tab-insurance-search.component';
import { DatatableService } from '../../../app/services/data/datatable.service';
import { User } from '../../user-management/classes/requestResponse';





declare var $: any;


@Component({
  selector: 'app-practice-tab',
  templateUrl: './practice-tab.component.html',
  styleUrls: ['./practice-tab.component.css']
})
export class PracticeTABComponent implements OnDestroy, OnInit, AfterViewInit {
  [x: string]: any;
  ProviderCode = 50010176;
  dtPracInstruction: any;
  dtOptionsSI: DataTables.Settings = {};
  dtTriggerSI: Subject<any> = new Subject();
  listSI: any;
  checkhistorySI: boolean = false;
  objSpecialInstructionModel: SpecialInstructionModel;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;
  public temp_var: Object = false;
  listProviderResources: ProviderResources[];
  objProviderNotes: ProviderNotes;
  objProviderNotesModel: ProviderNotesModel;
  listProviderPayer: ProviderPayer[];
  listProvider_Working_Days_Time: Provider_Working_Days_Time[];
  ObjPractice_Notes: PracticeNotes;
  listPractice_Notes: Practice_Notes[];
  comboFillingList: ComboFillingList[];
  practiceNotes: PracticeNotesList;
  PracticeNotesSIList: PracticeNotesList[];
  practoceNotesListNew: PracticeNotesModel;
  objPracticeModel: PracticeModel;
  selectedValue: string;
  userContent: string;
  numActive: number = 1;
  numActiveProv: number = 1;
  numActiveSI: number = 1;
  table: any
  numProviderCode: number = 0;
  strUpdatedLocationCode: string;
  numProviderLocation: number;
  listWCBRating: WCBRating[];
  listSpecialtyGroups: SpecialtyGroups[];
  listSpecializations: Specilization[];
  SelectedPracticeCode: number = 0;
  practiceNotestable: any;
  practiceNotesSIQuestion: any;
  syncDisable: boolean = true;
  showInsuranceNamePopup: boolean = false;
  currentInsuranceNumber: number;


  objReportingModel: ReportingModel;
  ReportingModelForm: FormGroup;

  managerData: String;
  PHDData: String;
  managerDropdownData: any;

  teamLeadData: string = '';
  teamLeadDropdownData: any;

  billingAssociateData: any;
  billingAssociateDropdownData: any;

  divisionData: any;
  divisionDropdownData: any;

  usersSelectList: any;
  selectedOption: string = ''; // Set default value
  selectedShift: string = 'M';
  isAdd:boolean=false;
    listUser: User[];
   assignedUser: any;
  @ViewChild(AddEditPracticeComponent) addEditPrac: AddEditPracticeComponent;
  @ViewChild('insuranceSearch') insuranceModal: ModalWindow;
  @ViewChild(InsuranceSearchComponent) ins: InsuranceSearchComponent;
  @ViewChild(PracTabInsuranceSearchComponent) prcIns: PracTabInsuranceSearchComponent;
  constructor(private chRef: ChangeDetectorRef, public formBuilder: FormBuilder, public Gv: GvarService, public router: Router,
    public route: ActivatedRoute, private toaster: ToastrService, private gvService: GvarsService,
    public API: APIService, public datepipe: DatePipe, private spinner: NgxSpinnerService, private datatableService: DatatableService,) {
    this.ObjPractice_Notes = new PracticeNotes;
    this.listPractice_Notes = [];
    this.comboFillingList = []
    this.practiceNotes = new PracticeNotesList;
    this.practoceNotesListNew = new PracticeNotesModel;
    this.PracticeNotesSIList = [];
    this.objPracticeModel = new PracticeModel;
    this.listProvider_Working_Days_Time = [];
    this.listProviderPayer = [];
    this.objProviderNotes = new ProviderNotes;
    this.objProviderNotesModel = new ProviderNotesModel;
    this.listProviderResources = [];
    this.objSpecialInstructionModel = new SpecialInstructionModel();
    this.listWCBRating = [];
    this.listSpecialtyGroups = [];
    this.listSpecializations = [];
    this.objReportingModel = new ReportingModel();
     this.listUser = [];
  }
  Practice: string;
  ngOnInit() {

    if (localStorage.getItem('showSuccessSwal') === 'true') {
      swal('Success', 'Practice Payer has been Deleted.', 'success');
      localStorage.removeItem('showSuccessSwal');
    }

    this.route.params.subscribe(params => {
      if (params['id'] !== 0 && params['id'] !== '0') {
        this.SelectedPracticeCode = params['id'];
      }
    });
    this.numProviderCode = this.API.Gv.ProviderCode;
    this.Practice = '';
    this.Practice = this.API.Gv.practiceName + ' (' + this.SelectedPracticeCode + ')';
    if (this.SelectedPracticeCode == undefined || this.SelectedPracticeCode == null || this.SelectedPracticeCode == 0) {
      this.Practice = "(New Practice)";
      this.isAdd=true
    }
    console.log("Practicecheck", this.Practice)
    this.initForm();
    this.GetPracticeDropDownValues();
    this.GetProviderDropDown();
       this.getUsersList();
  }

  ngAfterViewInit() {

    this.chRef.detectChanges();
    this.dataTable = $('#providerPayerTable').DataTable({
      paging: true,
      searching: true,
      info: true,
      lengthMenu: [5, 10, 25, 50],
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  GetPracticeNoteList() {
    this.API.getData('/PracticeSetup/GetPracticeNotesList?PracticeId=' + this.SelectedPracticeCode + '&PracticeLocationId=' + this.SelectedPracticeCode).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          this.practiceNotes = data.Response;
        }
      });
  }
  GetProviderDropDown() {
    this.API.getData('/PracticeSetup/GetPractice?PracticeId=' + this.SelectedPracticeCode).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          this.comboFillingList = data.Response.ProvidersComboFillingList;
          this.listWCBRating = data.Response.WCBRatingList;
          this.listSpecialtyGroups = data.Response.SpecialityGroupsList;
          this.listSpecializations = data.Response.Specializations;
        }
      });
  }

  //-------------------------------Special Instruction region-------------------------------------------------


  loadPracticeNoteSIModel(check: boolean = false) {
    this.numActiveSI = 0;
    this.checkhistorySI = check;
    if (!this.SelectedPracticeCode)
      return;
    if (this.objSpecialInstructionModel.listMainSpecialInstruction)
      this.dtTriggerSI.unsubscribe();
    this.API.getData('/PracticeSetup/GetSpecialInstructionList?PracticeId=' + this.SelectedPracticeCode).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          if (this.dtPracInstruction) {
            this.chRef.checkNoChanges();
            this.dtPracInstruction.destroy();
          }
          this.objSpecialInstructionModel.listCategoryList = data.Response.CategoryList;
          this.objSpecialInstructionModel.listMainSpecialInstruction = data.Response.specialInstructionModel;
          this.sortedSpecialInsList();
        }
      });
  }

  mainNotes(check: boolean = false) {
    this.checkhistorySI = check;
    this.numActiveSI = 1;
  }


  sortedSpecialInsList() {
    if (this.objSpecialInstructionModel.objSpecialInstruction.Category_Id) {
      if (this.objSpecialInstructionModel.objSpecialInstruction.Question_Id) {
        if (this.dtPracInstruction) {
          this.chRef.detectChanges();
          this.dtPracInstruction.destroy();
        }
        this.objSpecialInstructionModel.listSpecialInstruction = this.objSpecialInstructionModel.listMainSpecialInstruction.filter(x => x.Question_Id == this.objSpecialInstructionModel.objSpecialInstruction.Question_Id);
        this.chRef.detectChanges();
        this.dtPracInstruction.destroy();
        this.dtPracInstruction = $('.dtPracInstruction').DataTable({
          language: {
            emptyTable: "No data available"
          }
        });
      }
      else
        this.objSpecialInstructionModel.listSpecialInstruction = [];
    }
    else
      this.objSpecialInstructionModel.listSpecialInstruction = [];
  }

  editInstruction(QuestionId: number = 0) {
    // if(SpecialInstructionId==undefined||SpecialInstructionId==null||SpecialInstructionId==0)
    //return;
    this.numActiveSI = 1;
    var listSI = this.objSpecialInstructionModel.listSpecialInstruction.filter(x => x.Question_Id == QuestionId);
    if (listSI) {
      this.objSpecialInstructionModel.objSpecialInstruction.Question_Id = listSI[0].Question_Id;
      this.objSpecialInstructionModel.objSpecialInstruction.Special_Instruction = listSI[0].Special_Instruction;
      this.objSpecialInstructionModel.objSpecialInstruction.Created_By = listSI[0].Created_By;
      this.objSpecialInstructionModel.objSpecialInstruction.Created_Date = listSI[0].Created_Date;
      this.objSpecialInstructionModel.objSpecialInstruction.Special_Instruction_Id = listSI[0].Special_Instruction_Id;
      this.objSpecialInstructionModel.objSpecialInstruction.Status = listSI[0].Status;
      this.objSpecialInstructionModel.objSpecialInstruction.Created_Date = listSI[0].Created_Date;
    }
  }

  addTag() {
    this.objSpecialInstructionModel.objSpecialInstruction.Special_Instruction = '';
  }

  loadQuestionsSIModel(CateogyrId: number) {
    if (!this.SelectedPracticeCode)
      return;

    if (CateogyrId == undefined || CateogyrId == null || CateogyrId == 0)
      return;

    this.API.getData('/PracticeSetup/GetSpecialInstructionQuestionByCategory?CategoryId=' + CateogyrId).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          if (this.practiceNotesSIQuestion) {
            this.chRef.detectChanges();
            this.practiceNotesSIQuestion.destroy();
          }
          this.objSpecialInstructionModel.listQuestion = data.Response;
          this.objSpecialInstructionModel.objSpecialInstruction.Question_Id = 0;
          this.sortedSpecialInsList();
        }
      });
  }


  SavePracticeInstruction() {
    if (!this.objSpecialInstructionModel.objSpecialInstruction.Category_Id) {
      swal('Select category.', '', 'error');
      return;
    }

    if (!this.objSpecialInstructionModel.objSpecialInstruction.Question_Id) {
      swal('Select Question.', '', 'error');
      return;
    }

    if (!this.objSpecialInstructionModel.objSpecialInstruction.Special_Instruction) {
      swal('Enter Instructions', '', 'error');
      return;
    }

    this.objSpecialInstructionModel.objSpecialInstruction.Practice_Code = this.SelectedPracticeCode;
    this.objSpecialInstructionModel.objSpecialInstruction.Deleted = false;
    this.API.PostData('/PracticeSetup/SaveSpecialInstruction/', this.objSpecialInstructionModel.objSpecialInstruction, (d) => {
      if (d.Status === 'Sucess') {
        swal('', 'Practice Instruction has been saved.', 'success');
        this.objSpecialInstructionModel.listSpecialInstruction = [];
        this.objSpecialInstructionModel.objSpecialInstruction.Special_Instruction = '';
        this.objSpecialInstructionModel.objSpecialInstruction.Question_Id = 0;
        this.objSpecialInstructionModel.objSpecialInstruction.Category_Id = 0;

      } else {
        swal('Failed', d.Status, 'error');
      }
    });
  }

  deleteSINote(QuestionId: number) {

    if (QuestionId == undefined || QuestionId == null || QuestionId == 0)
      return;

    this.API.confirmFun('Do you want to delete selected instruction?', '', () => {
      this.API.getData('/PracticeSetup/DeleteSpecialInstruction?QuestionId=' + QuestionId + '&PracticeId=' + this.SelectedPracticeCode).subscribe(
        data => {

          swal({ position: 'top-end', type: 'success', title: 'Practice Instruction has been Deleted.', showConfirmButton: false, timer: 1500 })

          this.loadPracticeNoteSIModel(true);

        });
    });
  }


  // ---------------------Practice Notes Region-------------------------------------------------------------------

  savePractice_Notes() {
    if (this.SelectedPracticeCode == undefined || this.SelectedPracticeCode == null || this.SelectedPracticeCode == 0)
      return;

    if (this.ObjPractice_Notes.Response.NOTE_CONTENT == undefined || this.ObjPractice_Notes.Response.NOTE_CONTENT == null || $.trim(this.ObjPractice_Notes.Response.NOTE_CONTENT) == '') {
      swal('', "Please Enter Note Description.", 'info');
      return;
    }


    this.ObjPractice_Notes.Response.PRACTICE_Code = this.SelectedPracticeCode;
    this.ObjPractice_Notes.Response.Deleted = false;
    var curDate = new Date();
    this.ObjPractice_Notes.Response.NOTE_DATE = this.datepipe.transform(curDate, 'MM/dd/yyyy');
    this.ObjPractice_Notes.Status = "Success";
    console.log(this.ObjPractice_Notes);
    this.API.PostData('/PracticeSetup/SavePracticeNote/', this.ObjPractice_Notes.Response, (d) => {
      if (d.Status === 'Sucess') {
        this.numActive = 0;

        swal({ position: 'top-end', type: 'success', title: 'Practice Notes has been saved.', showConfirmButton: false, timer: 1500 })
        this.numActive = 0;
        //swal('Practice Notes has been saved.', '', 'success');
        this.ObjPractice_Notes = new PracticeNotes;
        this.loadPracticeNotes();
      } else {
        swal('Failed', d.Status, 'error');
      }
    });
  }

  loadPracticeNotes() {
    this.numActive = 0;
    //this.dtTrigger.unsubscribe();
    if (!this.SelectedPracticeCode)
      return;
    this.API.getData('/PracticeSetup/GetPracticeNotesList?PracticeId=' + this.SelectedPracticeCode).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          if (this.practiceNotestable) {
            this.chRef.detectChanges();
            this.practiceNotestable.destroy();
          }
          this.listPractice_Notes = data.Response;
          this.chRef.detectChanges();
          this.practiceNotestable = $('.practiceNotesTable').DataTable(
            {
              language: {
                emptyTable: "No data available"
              }
            });
        }
        else {
          swal('Failed', data.Status, 'error');
        }
      });
  }
  delPracticeNote(NoteId: string) {
    this.practiceNotes.PRACTICE_Code = this.SelectedPracticeCode;
    //this.practiceNotes.NOTE_CONTENT = this.userContent;
    this.practiceNotes.Deleted = true;
  }

  deletePracticeNote(PracticeNoteId: number) {
    this.API.confirmFun('Do you want to delete this Practice note ?', '', () => {
      this.API.getData('/PracticeSetup/DeletePracticetNote?PracticeId=' + this.SelectedPracticeCode + '&PracticeNotesId=' + PracticeNoteId).subscribe(
        data => {
          swal({ position: 'top-end', type: 'success', title: 'Practice note has been Deleted.', showConfirmButton: false, timer: 1500 })
          // swal('Practice note has been Deleted.', '', 'success');
          this.loadPracticeNotes();
        });
    });
  }

  modifyPracticeNote(PracticeNoteId: number) {
    if (PracticeNoteId == undefined || PracticeNoteId == null || PracticeNoteId == 0)
      return;
    this.API.getData('/PracticeSetup/GetPracticeNote?PracticeNotesId=' + PracticeNoteId).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          this.ObjPractice_Notes.Response = data.Response;
          this.numActive = 1;
        }
        else {
          swal('Failed', data.Status, 'error');
        }

      });

  }
  // ---------------------END Practice Resources Region---------------------------------------------------------------



  // ---------------------Practice Resources Region-------------------------------------------------------------------
  loadPracticeResources() {
    this.API.getData('/PracticeSetup/GetPracticeNotesList?PracticeId=' + this.SelectedPracticeCode).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          this.listPractice_Notes = data.Response;
        } else {
          swal('Failed', data.Status, 'error');
        }
      });
  }


  // ---------------------End Practice Resources Region-------------------------------------------------------------------


  // ---------------------Provider working Hours Region-------------------------------------------------------------------Verified---
  getPracticeLocation() {
    this.API.getData('/PracticeSetup/GetPracticeLocationList?PracticeId=' + this.SelectedPracticeCode).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          this.objPracticeModel.Response.LocationComboFillingList = data.Response;
          if (this.objPracticeModel.Response.LocationComboFillingList.length > 0) {
            this.strUpdatedLocationCode = this.objPracticeModel.Response.LocationComboFillingList[0].Location_Code.toString();
            this.getProviderWorkingHours(this.strUpdatedLocationCode);
          }
        } else {
          swal('Failed', data.Status, 'error');
        }
      });
  }

  getProviderWorkingHours(LocationID) {
    if (!LocationID) {
      return;
    }
    if (!this.API.Gv.ProviderCode) {
      swal('', 'Invalid Provider Code', 'info');
      return;
    }
    this.API.getData('/PracticeSetup/GetProviderWorkingHours?ProviderId=' + this.API.Gv.ProviderCode + '&LocationId=' + LocationID).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          this.listProvider_Working_Days_Time = data.Response;
        } else {
          swal('Failed', data.Status, 'error');
        }
      });
  }

  ///----------------------------------------------------------------------------End Provider Working Hour Region--------------



  //-------------------------------------------------------Provider Payers Region --------------------------------

  getProviderPayers(LocationId) {
    if (LocationId == 0 || LocationId == undefined || LocationId == null || LocationId == "") {
      return;
    }
    if (this.ProviderCode == 0 || this.ProviderCode == undefined || this.ProviderCode == null) {
      swal('', 'Invalid Provider Code', 'info');
      return;
    }
    this.API.getData('/PracticeSetup/GetProviderPayers?ProviderId=' + this.ProviderCode + '&LocationId=' + LocationId).subscribe((data: any) => {
      if (data.Status === 'Sucess') {
        this.listProviderPayer = data.Response;
        console.log('this.listProviderPayer = data.Response;', this.listProviderPayer = data.Response)
        this.reinitializeDataTable();
      } else {
        swal('Error', data.Status, 'error');
      }
    });
  }
  //to fetch the data for practice payer - payer mapying - pir ubaid
  getPracticePayers(LocationId) {
    if (LocationId == 0 || LocationId == undefined || LocationId == null || LocationId == "") {
      return;
    }
    if (this.SelectedPracticeCode == 0 || this.SelectedPracticeCode == undefined || this.SelectedPracticeCode == null) {
      swal('', 'Invalid Practice Code', 'info');
      return;
    }

    this.API.getData('/PracticeSetup/GetPracticePayers?PracticeId=' + this.SelectedPracticeCode).subscribe((data: any) => {
      if (data.Status === 'Sucess') {
        this.listProviderPayer = data.Response;
        this.reinitializeDataTable();
      } else {
        swal('Error', data.Status, 'error');
      }
    });
  }

  reinitializeDataTable() {
    if (this.dataTable) {
      this.dataTable.destroy(); // Destroy the existing instance
    }

    this.chRef.detectChanges(); // Refresh the DOM

    this.dataTable = $('#providerPayerTable').DataTable({
      paging: true,
      searching: true,
      info: true,
      lengthMenu: [5, 10, 25, 50],
    });
  }

  getPracticeProviderLocation(Type: string = "") {
    this.API.getData('/PracticeSetup/GetPracticeLocationList?PracticeId=' + this.SelectedPracticeCode).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          this.objPracticeModel.Response.LocationComboFillingList = data.Response;
          if (this.objPracticeModel.Response.LocationComboFillingList.length > 0) {
            if (Type == "ProviderPayers") {
              this.numProviderLocation = this.objPracticeModel.Response.LocationComboFillingList[0].Location_Code;
              // this.getProviderPayers(this.numProviderLocation);
              this.getPracticePayers(this.numProviderLocation);
            }
          }
        } else {
          swal('Failed', data.Status, 'error');
        }
      });
  }
  ///----------------------------------------------------------------------------End Provider Payer Region--------------
  //----------------------------Provider Notes Region --------------------------------------------------------------------

  saveProviderNotes() {
    if (this.API.Gv.ProviderCode == undefined || this.API.Gv.ProviderCode == null || this.API.Gv.ProviderCode == 0)
      return;

    if (this.objProviderNotes.Note_Content == undefined || this.objProviderNotes.Note_Content == null || $.trim(this.objProviderNotes.Note_Content) == '') {
      swal('', "Please Enter Note Description.", 'info');
      return;
    }
    this.objProviderNotes.Provider_Code = this.API.Gv.ProviderCode;

    this.objProviderNotes.Deleted = false;
    if (this.objProviderNotes.Provider_Notes_Id == undefined || this.objProviderNotes.Provider_Notes_Id == null || this.objProviderNotes.Provider_Notes_Id == 0) {
      this.objProviderNotes.Provider_Notes_Id = 0;
      var curDate = new Date();
      this.objProviderNotes.Note_Date = this.datepipe.transform(curDate, 'MM/dd/yyyy');
      this.objProviderNotes.Note_User = "0";
    }
    this.API.PostData('/PracticeSetup/SaveProviderNote/', this.objProviderNotes, (d) => {
      if (d.Status === 'Sucess') {
        this.numActiveProv = 0;
        swal({ position: 'top-end', type: 'success', title: 'Provider Note has been saved.', showConfirmButton: false, timer: 1500 })
        this.objProviderNotes = new ProviderNotes;
        this.loadProviderNotes();
      } else {
        swal('Failed', d.Status, 'error');
      }
    });
  }

  loadProviderNotes() {
    this.numActiveProv = 0;
    if (this.API.Gv.ProviderCode == undefined || this.API.Gv.ProviderCode == null || this.API.Gv.ProviderCode == 0)
      return;

    this.API.getData('/PracticeSetup/GetProviderNotesList?providerId=' + this.API.Gv.ProviderCode).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          this.objProviderNotesModel.Response = data.Response;
        }
        else {
          swal('Failed', data.Status, 'error');
        }
      });
  }
  delProviderNote(NoteId: string) {
    this.objProviderNotes.Provider_Code = this.API.Gv.ProviderCode;
    this.objProviderNotes.Deleted = true;
  }

  deleteProviderNote(ProviderNotesId: number) {
    this.API.confirmFun('Do you want to delete this Provider note ?', '', () => {
      this.API.getData('/PracticeSetup/DeleteProviderNote?ProviderId=' + this.API.Gv.ProviderCode + '&ProviderNotesId=' + ProviderNotesId).subscribe(
        data => {
          swal({ position: 'top-end', type: 'success', title: 'Provider note has been Deleted.', showConfirmButton: false, timer: 1500 })
          this.loadProviderNotes();
        });
    });
  }

  modifyProviderNote(ProviderNoteId: number) {
    if (ProviderNoteId == undefined || ProviderNoteId == null || ProviderNoteId == 0)
      return;
    this.API.getData('/PracticeSetup/GetProviderNote?providerId=' + ProviderNoteId).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          this.objProviderNotes = data.Response;
          this.numActiveProv = 1;
        }
        else {
          swal('Failed', data.Status, 'error');
        }
      });
  }

  //-------------------------Provider Resources-----------------------------------------------

  //this.listProviderResources
  loadProviderResources() {
    if (this.API.Gv.ProviderCode == undefined || this.API.Gv.ProviderCode == null || this.API.Gv.ProviderCode == 0)
      return;
    this.API.getData('/PracticeSetup/GetProviderResources?ProviderId=' + this.API.Gv.ProviderCode).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          this.listProviderResources = data.Response;
        }
        else {
          swal('Failed', data.Status, 'error');
        }
      });
  }

  transformT(time: string) {
    if (!Common.isNullOrEmpty(time)) {
      let dummyDate = new Date();
      let hms = [];
      hms = time.split(':');
      let hrs = [];
      hrs = hms[0].split('T');
      dummyDate.setHours(hrs[1]);
      dummyDate.setMinutes(hms[1]);
      dummyDate.setSeconds(hms[2]);
      return dummyDate;
    } else {
      return "";
    }
  }

  transformD(d: any) {
    let weekDay: string = '';
    if (!d)
      return;
    else
      switch (d) {
        case "1": {
          weekDay = "Sunday";
          break;
        }
        case "2": {
          weekDay = "Monday";
          break;
        }
        case "3": {
          weekDay = "Tuesday";
          break;
        }
        case "4": {
          weekDay = "Wednesday";
          break;
        }
        case "5": {
          weekDay = "Thrusday";
          break;
        }
        case "6": {
          weekDay = "Friday";
          break;
        }
        default: {
          weekDay = "Saturday";
          break;
        }
      }
    return weekDay;
  }

  transformDate(date: string) {
    if (!Common.isNullOrEmpty(date)) {
      let dummyDate = new Date();
      let d = [];
      d = date.split('T');
      dummyDate.setDate(d[0]);
      return dummyDate;
    } else {
      return "";
    }
  }

  enableSynchronization() {
    this.addEditPrac.enableSynchronization();
  }

  onChangeVendor(event) {
    this.syncDisable = event;
  }


  //Practice reporting change  by anum
  initForm() {
    this.ReportingModelForm = this.formBuilder.group({
      ID: [''],
      ManagerID: [''],
      TeamLeadID: [''],
      Practice_Alias: [''],
      BillingAssociateID: [''],
      DivisionID: [null],
      Shift: [null],
      PHDPOCId:[null]
    });

  }
  onclose() {

    this.ReportingModelForm.reset();
    this.managerData = '';
    this.PHDData='';
    this.teamLeadData = '';
    this.billingAssociateData = '';
    this.GetPracticeDropDownValues();

  }

  emailValidator(pracAlias: string): boolean {
    var EMAIL_REGEXP = /^[a-zA-z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (EMAIL_REGEXP.test(pracAlias)) {
      return false;
    }
    return true;
  }


  isNullOrEmptyString(str: string): boolean {
    if (str == undefined || str == null || $.trim(str) == '')
      return true;
    else
      return false;
  }
  saveReportingDetails() {
  debugger
    const formData = this.ReportingModelForm.value;
    const practiceCode = this.SelectedPracticeCode
    if (this.isNullOrEmptyString(formData.Practice_Alias) && this.isNullOrEmptyString(formData.ManagerID)
      && this.isNullOrEmptyString(formData.TeamLeadID) && this.isNullOrEmptyString(formData.BillingAssociateID)
      && this.isNullOrEmptyString(formData.DivisionID)
      && this.isNullOrEmptyString(formData.Shift)
    ) {
      $('#practiceReporting').modal('hide');
    }
    else if (this.emailValidator(this.ReportingModelForm.value.Practice_Alias) && !this.isNullOrEmptyString(formData.Practice_Alias)) {
      this.toaster.warning('Enter valid Practice Alias', 'Validation');
    }

    else {

      var reportingID = this.objReportingModel && this.objReportingModel[0] ? this.objReportingModel[0].ID : null;

      this.objReportingModel = {
        ID: reportingID,
        Practice_Code: practiceCode,
        Practice_Alias: formData.Practice_Alias,
        Manager_ID: this.getValueFromArray(formData.ManagerID),
        TeamLead_ID: this.getValueFromArray(formData.TeamLeadID),
        BillingAssociate_ID: this.getValueFromArray(formData.BillingAssociateID),
        Shift: formData.Shift,
        Division_ID: formData.DivisionID,
        PHD_POCid:formData.PHDPOCId
      };
      this.API.PostData('/PracticeSetup/SaveReportingDetails', this.objReportingModel, (response) => {
        $('#practiceReporting').modal('hide');
        this.onclose();
        if (response.Status === 'Success') {
          swal('Success', 'Reporting Details have been saved successfully', 'success');
        } else {
          swal('Failed', response.Status, 'error');
        }

      });

    }

    // Here, you can send the form values to your backend or perform any other action
  }

  getValueFromArray(dropdownVal: any[]): any {
    if (typeof dropdownVal === 'string') {
      const str = dropdownVal as string; // Type assertion since TypeScript infers strOrArr as string | number[]
      return str.split('-')[0];
    } else if (Array.isArray(dropdownVal)) {
      for (let i = 0; i < dropdownVal.length; i++) {
        if (dropdownVal[i] !== undefined) {
          return dropdownVal[i].split('-')[0];
        }
      }
      return undefined; // Return undefined if no non-undefined value found
    } else {
      return 'Other';
    }
  }

  GetPracticeDropDownValues() {

    // Fetch active users for the selected practice code
    this.API.getData('/PracticeSetup/GetActiveUsersForPractice?practiceCode=' + this.SelectedPracticeCode).subscribe(
      data => {
        if (data.Status === 'Success') {
          console.log('Active Users', data);
          // Map response data to desired format for dropdown
          const resData = data.Response.map(user => `${user.EmpId}-${user.LastName}, ${user.FirstName}`);
          this.usersSelectList = resData;
          console.log('User List', this.usersSelectList);
        }
      },
      error => {
        console.error('Error fetching active users:', error);
      }
    );

    // Fetch divisions for the user
    this.API.getData('/PracticeSetup/GetDivisionForUser').subscribe(
      data => {
        if (data.Status === 'Success') {
          console.log('Users Division', data);
          this.divisionDropdownData = data.Response;
        }
      },
      error => {
        console.error('Error fetching divisions:', error);
      }
    );
  }
  get f() {
    return this.ReportingModelForm.controls;
  }

  ReportingDataOnLoad() {

    this.GetReportingDetailOfUser();

  }

  GetReportingDetailOfUser() {
    debugger
    this.API.getData('/PracticeSetup/GetReportingDetailOfPracticeUser?userID=' + this.gvService.currentUser.userId + '&practiceCode=' + this.SelectedPracticeCode).subscribe(data => {
      if (data.Status == 'Success') {
        debugger
        this.objReportingModel = data.Response;
        this.f.ID.setValue(this.objReportingModel[0].ID);
        this.f.Practice_Alias.setValue(this.objReportingModel[0].Practice_Alias);
        this.f.DivisionID.setValue(this.objReportingModel[0].Division_ID);
            this.f.PHDPOCId.setValue(this.objReportingModel[0].PHD_POCid);
        this.f.Shift.setValue(this.objReportingModel[0].Shift);
        this.getUserNameFromList(this.objReportingModel[0].Manager_ID, 'Manager').then(
          this.getUserNameFromList(this.objReportingModel[0].TeamLead_ID, 'TL').then(
            this.getUserNameFromList(this.objReportingModel[0].BillingAssociate_ID, 'BA')))


      }
      else {
        // this.toaster.error(data.Status, 'Error');
      }
    });
  }


  getUserNameFromList(ID, dropdownType) {
    debugger
    return this.usersSelectList.map(item => {
      console.log('Split item', item.split('-')[0])
      if (item.split('-')[0] === String(ID)) {
        if (dropdownType === 'Manager') {
          this.managerData = item;
         
        }
        else if (dropdownType === 'TL') {

          this.teamLeadData = item;
        } 
         else if (dropdownType === 'PHDPOC') {

           this.PHDData =item;
        }
        else {
          this.billingAssociateData = item;
        }
        return item;

      }
    });
  }
  getProviderCode(Type: string = "") {
    this.toaster.warning('getProviderCode is called', 'Validation');
    this.API.Gv.ProviderCode = this.saveProviderModel.Provider_Code;
    if (Type == 'ProviderPayers') {
      this.toaster.error('ProviderPayers is called', 'Validation');
      setTimeout(function () {
        $("#btnProviderPayer").trigger("click");
      }, 100);
    }
    else if (Type == "ProviderNotes") {

    }
    else if (Type == "ProviderResources") {
      this.toaster.error('ProviderResources is called', 'Validation');
      setTimeout(function () {
        $("#btnProviderResources").trigger("click");
      }, 100);

    }
    else {
      setTimeout(function () {
        this.toaster.error('btnLoadLocation is called', 'Validation');
        $("#btnLoadLocation").trigger("click");
      }, 100);
    }
  }
  ShowInsuranceNamePopup() {
    this.insuranceModal.show();
    //this.currentInsuranceNumber = ndx;
  }

  onCloseSearch() {
    this.prcIns.clearForm();

  }

  deleteProviderPayer(providerPayerId: string) {
    this.API.confirmFun('Confirmation', 'Do you want to delete this Payer?', () => {
      this.API.getData(`/PracticeSetup/DeletePracticePayers?PracticeId=${this.SelectedPracticeCode}&ProviderPayerId=${providerPayerId}`).subscribe(
        data => {
          if (data.Status === 'Success') {
            this.listProviderPayer = data.Response;
            localStorage.setItem('showSuccessSwal', 'true');
            window.location.reload();
          } else {
            alert(data.Response);
          }
        }
      );
    });
  }

  handleMapSuccess(): void {
    $('#providerpayersInfo').modal('hide');
  }

getUsersList() 
  {
    debugger
      this.API.getData('/UserManagementSetup/GetUsersList').subscribe(
      data => {
        if (data.Status === 'Success')
        {
           this.listUser = data.Response;
           let users = data.Response.map((user: any) => ({
        ...user,
        DisplayLabel: `${user.UserName} | ${user.FirstName} ${user.LastName}`
      }));
      this.listUser = [
          { UserId: null, DisplayLabel: 'Select' }, 
          ...users
        ];
      
        }
      });
  }


}
