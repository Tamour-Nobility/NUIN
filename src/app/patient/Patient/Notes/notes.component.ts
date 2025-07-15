import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { APIService } from '../../../components/services/api.service';
import { GvarsService } from '../../../services/G_vars/gvars.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientNote } from '../../Classes/patientNotes'
import { Subject } from 'rxjs';
declare var $: any
import 'datatables.net';
@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
    dtpatientNotes: any;
    PatientNotes: any = [];
    Response: any = [];
    dataTable: any;
    public temp_var: Object = false;
    dtOptions: DataTables.Settings = {};
    dtTrigger = new Subject();
    public tableWidget: any;
    NoteDetail: string;
    public notesModel: PatientNote;
    public retPostData;
    numbtncheck: number = 0;
    constructor(private chRef: ChangeDetectorRef, public router: Router, public route: ActivatedRoute, public API: APIService, public Gv: GvarsService, ) {
        this.notesModel = new PatientNote();
    }
    ngOnInit() {
        //this.get();
    }

    AddPatientNotes() {
        this.notesModel.Patient_Account = this.Gv.Patient_Account;
        this.API.PostData('/Demographic/SavePatientNotes/', this.notesModel, (d) => {
            if (d.Status == "Sucess") {
                swal('Notes', 'Patient Notes has been saved.', 'success');
                this.notesModel = new PatientNote();
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
    clearFields() {
        this.notesModel = new PatientNote();
    }
    getPatientNote(ID) {
        this.numbtncheck = 0;
        this.API.getData('/Demographic/GetPatientNote?PatientNotesId=' + ID).subscribe(
            data => {
                this.notesModel = data.Response;
            }
        );
    }
    get() {

        if (this.Gv.Patient_Account == undefined || this.Gv.Patient_Account == null || this.Gv.Patient_Account == 0) {
            swal('Please save patient first.', '', 'info');
            return;
        }

        this.API.getData('/Demographic/GetPatientNotes?PatientAccount=' + this.Gv.Patient_Account).subscribe(
            data => {
                this.Response = data;
                if (this.dtpatientNotes)
                    this.dtpatientNotes.destroy();

                this.chRef.detectChanges();
                this.dtpatientNotes = $('.dtpatientNotes').DataTable({
                    language: {
                        emptyTable: "No data available"
                    }
                });

            }
        );
    }
    ClosePage() {
        this.API.confirmFun('Do you want to close this Patient Form?', '', () => {
            this.router.navigate(['/PatientSearch'])
        });
    }

    checkStatus(numCheck: number) {
        this.numbtncheck = numCheck;
        if (this.numbtncheck == 1) {
            this.refresh();
            this.get();
        }


    }
    refresh() {
        this.chRef.detectChanges();
    }
}


