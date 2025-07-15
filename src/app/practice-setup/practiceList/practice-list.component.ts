import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { APIService } from '../../components/services/api.service';
import { GvarService } from '../../components/services/GVar/gvar.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var swal: any;
import { PracticeModel } from './Classes/practiceClass';
import 'datatables.net';

declare var $: any;

@Component({
    selector: 'app-practice-list',
    templateUrl: './practice-list.component.html',
    styleUrls: ['./practice-list.component.css']
})
export class PracticeListComponent implements OnInit {
    pracTable: any;
    practiceModel: PracticeModel;
    practices: any = [];
    constructor(private chRef: ChangeDetectorRef,
        public API: APIService,
        public Gv: GvarService,
        public router: Router,
        public route: ActivatedRoute) {
        this.practiceModel = new PracticeModel;
    }

    ngOnInit() {
        this.GetPracticeList();
    }

    GetPracticeList() {
        this.API.getData('/PracticeSetup/GetPractices').subscribe(
            data => {
                if (data.Status === 'Sucess') {
                    if (this.pracTable)
                        this.pracTable.destroy();
                    this.practices = data.Response;
                    this.chRef.detectChanges();
                    this.pracTable = $('.pracTable').DataTable({
                        columnDefs: [
                            { orderable: false, targets: -1 }
                        ],
                        language: {
                            emptyTable: "No data available"
                        }
                    });
                } else {
                    swal('Failed', data.Status, 'error');
                }
            }
        );
    }

    AddEditPractice(Practice_Code, practiceName = "") {
        if (Practice_Code != undefined && Practice_Code != null)
            this.API.Gv.practiceName = practiceName;
        let type = Practice_Code == 0 ? 'New' : 'Edit';
        console.log(Practice_Code+type);
        this.router.navigate(['/EditPractice/' + Practice_Code + '/' + type]);
    }
 
    viewPractice(Practice_Code, practiceName = "") {
        if (Practice_Code != undefined && Practice_Code != null)
            this.API.Gv.practiceName = practiceName;
        this.router.navigate(['/EditPractice/' + Practice_Code + '/View']);
    }

    resetFields() {
        this.practiceModel = new PracticeModel;
    }

    ActiveInActivePractice(Practice_Code) {
        let practice = this.practices.find(p => p.Practice_Code == Practice_Code);
        this.API.confirmFun('Confirmation', `Are you sure you want to ${!practice.Is_Active ? 'activate' : 'inactive'} this practice?`, () => {
            this.API.getData('/PracticeSetup/ActivateInActivePractice?practiceId=' + Practice_Code + '&isActive=' + !practice.Is_Active).subscribe(
                data => {
                    swal('Success', 'Practice status has been changed successfully.', 'success');
                    this.GetPracticeList();
                });
        });
    }

    searchPractice() {
        this.API.PostData('/PracticeSetup/GetPractices/', this.practiceModel.Response, (d) => {
            if (d.Status === 'Sucess') {

                if (this.pracTable)
                    this.pracTable.destroy();

                this.practices = d.Response;
                this.chRef.detectChanges();
                this.pracTable = $('.pracTable').DataTable({
                    language: {
                        emptyTable: "No data available"
                    }
                });
            } else {
                swal('Failed', d.Status, 'error');
            }
        });
    }
}