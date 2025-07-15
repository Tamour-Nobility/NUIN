import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Common } from '../../services/common/common';
import { EraSummaryDetailsResponse } from '../models/era-claim-details-response.model';

declare var $: any;

import { APIService } from '../../components/services/api.service';
@Component({
  selector: 'app-era-viewer',
  templateUrl: './era-viewer.component.html',
  styleUrls: ['./era-viewer.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ERAViewer implements OnInit {
  eraId: number;
  data: EraSummaryDetailsResponse;
  constructor(private route: ActivatedRoute,
    private toastService: ToastrService,
    private API: APIService
  ) {
    this.data = new EraSummaryDetailsResponse();
    this.data.era = null;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== 0 && params['id'] !== '0') {
        this.eraId = params['id'];
        this.getEraDetails();
      }
    });
  }

  getEraDetails() {
    this.data = new EraSummaryDetailsResponse();
    this.data.era = null;
    if (!Common.isNullOrEmpty(this.eraId)) {
      this.API.PostData('/Submission/EraSummary', { eraId: this.eraId }, (res) => {
        if (res.Status == "success")
          this.data = res.Response;
        else if (res.Status === 'invalid-era-id')
          this.toastService.error('Please provide valid ERA Id', 'Invalid ERA Id');
        else
          this.toastService.error('An error occurred', 'Error');
      });
    } else {
      this.toastService.error('Invalid ERA Id');
    }
  }

  getAdjustmentAmount(amt1, amt2) {
    return parseFloat(amt1) + parseFloat(amt2);
  }
}