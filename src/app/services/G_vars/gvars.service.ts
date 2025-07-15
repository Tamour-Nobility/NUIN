import { Injectable, OnInit } from '@angular/core';
import * as moment from 'moment/moment'
import * as _ from 'lodash';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { CurrentUserViewModel } from '../../models/auth/auth';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
@Injectable()
export class GvarsService implements OnInit {
  ERADownloadButton:any=JSON.parse(localStorage.getItem('ERADownloadButton'));
  ERADownloadButtonTooltip:any=JSON.parse(localStorage.getItem('ERADownloadButtonTooltip'));
  ERADownloadButtonStatus:any=[]
  practiceChanged = new Subject<any>();

  ERAResponse:any={
    USER_NAME: '',
    PracticeCode: '',
    ENTRY_DATE: '',
    DOWNLOADED_FILE_COUNT: '',
    STATUS: '',
    FTP_EXCEPTION: '',
  }
  OSCrowAdded: boolean = false;
  OCrowAdded: boolean = false;
  CCrowAdded: boolean = false;
  VCrowAdded: boolean = false;
  ProviderCode: number = 0;
  Patient_Account: number;
  FacilityCode: number;
  FacilityName: string;
  canLogin: boolean = false;
  currentUser: CurrentUserViewModel;
  money_Mask: any = {
    align: "left",
    prefix: 'Rs. ',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    decimalSymbol: '.',
    _requireDecimal: true,
    get requireDecimal() {
      return this._requireDecimal;
    },
    set requireDecimal(value) {
      this._requireDecimal = value;
    },
    allowLeadingZeroes: true,
    decimalLimit: 2
  }
  practiceName: string;
  countnotifications: Subject<any>= new Subject();

  //Added by HAMZA ZULFIQAR as per USER STORY 119: Reporting Dashboard Implementation For All Practices
  external_practice:any;
  external_practices: number[]=[];

  constructor(public ng2ImgToolsService: Ng2ImgToolsService) {
    this.currentUser = new CurrentUserViewModel();
  }

  ngOnInit(): void {

    JSON.parse(localStorage.getItem('ERADownloadButtonStatus')) !=null ?  this.ERADownloadButtonStatus= JSON.parse(localStorage.getItem('ERADownloadButtonStatus')) : this.ERADownloadButtonStatus=[];
  }

  setSelectedPractice(practice: any) {
    this.currentUser.selectedPractice = practice;
    this.practiceChanged.next(practice); // Notify subscribers
  }
  // Add a method to set the patient_account value
  setPatientAccount(patientAccount: number): void {
    this.Patient_Account = patientAccount;
  }

  checkRole(){
    

  }
  changeTo64(event, cb) {
    let Myimg = event.target.files[0];
    this.resize(Myimg, (r) => {
      Myimg = r;
      let myReader: FileReader = new FileReader();
      myReader.onloadend = (e) => { if (cb) { cb(myReader.result); } }
      myReader.readAsDataURL(Myimg);
    })
  }
  readAsDataURL(files, cb) {
    let Myimg = files[0];
    this.resize(Myimg, (r) => {
      Myimg = r;
      let myReader: FileReader = new FileReader();
      myReader.onloadend = (e) => { if (cb) { cb(myReader.result); } }
      myReader.readAsDataURL(Myimg);
    })
  }

  // ImgPath(img,def){return img?this.serverURL+'/render/'+img:def;}
  ImgPath(img, def) { return img ? environment.baseUrl + '/uploads/' + img : def; }
  Dformat(d) { return moment(d).format('DD-MMM-YYYY ,hh:mm A') }
  CheckKeys(opj, arr) { return _.findLast(_.map(arr, x => (_.isEmpty(opj[x]) && !_.isNumber(opj[x])) ? x : false), (x) => x != false); }
  /*============================================*/
  resize(img, cb) {
    this.ng2ImgToolsService.resize([img], 400, 600).subscribe(cb);
  }
  isEmptyObject(obj) {
    this.trimObj(obj)
    return (obj && (Object.keys(obj).length === 0));
  }
  trimObj(obj) {
    if (!Array.isArray(obj) && typeof obj != 'object') return obj;
    return Object.keys(obj).reduce(function (acc, key) {
      acc[key.trim()] = typeof obj[key] == 'string' ? obj[key].trim() : (obj[key]);
      return acc;
    }, Array.isArray(obj) ? [] : {});
  }
  GetToken(): any {
    return localStorage.getItem('jwt');
  }
  checkSpcialChar(event: KeyboardEvent) {
    var regex = new RegExp("^[A-Za-z0-9? ,._-]+$");
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(str)) {
      return false;
    }
  }

//commented below code by HAMZA ZULFIQAR and Added as per USER STORY 119: Reporting Dashboard Implementation For All Practices
  // isReportingPerson() {
  //   return (Number(this.currentUser.selectedPractice.PracticeCode) === 1011005);
  // }
  isReportingPerson() {
     return this.currentUser.selectedPractice.PracticeCode==1011005?true:false;
     //Dynamic external practices checking commented for now.
    //return this.external_practice?true:false;
  }

  IsbuttonDisable(): boolean {
    debugger;
    var result = this.currentUser.RolesAndRights.some(right =>
      right.RoleName.toLowerCase() === "billing demo".toLowerCase()
    );
    return result;
  }

  //
  alertRole() : boolean{
    var result = this.currentUser.RolesAndRights.some(right =>
      right.RoleName.toLowerCase() === "Super Admin".toLowerCase()
    );
    return result;
  }
}
