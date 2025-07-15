import { Injectable } from '@angular/core';
import * as moment from 'moment/moment'
import * as _ from 'lodash';
@Injectable()
export class GvarService {
    // serverURL1: string = 'http://184.68.78.82/NPMAPI/api';
    // serverURL: string = 'http://184.68.78.82/NPMAPI/api';
    serverURL1: string = 'http://192.168.10.80/NPMAPIV2/api';
    serverURL: string = 'http://192.168.10.80/NPMAPIV2/api';
    Patient_Account :number=0;
    uploading: boolean;
    GurantorName:string="";
    GUARANTOR_CODE:"";
    canLogin:boolean =false;
    uploaded: number = 0;
    GurrantorCall="";
    constructor() { }
    changeTo64(event,cb){
        let Myimg = event.target.files[0];
        let myReader:FileReader = new FileReader();
        myReader.onloadend = (e) => { if(cb){cb(myReader.result);} }
        myReader.readAsDataURL(Myimg);}
        isEmptyObject(obj) {
            return (obj && (Object.keys(obj).length === 0));
          }
    CheckKeys(opj, arr) { return _.findLast(_.map(arr, x => (_.isEmpty(opj[x]) && !_.isNumber(opj[x])) ? x : false), (x) => x != false); }
}
