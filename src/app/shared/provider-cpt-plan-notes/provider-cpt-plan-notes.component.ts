import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { APIService } from '../../components/services/api.service';
import { Common } from '../../services/common/common';
import { ProviderCptPlanNotes } from '../models/ProviderCptPlanNotes.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-provider-cpt-plan-notes',
  templateUrl: './provider-cpt-plan-notes.component.html',
  styleUrls: ['./provider-cpt-plan-notes.component.css']
})
export class ProviderCptPlanNotesComponent implements OnInit {
  dtProviderPlanNotes: any;
  noteForm: FormGroup;
  listProviderPlanNotes: ProviderCptPlanNotes[];
  note: ProviderCptPlanNotes;
  @ViewChild(ModalDirective) parentModal: ModalDirective;
  @ViewChild(ModalDirective) childModal: ModalDirective;
  @Input('ProviderCPTPlanId') ProviderCPTPlanId: string;
  constructor(private _apiService: APIService,
    private _chRef: ChangeDetectorRef,
    private formBuilder: FormBuilder) {
    this.listProviderPlanNotes = [];
    this.note = new ProviderCptPlanNotes();
  }

  ngOnInit(): void {
    this.InitForm();
  }

  InitForm() {
    this.noteForm = this.formBuilder.group({
      noteContent: ['', [Validators.required, Validators.maxLength(150), Validators.minLength(10)]]
    });
  }

  get formControls() {
    return this.noteForm.controls;
  }


  GetNotes() {
    if (!Common.isNullOrEmpty(this.ProviderCPTPlanId)) {
      this._apiService.getData(`/Setup/GetProviderCPTPlanNotes?PlanId=${this.ProviderCPTPlanId}`).subscribe(res => {
        if (res.Status == "Success") {
          if (this.dtProviderPlanNotes) {
            this.dtProviderPlanNotes.destroy();
          }
          this.listProviderPlanNotes = res.Response;
          this._chRef.detectChanges();
          const table: any = $('.dtProviderPlanNotes');
          this.dtProviderPlanNotes = table.DataTable({
            lengthMenu: [
              [5, 10, 15, 20],
              [5, 10, 15, 20]
            ],
            language: {
              emptyTable: "No data available"
            }
          });
        } else {
          swal("Provider CPT Fee Plan", res.Status, "info");
        }
      })
    }
  }

  SaveNote() {
    if (this.noteForm.valid) {
      this.note.Provider_Cpt_Plan_Id = this.ProviderCPTPlanId;
      this._apiService.PostData(`/Setup/SaveProviderCPTNote`, this.note, (res) => {
        if (res.Status === 'Success') {
          swal('Provider CPT Plan Notes', 'Note has been created/updated successfully.', 'success');
          this.GetNotes();
        } else {
          swal('Provider CPT Plan Notes', res.Status, 'error');
        }
      })
    }
  }

  GetRemainingCharacters() {
    if (this.note && this.note.NOTE_CONTENT && this.note.NOTE_CONTENT.length > 0) {
      return 150 - this.note.NOTE_CONTENT.length;
    }
    return 150;
  }

  onParentModalShown(e: any) {
    this.GetNotes();
  }

  onParentModalHidden(e: any) {
  }

  onChildModalShown(e: any) {

  }

  onEditNote(Note: ProviderCptPlanNotes) {
    if (Note) {
      this.note = Note;
    } else {
      this.note = new ProviderCptPlanNotes();
    }
    this.GetRemainingCharacters();
  }

  onDeleteNote(Note: ProviderCptPlanNotes) {
    if (Note) {
      this._apiService.confirmFun('Delete Confirm', 'Are you sure that you want to delete selected note?', () => {
        this._apiService.getData(`/Setup/DeleteProviderCPTNote?NoteId=${Note.Note_Id}`).subscribe(res => {
          if (res.Status === 'Success') {
            swal('Provider CPT Plan Notes', 'Note has been deleted successfully.', 'success');
            this.GetNotes();
          } else {
            swal('Provider CPT Plan Notes', res.Status, 'error');
          }
        })
      })
    }
  }

  onChildModalHidden(e: any) {
    this.note = new ProviderCptPlanNotes();
    this.noteForm.reset();
  }
}
