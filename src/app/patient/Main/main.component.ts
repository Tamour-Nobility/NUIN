import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../../services/common/common';
import { ClaimService } from '../../services/claim/claim.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  intStatus: number = 0;
  patientInfo: any;
  encodedPatientInfo: string;
  activeTab: string = 'demographics';
  constructor(private route: ActivatedRoute,
    private claimsService: ClaimService,
    private router: Router) {

  }

  ngOnInit() {
    this.claimsService.claimTabActive.subscribe(r => {
      if (r){
        this.activeTab = r;
      }
       
    }
    )
    this.route.children[0].params.subscribe(params => {
      if (params) {
        this.encodedPatientInfo = params['param'];
        this.patientInfo = JSON.parse(Common.decodeBase64(this.encodedPatientInfo));
      }
    });
  }

  isNewPatient(): boolean {

    return Common.isNullOrEmpty(this.patientInfo.Patient_Account);
  }

  isClaimTabVisible(): boolean {
    return (this.router.url.indexOf('/Patient/Demographics/ClaimDetail') > -1);
  }
}
