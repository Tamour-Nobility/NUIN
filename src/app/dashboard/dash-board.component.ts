import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { DatePipe, DecimalPipe, formatDate } from '@angular/common'
import { ToastrService } from 'ngx-toastr';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as moment from 'moment';

import { Common } from '../services/common/common';
import { APIService } from '../components/services/api.service';
import { GvarsService } from '../services/G_vars/gvars.service';
import { DashboardRefreshService } from '../services/data/dashboard.service';
import { ClaimService } from '../services/claim/claim.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as Chart from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {
  // viewModePC: string = 'chart';  // Initialize to 'chart' to show the chart by default

  @ViewChild('chartButton') chartButton: ElementRef<HTMLButtonElement>;
  practiceSubscription: Subscription;
  
  selectedRange: string;
  gaugeChart: any;
  pcRatio: any[] = [];
  data: any;
  // fromDate: string = '';
  // toDate: string = '';
  isCustomDateRange: boolean = false;
  // Other properties for charts and data
  viewMode: string = 'chart';
  viewModePC : string = 'PCtable';
  viewModePA: string = 'chart';
  viewModeCPA: string = 'chart';
  viewModeChargesAndPaymentsTrend : string = 'chart';
  fromDate : Date; 
  toDate :Date;
  today: string;
  cpaColumns: string[];
  ClaimsSubmitted = '';
  PendingClaims = '';
  TotalVisits = '';
  PostedERA= '';
  StatementCount='';
  PatientCount='';
  UnpostedERAs='';
  chartData :any[]= [
    { 
      data: [], 
      label: 'Charges',
      fill: false,
      lineTension: 0,
    },
    { 
      data: [], 
      label: 'Payments',
      fill: false,
      lineTension: 0
    }
  ];
  chartDataPC : any[] = [];
  chartLabels: string[] = [];
  chartLabelsPC: string[]=[];
  chartOptions: any = {
    plugins: {
      datalabels: {
        display: false // Disable the datalabels plugin
      }
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false, // Hide the vertical grid lines
        }
      }],
      yAxes: [{
        gridLines: {
          display: true,
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.1)',
          zeroLineColor: 'rgba(0, 0, 0, 0.1)',
          borderDash: [],
        }
      }]
    },
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'bottom'
    }
  };
  
  chartColors: any[] = [
    { backgroundColor: 'rgba(0,123,255,0.3)', borderColor: 'rgba(0,123,255,1)' },
    { backgroundColor: '#EC7B2D', borderColor: '#EC7B2D' }
  ];

  barchartColors: any[] = [
    { backgroundColor: '#5C9EDA', borderColor: '#5C9EDA' },
    // { backgroundColor: 'rgba(255,193,7,0.3)', borderColor: 'rgba(255,193,7,1)' }
  ];
  
  cardData= [
    { title: 'Claims Submitted', value: this.ClaimsSubmitted },
    { title: 'Pending Claims', value: this.PendingClaims },
    { title: 'Total Visits', value: this.TotalVisits },
    { title: 'Posted ERA', value: this.PostedERA },
    { title: 'Unposted ERAs', value: this.UnpostedERAs },
    { title: 'Patient Count', value: this.PatientCount },
    { title: 'Statement Count', value: this.StatementCount }
  ];
  tableData: any[] = [];
  tableDataInsuarance : any[] = [];
  tableDataPA : any[] = [];
  tableDataPC : any[] = [];

  //#region Chart 1
  // public barChartOptions: ChartOptions = {
  //   responsive: true,
  //   scales: {
  //     xAxes: [{
  //       gridLines: {
  //         display: true,
  //         drawBorder: false, 
  //         color: 'rgba(0, 0, 0, 0.1)',
  //         zeroLineColor: 'rgba(0, 0, 0, 0.1)', 
  //         borderDash: [], 
  //       }
  //     }],
  //     yAxes: [{
  //       gridLines: {
  //         display: false,
  //       }
  //     }]
  //   },
  //   legend: {
  //     display: false
  //   },
  //   plugins: {
  //     datalabels: {
  //       display: true,
  //       align: 'center',
  //       anchor: 'center',
  //      //  offset: 500,
  //       // formatter: (value, context) => {
  //       //   if (value !== null && value !== undefined) {
  //       //     return '                                                   $ ' + value.toFixed(2);
  //       //   }
  //       //   return ''; // or any default string you prefer
  //       // }

  //       formatter: (value, context) => {
  //         if (context.dataIndex === 0) { // "Payments" data label
  //           return '                                                         $ ' + value.toFixed(2);
  //         } else if (context.dataIndex === 1) { // "Charges" data label
  //           return '                                                                      $ ' + value.toFixed(2);
  //         } else if (context.dataIndex === 2) { // "Adjustments" data label 
  //           return '                                                    $ ' + value.toFixed(2);
  //         }
  //         return ''; // or any default string you prefer
  //       },
  //       // offset: (context) => {
  //       //   if (context.dataIndex === 1) { // "Payments" data label
  //       //     return -60; // Adjust the offset value as needed
  //       //   } else {
  //       //     return -40; // Adjust the offset value as needed for other data labels
  //       //   }
  //       // }
      
  //     }
  //   },
  // };
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        gridLines: {
          display: true,
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.1)',
          zeroLineColor: 'rgba(0, 0, 0, 0.1)',
          borderDash: [],
        }
      }],
      yAxes: [{
        gridLines: {
          display: false,
        }
      }]
    },
    legend: {
      display: false
    },
    plugins: {
      datalabels: {
        display: true,
        align: 'center',
        anchor: 'start',
        formatter: (value, context) => {
          let label = '';
          if (context.dataIndex === 0) { // "Payments" data label
            label = '                      $ ' + value.toFixed(2);
          } else if (context.dataIndex === 1) { // "Charges" data label
            label = '                      $ ' + value.toFixed(2);
          } else if (context.dataIndex === 2) { // "Adjustments" data label
            label = '                      $ ' + value.toFixed(2);
          }
          return label;
        },
        clamp: true, // Ensures labels are confined within the chart area
        font: { size: 12 }, // Adjust font size as needed
        // color: '#000', // Optional: set font color
        textAlign: 'center', // Optional: align text within the label
        // Adjust other options as needed to fit your design
      }
    },
  };
  


  
  //for guage chart
  public gaugeChartData: number[] = [75]; // Data for the gauge chart
  public gaugeChartLabels: string[] = ['Progress']; // Label for the gauge chart
  public gaugeChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    circumference: Math.PI,
    rotation: -Math.PI,
    cutoutPercentage: 85,
    tooltips: {
      enabled: false
    }
  };
//
  // pie chart for insurance aging
 
  doughnutChartData: number[] = [10, 20, 30,44,66];
  doughnutChartLabels: string[] = ['0-30', '31-60', '61-90','91-120','120+'];
  doughnutChartType: ChartType = 'pie';
  pieChartColors = [
    {
      backgroundColor: ['#5C9EDA', '#ed7d31', '#a5a5a5','#ffc000','#4472c4']
    },
  ];
  doughnutChartPercentages: number[] = [];

  doughnutChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      datalabels: {
        color: 'black', 
        display : false,
        // font: {
        //   weight: 'bold' 
        // }
      }
    },
    legend : {
      position : 'bottom',
      labels: {
        boxWidth: 10,
      }
         },
         tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const index = tooltipItem.index;
              const label = data.labels[index] || '';
              const value = data.datasets[0].data[index] !== null && data.datasets[0].data[index] !== undefined ? data.datasets[0].data[index] : 0;
              const percentage = this.doughnutChartPercentages[index] !== null && this.doughnutChartPercentages[index] !== undefined ? this.doughnutChartPercentages[index].toFixed(2) : '0';
              return `${label}: ${value} (${percentage === '0' ? '0%' : percentage + '%'})`;

            }
          }
        }

    
} 
  
// pie chart for patient aging.
 
// doughnutChartDataPA: number[] = [10, 20, 30,44,66];
// doughnutChartLabelsPA: string[] = ['0-30', '31-60', '61-90','91-120','120+'];
// doughnutChartTypePA: ChartType = 'pie';


// doughnutChartOptionsPA: ChartOptions = {
//   responsive: true,
//   maintainAspectRatio: true,
//   plugins: {
//     datalabels: {
//       color: 'black', 
//       // font: {
//       //   weight: 'bold' 
//       // }
//     }
//   },
//   legend: {
//     position: 'bottom',
//     labels: {
//       boxWidth: 10,
//     }
//   },
 
// };

doughnutChartDataPA: number[] = [10, 20, 30,44,66];
doughnutChartLabelsPA: string[] = ['0-30', '31-60', '61-90','91-120','120+'];
doughnutChartTypePA: ChartType = 'pie';
 doughnutChartPercentagesPA: number[] = [];

doughnutChartOptionsPA: ChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    datalabels: {
      display : false,
      color: 'black', 
      // font: {
      //   weight: 'bold' 
      // }
    }
  },
  legend: {
    position: 'bottom',
    labels: {
      boxWidth: 10,
    }
  },
 tooltips:{
  callbacks:{
    label: (tooltipItem, data) => {
      const index = tooltipItem.index;
      const label = data.labels[index] || '';
      const value = data.datasets[0].data[index] !== null && data.datasets[0].data[index] !== undefined ? data.datasets[0].data[index] : 0;
      const percentage = this.doughnutChartPercentagesPA[index] !== null && this.doughnutChartPercentagesPA[index] !== undefined ? this.doughnutChartPercentagesPA[index].toFixed(2) : '0';
      return `${label}: ${value} (${percentage === '0' ? '0%' : percentage + '%'})`;
    }
  }
 }
};





 public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartLabels: string[] = [];
  public barChartData: ChartDataSets[] = [{ data: [], label: 'Insurance' }, { data: [], label: 'Patient' }];
  //#endregion
  //#region Chart 2
  public barChartOptions2: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartType2: ChartType = 'bar';
  public barChartLegend2 = true;
  public barChartLabels2: string[] = [];
  public barChartData2: ChartDataSets[] = [];
  //#endregion
  //#region Chart 3
  public lineChartData: any[] = [];

  public lineChartLegend: boolean = true;

  public lineChartLabels: string[] = [];

  public lineChartType: string = 'line';

  public lineChartOptions: any = {
    responsive: true
  };

  public lineChartColors: any[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgb(66, 132, 244,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgb(244, 67, 54)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }];
    modalRef?: BsModalRef;
  //#endregion
  //#endregion

  // pc ratio chart
  public pcRatioValue: number;
  public doughnutChartLabelsPC: Label[] = ['PC Ratio', 'Remaining'];
  public doughnutChartDataPC: number[]=[0,100];
  public PCChartValue : number
  public chartOptionsPC: ChartOptions = {
    rotation: 1 * Math.PI,
    circumference: 1 * Math.PI,
    cutoutPercentage: 80,
    responsive: true,
    title: {
      display: false,
      text: 'PC Ratio'
    },
    tooltips: {
      enabled: false
    },
    legend: {
      display: false
    },
    plugins: {
      datalabels: {
        display: false
      }
    }
  };
  public chartColorsPC: Color[] = [
    {
      backgroundColor: ['green', 'lightgray'],
      borderWidth: 0
    }
  ];


  constructor(private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastService: ToastrService,
    private API: APIService,
    private _decimalPipe: DecimalPipe,
    private gv: GvarsService,
    private dashboardRefresh: DashboardRefreshService,
    private claimservice: ClaimService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private modalService: BsModalService) {
    this.claimservice.GetUsersClaimNotifications(this.gv.currentUser.selectedPractice.PracticeCode, false);
    this.claimservice.GetUsersAccountNotifications(this.gv.currentUser.selectedPractice.PracticeCode, false);
    this.data = [];
      this.selectDateRange('MTD');
  }

  ngOnInit() {
  this.disableFutureDate();
    this.practiceSubscription = this.gv.practiceChanged.subscribe((practice) => {
      // React to practice change here, e.g., refresh data
      this.refreshData(); 
    });

   // this.selectDateRange('MTD');
    this.showChartPC()

      //  //by HAMZA to get external practices..............
     //Dynamic external practices checking commented for now.
      //     this.API.getDataWithoutSpinner(`/Dashboard/GetExternalPractices`).subscribe(data => {
      //       this.gv.external_practices = data.Response;
      //     })


    // this.getDashboardData();
   // const fromDate = new Date('1/13/2023');
    //const toDate = new Date('9/13/2023');

   // this.getDashboardData(this.fromDate, this.toDate);

    // this.dashboardRefresh.refresh.subscribe((r) => {
    //   debugger
    //   // this.getDashboardData();
    //   this.getDashboardData(this.fromDate, this.toDate);
    //   this.selectDateRange('MTD');
    // })


    //this.selectDateRange('MTD');

   

  }
  ngOnDestroy() {
    if (this.practiceSubscription) {
      this.practiceSubscription.unsubscribe();
    }
  }
  refreshData() {
   //  this.getDashboardData();

     this.selectDateRange('MTD');
  }
  refreshAfterPraqctice(){
    this.dashboardRefresh.refresh.subscribe((r) => {
      // this.getDashboardData();
      this.getDashboardData(this.fromDate, this.toDate);
      this.selectDateRange('MTD');
    })

  }
  ngAfterViewInit() {
    this.chartButton.nativeElement.click();
  }
  
  getTitleColor(title: string): string {
    switch (title) {
      case 'Statement Count':
        return 'blue';
      case 'Patient Count':
        return 'green';
      case 'Unposted ERAs':
        return 'red';
        case 'Total Visits':
        return 'red';
        case 'Pending Claims':
        return 'red';
        case 'ClaimsSubmitted':
        return 'red';
      default:
        return 'Posted ERA';
    }
  }


selectDateRange(range: string): void {
  this.spinner.show();
  this.selectedRange = range;
  this.isCustomDateRange = (range === 'Custom');
  const today = new Date();
today.setHours(0, 0, 0, 0);
  let fromDate: Date, toDate: Date;

  switch (range) {
    case 'MTD':
      fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
      toDate = today;
      this.resetDateRange();
      break;
    case 'YTD':
      fromDate = new Date(today.getFullYear(), 0, 1);
      toDate = today;
      this.resetDateRange();
      break;
    case 'LastMonth':
      fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      toDate = new Date(today.getFullYear(), today.getMonth(), 0);
      this.resetDateRange();
      break;
    case 'Custom':
      if (this.fromDate!= null && this.toDate != null) {
        //fromDate = new Date(this.fromDate);
        //toDate = new Date(this.toDate);
        const _fromDate = Common.isNullOrEmpty(this.fromDate) ? null : moment(this.fromDate);
        const _toDate = Common.isNullOrEmpty(this.toDate) ? null : moment(this.toDate);
        fromDate=_fromDate.toDate();
        toDate=_toDate.toDate();
        if (!this.validateDateRange(fromDate, toDate)) {
          swal('Failed', "The selected date range should not exceed 12 months.", 'error');
          this.resetDateRange();
          this.spinner.hide(); 
          return; 
        }
      } else {
        this.spinner.hide(); 
        return; 
      }
      break;
    default:
      this.spinner.hide(); 
      return;
  }

  this.getDashboardData(fromDate, toDate);
}
disableFutureDate(){
  const todayDate = new Date();
    const yyyy = todayDate.getFullYear();
    const mm = String(todayDate.getMonth() + 1).padStart(2, '0'); 
    const dd = String(todayDate.getDate()).padStart(2, '0');
    this.today = `${yyyy}-${mm}-${dd}`;
}
onDateChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  const dateValue = new Date(input.value);
  if (dateValue.getFullYear() > 1900) {
    this.updateDateRange();
      // Valid year, proceed with your logic
  }
}
updateDateRange(): void {
  if (this.isCustomDateRange && this.fromDate && this.toDate) {
    // const fromDate = new Date(this.fromDate);
    // const toDate = new Date(this.toDate);
    const fromDate = Common.isNullOrEmpty(this.fromDate) ? null : moment(this.fromDate);
    const toDate = Common.isNullOrEmpty(this.toDate) ? null : moment(this.toDate);
      
 // Check if from date is greater than to date
 if (fromDate > toDate) {
  swal('Failed', 'From date cannot be greater than To date.', 'error');
  this.resetDateRange();
  return;
}

    if (this.validateDateRange(fromDate.toDate(), toDate.toDate())) {
      this.getDashboardData(fromDate.toDate(), toDate.toDate());
    } else {
      swal('Failed', "The selected date range should not exceed 12 months.", 'error');
      this.resetDateRange();
      this.spinner.hide(); 
      
    }
  }
}
validateDateRange(fromDate: Date, toDate: Date): boolean {
  const diffInMonths = (toDate.getFullYear() - fromDate.getFullYear()) * 12 + toDate.getMonth() - fromDate.getMonth();
  return diffInMonths <= 11;
}

resetDateRange(): void {
  this.fromDate = null;
  this.toDate = null;
} 





  // getDashboardData() {

  //   this.API.getData(`/Dashboard/GetDashboardData?practiceCode=${this.gv.currentUser.selectedPractice.PracticeCode}`)
  //   .subscribe(res => {
  //       if (res.Status === 'success') {

  //         this.updateChart(res.Response);
  //         this.data = res.Response;
  //         console.log("my chanegs in dashboard",this.data);

          
  //   //About notifications of claim and account level assignments
  //   this.claimservice.GetUsersClaimNotifications(this.gv.currentUser.selectedPractice.PracticeCode, false);
  //   this.claimservice.GetUsersAccountNotifications(this.gv.currentUser.selectedPractice.PracticeCode, false);
       
  //       }
  //       else {
  //         this.toastService.error(res.Response, 'Error');
  //       }
  //     });
  // }

getDashboardData(fromDate: Date, toDate: Date) {
  debugger;
  const practiceCode = this.gv.currentUser.selectedPractice.PracticeCode;
  let _fromDate = this.datePipe.transform(fromDate, 'MM-dd-yyyy')!;
  let _toDate = this.datePipe.transform(toDate, 'MM-dd-yyyy')!;
  this.API.getData(`/Dashboard/GetDashboardData?practiceCode=${practiceCode}&fromDate=${_fromDate}&toDate=${_toDate}&userId=${this.gv.currentUser.userId}`)
    .subscribe(res => {
      if (res.Status === 'success') {
        this.updateChart(res.Response);
        this.updateTableData(res.Response);
        this.updateTableDataInsurance(res.Response);
        this.updateTableDataPA(res.Response);
        this.updateTableDataPC(res.Response);
        // this.processDashboardData(res.Response);
        this.data = res.Response;
        

        // About notifications of claim and account level assignments
        this.claimservice.GetUsersClaimNotifications(practiceCode, false);
        this.claimservice.GetUsersAccountNotifications(practiceCode, false);
      } else {
        this.toastService.error(res.Response, 'Error');
      }
    });
}
updateTableDataInsurance(data) {
  this.tableDataInsuarance = data.insuranceAging.map(item => ({
    agingSlot: item.AGINGSLOT,
    insuranceAging: item.INSURANCEAGING !== null ? item.INSURANCEAGING : 0,
    percentage: item.Percentage !== null ? item.Percentage : 0,
  }));
}
updateTableDataPA(data){
  this.tableDataPA = data.patientAging.map(item =>({
    agingSlot : item.AGINGSLOT,
    patientAging : item.PATIENTAGING !== null ? item.PATIENTAGING : 0,
    percentage : item.PERCENTAGE !== null ? item.PERCENTAGE : 0,
  }))
}

updateTableData(data) {
  const { ChargesANDPaymentsTrend } = data;
  const { PCRatio } = data;
  
  if (ChargesANDPaymentsTrend) {
    const chargesData = ChargesANDPaymentsTrend.find(item => item['Data Type'] === 'Charges');
    const paymentsData = ChargesANDPaymentsTrend.find(item => item['Data Type'] === 'Payments');

    // if (chargesData && paymentsData) {
    //   this.tableData = Object.keys(chargesData).slice(1).map((month) => ({
    //     month: month !== 'Month_Year' ? month : 'NA',
    //     charges: chargesData[month] !== undefined && chargesData[month] !== null ? chargesData[month] : 0,
    //     payments: paymentsData[month] !== undefined && paymentsData[month] !== null ? paymentsData[month] : 0
    //   }));
    // }
    // Generate tableData with missing data handled
    this.tableData = this.chartLabels.map((month) => ({
      month: month !== 'Month_Year' ? month : 'NA',
      charges: chargesData && chargesData[month] !== undefined && chargesData[month] !== null ? chargesData[month] : 0,
      payments: paymentsData && paymentsData[month] !== undefined && paymentsData[month] !== null ? paymentsData[month] : 0
    }));
  }
  // if (PCRatio) {
  //   const charges = PCRatio.find(item => item['Data Type'] === 'Charges');
  //   const payments = PCRatio.find(item => item['Data Type'] === 'Payments');
  //   const pcRatio = PCRatio.find(item => item['Data Type'] === 'PCRatio');
  
  //   if (charges && payments && pcRatio) {
     
  //     this.tableDataPC = charges.map((chargeData, index) => ({
  //       charges: chargeData.value !== undefined && chargeData.value !== null ? chargeData.value : 0,
  //       payments: payments[index].value !== undefined && payments[index].value !== null ? payments[index].value : 0,
  //       pcRatio: pcRatio[index].value !== undefined && pcRatio[index].value !== null ? pcRatio[index].value : 0
  //     }));
  //   }
  
  //   console.log('PC Table Data:', this.tableDataPC);
  // }
  


}


updateTableDataPC(data) {
  if (!data || !data.pcRatio || data.pcRatio.length === 0) {
    // Handle case where data or pcRatio is empty or undefined
    this.tableDataPC = [{ charges: '0', payments: '0', pcRatio: '0 %' }];
    return;
  }

  // Map data only if pcRatio is available
  // const mappedData = data.pcRatio.map(item => ({

  //   charges: item.DataType === 'Charges' ? (item.Total!=null? (`$ ${item.Total.toFixed(2)}`):'$0') : '$0',
  //   payments: item.DataType === 'Payments' ? (item.Total!=null? (`$ ${item.Total.toFixed(2)}`):'$0') : '$0',
  //   pcRatio:item.PCRatio!=null? (`${item.PCRatio} %`):'0%'
  // }));
  const mappedData = data.pcRatio.map(item => ({

    charges: item.DataType === 'Charges' ? (item.Total!=null? (`${item.Total.toFixed(2)}`):'0') : '0',
    payments: item.DataType === 'Payments' ? (item.Total!=null? (`${item.Total.toFixed(2)}`):'0') : '0',
    pcRatio:item.PCRatio!=null? (`${item.PCRatio} %`):'0%'
  }));


  this.tableDataPC = mappedData;

}




  updateChart(data) {
    // first chart
    const { agingDashboard, recentAgingSummary, recentChargesPayment,ChargesANDPaymentsTrend,CPAAnalysis,claimsAndERAs,insuranceAging,patientAging,pcRatio} = data;
    // if (agingDashboard) {
    //   this.barChartLabels = agingDashboard.map(d => d.AGINGSLOT);
    //   this.barChartData = [{ data: agingDashboard.map(d => d.INSURANCE), label: 'Insurance' }, { data: agingDashboard.map(d => d.PATIENT), label: 'Patient' }];
    // }
    // if (CPAAnalysis) {
    //   debugger
    //   this.barChartLabels = CPAAnalysis.map(d => d.Mode);
    //   this.barChartData = [
    //     { data: CPAAnalysis.map(d => d.Total_Amount), label: 'Total Amount' }
    //   ];
    // }
    // Add spaces to the labels
const formattedLabels = CPAAnalysis.map(d => {
  if (d.Mode === 'Charges') {
    return 'Charges      ';
  } else if (d.Mode === 'Payments') {
    return 'Payments      ';
  } else if (d.Mode === 'Adjustments') {
    return 'Adjustments      ';
  }
  return d.Mode;
});



if (CPAAnalysis && CPAAnalysis.length > 0) {
  this.barChartLabels = formattedLabels;
  this.barChartData = [
    { data: CPAAnalysis.map(d => d.Total_Amount || 0), label: 'Total Amount' }
  ];
} else {
  // Handle case where CPAAnalysis is null or empty
  this.barChartLabels = [];
  this.barChartData = [
    { data: [], label: 'Total Amount' }
  ];

}
    
    // second chart
    if (recentAgingSummary) {
      this.barChartLabels2 = recentAgingSummary.map(r => r.Insurance);
      var d = [
        { data: recentAgingSummary.map(c => c.C_0_30__Days_Balance_by_Claim_Date), label: '0-30' },
        { data: recentAgingSummary.map(c => c.C_31_60__Days_Balance_by_Claim_Date), label: '31-60' },
        { data: recentAgingSummary.map(c => c.C_61_90__Days_Balance_by_Claim_Date), label: '61-90' },
        { data: recentAgingSummary.map(c => c.C_91_120__Days_Balance_by_Claim_Date), label: '91-120' },
        { data: recentAgingSummary.map(c => c.C_121_150__Days_Balance_by_Claim_Date), label: '121-150' },
        { data: recentAgingSummary.map(c => c.C_151_180__Days_Balance_by_Claim_Date), label: '151-180' },
        { data: recentAgingSummary.map(c => c.C___180__Days_Balance_by_Claim_Date), label: '180 Plus' },
        { data: recentAgingSummary.map(c => c.Total_Balance), label: 'Total' },
      ]
      this.barChartData2 = d;
    }
    // third chart
    if (recentChargesPayment && recentChargesPayment.length > 0) {
      this.cpaColumns = Object.keys(recentChargesPayment[0]);
      this.lineChartLabels = this.cpaColumns.slice(1);
      if (recentChargesPayment.length === 1) {
        this.lineChartData = [
          { data: Object.values(recentChargesPayment[0]).slice(1), label: Object.values(recentChargesPayment[0])[0] }
        ];
      }
      if (recentChargesPayment.length > 1) {
        this.lineChartData = [
          { data: Object.values(recentChargesPayment[0]).slice(1), label: Object.values(recentChargesPayment[0])[0] },
          { data: Object.values(recentChargesPayment[1]).slice(1), label: Object.values(recentChargesPayment[1])[0] },
          { data: Object.values(recentChargesPayment[2]).slice(1), label: Object.values(recentChargesPayment[2])[0] }
        ];
      }
    }
//  to get the cards data
  if (claimsAndERAs) {
    this.ClaimsSubmitted = claimsAndERAs.claimsAndERAs.claims_submitted;
    this.PendingClaims = claimsAndERAs.claimsAndERAs.pending_claims;
    this.TotalVisits = claimsAndERAs.claimsAndERAs.total_claims;
    this.PostedERA = claimsAndERAs.claimsAndERAs.total_posted_eras;
    this.UnpostedERAs = claimsAndERAs.claimsAndERAs.total_unposted_eras;
    this.PatientCount = claimsAndERAs.claimsAndERAs.total_patient_accounts;
    this.StatementCount = claimsAndERAs.claimsAndERAs.total_statements_sent;
  }

 this.cardData = [
  {
    title: 'Claims Submitted',
    value: claimsAndERAs.claimsAndERAs.claims_submitted
  },
  {
    title: 'Pending Claims',
    value: claimsAndERAs.claimsAndERAs.pending_claims
  },
  {
    title: 'Total Visits',
    value: claimsAndERAs.claimsAndERAs.total_claims
  },
  {
    title: 'Posted ERAs',
    value: claimsAndERAs.claimsAndERAs.total_posted_eras
  },
  {
    title: 'Statement Count',
    value:claimsAndERAs.claimsAndERAs.total_statements_sent
  },
  {
    title: 'Patient Count',
    value:  claimsAndERAs.claimsAndERAs.total_patient_accounts
  },
  {
    title: 'Unposted ERAs',
    value: claimsAndERAs.claimsAndERAs.total_unposted_eras
  }
];
  
  
//for charges & payments trend
  //if (ChargesANDPaymentsTrend) {
    
    //const chargesData = ChargesANDPaymentsTrend.find(item => item['Data Type'] === 'Charges');
    //const paymentsData = ChargesANDPaymentsTrend.find(item => item['Data Type'] === 'Payments');
    if (ChargesANDPaymentsTrend) {
    
      const chargesData = ChargesANDPaymentsTrend.find(item => item['Data Type'] === 'Charges');
      const paymentsData = ChargesANDPaymentsTrend.find(item => item['Data Type'] === 'Payments');
      
     // if (chargesData && paymentsData) {
     
        //this.chartLabels = Object.keys(chargesData).filter(key => key !== 'Data Type');
        // Determine chart labels from chargesData if available
     this.chartLabels = chargesData ? Object.keys(chargesData).filter(key => key !== 'Data Type') : [];
    
        // Process chargesData and paymentsData to replace null with 0
        //const chargesValues = Object.values(chargesData).slice(1).map(value => (value !== null && value !== undefined) ? value : 0);

        //const paymentsValues = Object.values(paymentsData).slice(1).map(value => (value !== null && value !== undefined) ? value : 0);

        // Process chargesData if available
  const chargesValues = chargesData ? 
  Object.values(chargesData).slice(1).map(value => (value !== null && value !== undefined) ? value : 0) :
  new Array(this.chartLabels.length).fill(0); // Default to 0 if no charges data

// Process paymentsData if available
const paymentsValues = paymentsData ? 
  Object.values(paymentsData).slice(1).map(value => (value !== null && value !== undefined) ? value : 0) :
  new Array(this.chartLabels.length).fill(0); // Default to 0 if no payments data

        this.chartData = [
          { 
            data: chargesValues, 
            label: 'Charges',
            fill: false,
            lineTension: 0,
          },
          { 
            data: paymentsValues, 
            label: 'Payments',
            fill: false,
            lineTension: 0
          }
        ];
     // }
    }
    
  //}
  // pie Chart insurance aging 
  if (insuranceAging) {
    this.doughnutChartLabels = insuranceAging.map(item => item.AGINGSLOT);
    this.doughnutChartData = insuranceAging.map(item => item.INSURANCEAGING );
    this.doughnutChartPercentages = insuranceAging.map(item => item.Percentage );
  } else {
    this.doughnutChartLabels = ['0-30', '31-60', '61-90', '91-120', '120+'];
    this.doughnutChartData = [0, 0, 0, 0, 0]; 
  }   // end pie chart insurance aging

 
  // pie chart for patient aging
if(patientAging){
  this.doughnutChartLabelsPA = patientAging.map(item => item.AGINGSLOT);
  this.doughnutChartDataPA = patientAging.map(item => item.PATIENTAGING );
  this.doughnutChartPercentagesPA = patientAging.map(item => item.PERCENTAGE );
} else {
  this.doughnutChartLabelsPA = ['0-30', '31-60', '61-90', '91-120', '120+'];
  this.doughnutChartDataPA = [0, 0, 0, 0, 0]; 

}



// PC Ratio chart
  if (pcRatio && pcRatio.length > 0) {
    this.pcRatioValue = pcRatio[0].PCRatio;
    this.doughnutChartDataPC = [this.pcRatioValue, 100 - this.pcRatioValue];
    this.PCChartValue = this.pcRatioValue;
    this.cdr.detectChanges();
    // this.chartOptions.plugins = {
    //   centerText: {
    //     text: this.pcRatioValue.toString(),
    //     color: 'green',
    //     fontSize: 24
    //   }
    // };
  }

  }
    // Function to format labels with INSURANCEAGING outside and Percentage inside
    formatLabel(value: number, percentage: number): string {
      return `${value} (${percentage}%)`;
    }
  // end of pie chart for patient aging
//   getAmount(CPAAnalysis: any[], mode: string): number {
//     debugger;
//     console.log('CPA Analysis:', CPAAnalysis);
    
//     if (!CPAAnalysis || CPAAnalysis.length === 0) {
//       console.log('CPA Analysis is undefined or empty.');
//       return 0; // or handle as needed
//     }
    
//     const item = CPAAnalysis.find(d => d.Mode === mode);
//     console.log('Found item for mode:', mode, item);
//     return item ? item.Total_Amount : 0;
//  }
getAmount(CPAAnalysis: any[], mode: string): string {

  if (!CPAAnalysis || CPAAnalysis.length === 0) {
    return '0';
  }

  const item = CPAAnalysis.find(d => d.Mode === mode);
  return item && item.Total_Amount != null ? item.Total_Amount.toFixed(2) : '0';
}

  

  showChart() {
    this.viewMode = 'chart';
  }
  showChartPC() {
    this.viewModePC = 'PC';
  }
  showChartPA() {
    this.viewModePA = 'chart';
  }
  showChartviewModeChargesAndPaymentsTrend() {
    this.viewModeChargesAndPaymentsTrend = 'chart';
  }
  showChartCPA() {
    this.viewModeCPA = 'chart';
  }
  showTable() {
    this.viewMode = 'table';
  }
  showTablePC() {
    this.viewModePC = 'PCtable';
  }
  showTablePA() {
    this.viewModePA = 'tablePA';
  }
  showTableCPA() {
    this.viewModeCPA = 'CPAtable';
  }
  
  showTableChargesAndPaymentsTrend() {
    this.viewModeChargesAndPaymentsTrend = 'ChargesAndPaymentsTrendtable';
  }
  openFullscreen(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  // openFullscreen(template: TemplateRef<any>): void {
  //   this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  // }
  getObjectValues(obj) {
    var values = Object.values(obj);
    return values.map((v, i) => i === 0 ? v : '$' + this._decimalPipe.transform((v || 0), '2.1-2'));
  }

  onClickAgingAnalysisRow() {
    this.router.navigate(['ReportSetup/AgingSummaryPat'], { queryParams: { PracticeCode: this.gv.currentUser.selectedPractice.PracticeCode } })
  }

  onClickCPAsRow() {
    let fromDate = formatDate(new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 5,
      new Date().getDate()
    ), 'MM/dd/yyyy', 'en');
    let toDate = formatDate(new Date(), 'MM/dd/yyyy', 'en');
    this.router.navigate(['ReportSetup/payment-detail'], { queryParams: { PracticeCode: this.gv.currentUser.selectedPractice.PracticeCode, DateFrom: fromDate, DateTo: toDate } })
  }

  onClickAgingByInsRow() {
    this.router.navigate(['ReportSetup/AgingSummary'], { queryParams: { PracticeCode: this.gv.currentUser.selectedPractice.PracticeCode } })
  }
}
