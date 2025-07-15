import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { saveAs } from 'file-saver';

import { Common } from '../../services/common/common';
import { APIService } from '../../components/services/api.service';
import { SelectListViewModel } from '../../models/common/selectList.model';
import { FileHandlerService } from '../../components/services/file-handler/filehandler.service';
import { PatientAttachmentModel, PatientNote } from '../models/PatientAttachment.model';

const validMimeTypes = [
  "image/jpg",
  "image/png",
  "image/gif",
  "image/jpeg",
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const maximumFileSize = 20000000;
@Component({
  selector: 'patient-attachments',
  templateUrl: './patient-attachments.component.html',
  styleUrls: ['./patient-attachments.component.css']
})
export class PatientAttachmentsComponent implements OnInit {
  form: FormGroup;
  selectedFile: File;
  uploading: boolean;
  datatablePatientAttachments: any;
  attachmentTypesList: SelectListViewModel[];
  attachments: PatientAttachmentModel[];
  noteModel: PatientNote;
  filename:any;
  filetype:any;
  @Input() ExcludedClaimsIds: number[];
  @Input('PatientAccount') PatientAccount: number;
  @Output() onHidden: EventEmitter<any> = new EventEmitter();
  @ViewChild(ModalDirective) patientAttachment: ModalDirective;

  constructor(private toastr: ToastrService,
    private _apiService: APIService,
    private _fileHandlerService: FileHandlerService,
    private _chRef: ChangeDetectorRef) {
    this.attachmentTypesList = [];
    this.attachments = [];
    this.uploading = false;
    this.noteModel = new PatientNote();
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      attachment: new FormControl(null),
      attachmentTypeCode: new FormControl(null, [Validators.required])
    });
  }

  show() {
    this.patientAttachment.show();
  }

  hide() {
    this.patientAttachment.hide();
  }

  onPatientAttachmentsShown() {
    if (!Common.isNullOrEmpty(this.PatientAccount)) {
      this.getPatientAttachments();
      this.getAttachmentTypeCodes();
    }
  }

  getPatientAttachments() {
    this._apiService.getData(`/patientattachments/GetAll?patientAccount=${this.PatientAccount}`)
      .subscribe(res => {
        if (this.datatablePatientAttachments) {
          this._chRef.detectChanges();
          this.datatablePatientAttachments.destroy();
        }
        debugger;
        this.attachments = res.Response;
        debugger;
        this._chRef.detectChanges();
        const table: any = $('.datatablePatientAttachments');
        this.datatablePatientAttachments = table.DataTable({
          columnDefs: [
            { orderable: false, targets: -1 },
          ],
          order: [3, 'desc'],
          language: {
            emptyTable: "No data available"
          }
        })
      })
  }

  getAttachmentTypeCodes() {
    this._apiService.getData('/patientattachments/GetAttachmentCodeList')
      .subscribe((res) => {
        this.attachmentTypesList = res.Response;
      });
  }

  onPatientAttachmentsHidden() {
    this.selectedFile = null;
    this.form.reset();
    this.uploading = false;
  }

  onChangeFile(event: any) {
    debugger;
    this.selectedFile = null;
    const { files } = event.target;
    if (files.length === 0) {
      this.toastr.warning('Please choose file to upload.', 'File Missing');
      return;
    }
    const file = files[0];
    const { size, type } = file;
    if (!validMimeTypes.includes(type)) {
      this.toastr.warning('Please choose file with type JPG, PNG, GIF, DOC, DOCX, PDF, XLS, XLSX or TXT', 'File Type');
      return;
    }
    if (size > maximumFileSize) {
      this.toastr.warning('Maximum file size 20Mb.', 'File Size');
      return;
    }
    this.selectedFile = file;
  }

  onUpload() {
    debugger;
    if (!this.form.controls["attachmentTypeCode"].value) {
      this.toastr.warning('Please choose attachment type.', 'Attachment Type');
      return;
    }
    if (!this.selectedFile) {
      this.toastr.warning('Please choose file.', 'File Missing');
      return;
    }
    this.uploading = true;
    const formData = new FormData();
    console.log("data "+formData);
    formData.append("TypeCode", this.form.controls["attachmentTypeCode"].value);
    formData.append("PatientAccount", this.PatientAccount.toString());
    formData.append(this.selectedFile.name, this.selectedFile);
    console.log("check patient attachment data",formData)
    this._fileHandlerService.UploadFile(formData, '/patientattachments/Attach')
      .subscribe(res => {
        if (res.Status === "success") {
          debugger;
          this.form.reset();
          this.selectedFile = null;
          this.uploading = false;
          this.filetype=this.getNameFromList(
            this.attachmentTypesList,
            res.Response.Attachment_TypeCode_Id,
            "IdStr",
            "Name"
          );
          this.filename=res.Response.FileName;
          this.AddAutoNotesForNewAttachment();
          this.getPatientAttachments();
        } else {
          this.toastr.error(res.Response, 'Upload Failure');
        }
      }, (error) => {
        this.uploading = false;
      })
  }

  onDelete(id: number,description: string, filename: string) {
    debugger;
    this.filename = filename;
    this.filetype = description
    this._apiService.getData(`/patientattachments/delete?id=${id}`)
      .subscribe((res) => {
        if (res.Status === 'success') {
          this.toastr.success('Attachment has been deleted.', 'Deleted Attachment');
          this.AddAutoNotesForDeleteAttachment();
          this.getPatientAttachments();
          
        }
      });
  }

  onDownload(id: number, fileName: string) {
    this._apiService.downloadFile(`/patientattachments/Download?id=${id}`).subscribe(response => {
      let blob: any = new Blob([response]);
      saveAs(blob, fileName);
    }), error => {
      console.info('File download error');
    }, () => console.info('File downloaded successfully');
  }

  getFileDisplayName() {
    if (this.selectedFile && this.selectedFile.name) {
      if (this.selectedFile.name.length > 25)
        return this.selectedFile.name.substr(0, 24);
      return this.selectedFile.name;
    }
  }
  AddAutoNotesForNewAttachment()
  {
    debugger
    this.noteModel.Patient_Account=this.PatientAccount
     this.noteModel.IsAuto_Note=true;
     this.noteModel.Ptn_Note_Content=`Attachment Added: File Name [${this.filename}] , Type [${this.filetype}]`
     this._apiService.PostData('/Demographic/SavePatientNotes/', this.noteModel, (d) => {
         if (d.Status == "Sucess")
            debugger;
         {
          this.filename=''
          this.filetype=''
         }
         })
  }
  AddAutoNotesForDeleteAttachment()
  {
    debugger
    this.noteModel.Patient_Account=this.PatientAccount
     this.noteModel.IsAuto_Note=true;
     this.noteModel.Ptn_Note_Content=`Attachment Deleted: File Name [${this.filename}] , Type [${this.filetype}]`
     this._apiService.PostData('/Demographic/SavePatientNotes/', this.noteModel, (d) => {
         if (d.Status == "Sucess")
            debugger;
         {
          this.filename=''
          this.filetype=''
         }
         })
  }

  getNameFromList<T>(
    list: T[],
    idValue: any,
    idKey: keyof T,
    nameKey: keyof T
  ): string {
    const item = list.find(entry => String(entry[idKey]) === String(idValue));
    return item ? String(item[nameKey]) : '';
  }
}
