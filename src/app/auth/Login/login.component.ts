import { Component, OnInit, ViewChild,HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GvarsService } from '../../../app/services/G_vars/gvars.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginViewModel, CurrentUserViewModel,AccessViewModel } from '../../models/auth/auth';
import { AuthService } from '../../services/auth/auth.service';
import { JwtHelper } from 'angular2-jwt';
import { Common } from '../../services/common/common';
import { TokenRequestModel } from '../../models/token/token.model';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective, ModalOptions } from 'ngx-bootstrap/modal';
import { AlertService } from '../../services/data/Alert.service';




const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  Year = (new Date()).getFullYear();
  loginForm: FormGroup;
  loginViewModel: LoginViewModel;
  InvalidLogin: boolean;
  returnUrl: string;
  isCodeView:boolean=true;
  checkStatus:any;
  isLoginView:boolean=false;
  accessViewModel:AccessViewModel
  jwtHelper: JwtHelper = new JwtHelper();
  errorMessage: string;
  clicked = false;
  tokenRequestModel: TokenRequestModel;
  accesscode: FormGroup;
  userId: any;
  errorMessageforOPT: string;
  firstAlert: any;

  @ViewChild('ngOtpInput') ngOtpInputRef:any;
  @ViewChild(ModalDirective)displayAlert:ModalDirective;
  isModalActive = false;
  email: string;
  isAlertVisible: boolean = false;
  constructor(private GV: GvarsService,
    private router: Router,
   private toastrService:ToastrService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private alertService: AlertService,
    private Gv: GvarsService,
  ) {
    this.accessViewModel=new AccessViewModel();
    this.loginViewModel = new LoginViewModel();
    this.tokenRequestModel = new TokenRequestModel();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });
     this.authService.Logout();
    this.InitializeForm();
  }
  @HostListener('document:keydown.escape', ['$event'])
  handleEscKey(event: KeyboardEvent) {
    debugger
     if (this.isAlertVisible) {
      debugger
      this.proceedToAssignedModule();
     }
  }

GetAlertMessage(){
  debugger
  this.alertService.getLoginAlert().subscribe((data) => {
    if (data.Status === 'Success' && data.Response && data.Response.length > 0) {
      this.firstAlert = data.Response[0];
      debugger;

      // Check if the alert is not expired
      if (this.isAlertNotExpired()) {
        this.showAlert();
         // this.show();
    
      } else {
        console.log('Alert is expired.');
        this.proceedToAssignedModule(); // Proceed if no alert data
      }
    } else {
      console.log('No alert data available.');
      this.proceedToAssignedModule(); // Proceed if no alert data
      debugger;
    }
  });
}

proceedToAssignedModule() {
  // Logic to redirect to the assigned module
  
  //  this.displayAlert.hide();
  this.isAlertVisible = false;
    // Redirect to the assigned module or dashboard here
    this.authService.GetAuthorizedRoute(this.GV.currentUser.Menu[0]);

}

  isAlertNotExpired(): boolean {
    debugger
    console.log('this.firstAlert.EffectiveFrom', this.firstAlert.EffectiveFrom);
    console.log('this.firstAlert.EffectiveTo', this.firstAlert.EffectiveTo);
    console.log('new Date()', new Date());
    debugger;
  
    // Check if firstAlert or EffectiveFrom is null or undefined
    if (!this.firstAlert || !this.firstAlert.EffectiveFrom) {
      console.log('EffectiveFrom.jsdate is null or undefined');
      return false; // Or handle it according to your requirements
    }
  
    // Parse the EffectiveFrom date string into a JavaScript Date object
    const effectiveFromDate = new Date(this.firstAlert.EffectiveFrom);
  
    // If EffectiveTo is not defined, consider the alert to be lifetime from EffectiveFrom date
    if (!this.firstAlert.EffectiveTo) {
      // Set the time to midnight for comparison
      effectiveFromDate.setHours(0, 0, 0, 0);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      return currentDate >= effectiveFromDate; // Display modal if current date is equal to or greater than EffectiveFrom date
    }
  
    // Parse the EffectiveTo date string into a JavaScript Date object
    const effectiveToDate = new Date(this.firstAlert.EffectiveTo);
  
    // Set the time to midnight for comparison
    effectiveFromDate.setHours(0, 0, 0, 0);
    effectiveToDate.setHours(0, 0, 0, 0);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
  
    // Check if the current date is between EffectiveFrom and EffectiveTo dates
    return currentDate >= effectiveFromDate && currentDate <= effectiveToDate;
  }

  show() {
    //set the modal body static.will close on click OK or Cross
    const modalOptions: ModalOptions = {
      backdrop: 'static'
    };
    this.displayAlert.config = modalOptions;
    this.displayAlert.show();
  }
  
  hide() {
    this.displayAlert.hide();
  }




  InitializeForm(): any {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(8), Validators.pattern(strongRegex)]),
    });

    this.accesscode = new FormGroup({
      code: new FormControl('', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]),

    });
  }
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: true,
    placeholder: 0,

    inputStyles: {
      'width': '35px',
      'height': '40px',
      'border': '3px groove',
      'background': 'rgba(255, 255, 255, 0.25)'
      

    },
 
    inputClass:'each_input',
    containerClass:'all_inputs'
  };
  onOtpChange(event:any){

 
    this.accessViewModel.code=event

    if(this.accessViewModel.code.length == 6){
     this.onLoginClick();
    }
  }

  toggleDisable(){
    if(this.ngOtpInputRef.otpForm){
      if(this.ngOtpInputRef.otpForm.disabled){
        this.ngOtpInputRef.otpForm.enable();
      }else{
        this.ngOtpInputRef.otpForm.disable();
      }
    }
  }

  onResendOTP(){

    this.clicked = true;
    this.toggleDisable();
    this.accesscode.disable({ emitEvent: true });
    this.authService.Resend('/Token/AuthCodeResend?userid=' + this.userId).subscribe(
      res => {
        
        if (res != null) {
         this.userId=res;
         this.isCodeView=false;
         this.toggleDisable();
         this.isLoginView=true;
         this.clicked = false;
         this.InvalidLogin = false;
         this.accesscode.reset({ emitEvent: true });
         this.ngOtpInputRef.setValue(null);

         this.toastrService.success( "Success" ,  "OTP send Successfully")
         this.accesscode.enable({ emitEvent: true });
        }
      }, (err: any) => {
        this.toggleDisable();
        if(err === 401){
          this.errorMessage = "Invalid Username or Password";
        }else if(err == 400){
          
          this.errorMessage = 'Bad Request';
          // this.toastrService.error( err ,  this.errorMessage)
        }
        else if(err == 500){
          
          this.errorMessage = 'Internal Server Error';
          // this.toastrService.error( err ,  this.errorMessage)
        }else{
          this.errorMessage = err;
          // this.toastrService.error( err ,  this.errorMessage)
        }
        
        this.InvalidLogin = true;
        
        this.clicked = false;
        this.accesscode.enable({ emitEvent: true });
        setTimeout(() => {
          this.InvalidLogin = false;
        }, 4000);
      }, () => {
      }
    );
  }
onClick(){
  if (this.loginForm.valid) {
    this.clicked = true;
    this.loginForm.disable({ emitEvent: true });
    this.tokenRequestModel.Grant_Type = "password";
    this.tokenRequestModel.Password = this.loginViewModel.Password;
    this.tokenRequestModel.Username = this.loginViewModel.Username;
    this.authService.Token(this.tokenRequestModel).subscribe(
      res => {
        
        if (res != null) {
          console.log(res)
          this.userId=res.UserId/23443;
          this.email=res.email;
         this.isCodeView=false;
         this.isLoginView=true;
         this.clicked = false;
         this.InvalidLogin = false;
         this.loginForm.enable({ emitEvent: true });
        }
      }, (err: any) => {
        if(err === 401){
          this.errorMessage = "Invalid Username or Password";
        }else if(err == 400){
          
          this.errorMessage = 'Bad Request';
          // this.toastrService.error( err ,  this.errorMessage)
        }
        else if(err == 500){
          
          this.errorMessage = 'Internal Server Error';
          // this.toastrService.error( err ,  this.errorMessage)
        }else{
          this.errorMessage = err;
          // this.toastrService.error( err ,  this.errorMessage)
        }
        this.InvalidLogin = true;
        
        this.clicked = false;
        this.loginForm.enable({ emitEvent: true });
        setTimeout(() => {
          this.InvalidLogin = false;
        }, 4000);
      }, () => {
      }
    );
  }

}
  // onLoginClick() {
  //   debugger
  //   if (this.accessViewModel.code.length == 6) {
  //     this.clicked = true;
  //     this.toggleDisable();
  //     this.accesscode.disable({ emitEvent: true });
  //     this.accessViewModel.userid = this.userId;
  //     console.log(this.accessViewModel)
  //     this.authService.Code(this.accessViewModel).subscribe(
  //       res => {
  //         if (res != null) {
  //           this.GV.currentUser = new CurrentUserViewModel();
            
  //           let decStr = this.jwtHelper.decodeToken(res.Access_Token);
  //           this.GV.currentUser.exp = decStr.exp;
  //           this.GV.currentUser.iat = decStr.iat;
  //           this.GV.currentUser.nbf = decStr.nbf;
  //           this.GV.currentUser.role = decStr.role;
  //           this.GV.currentUser.userId = decStr.UserId;
  //           this.GV.currentUser.unique_name = decStr.unique_name;
  //           this.GV.currentUser.Practices = res.Practices;
  //           //Added by HAMZA ZULFIQAR as per USER STORY 119: Reporting Dashboard Implementation For All Practices
  //           this.GV.external_practices=res.ExternalPractices
  //           if (this.GV.currentUser.Practices.length > 0) {
  //             this.GV.currentUser.selectedPractice = this.GV.currentUser.Practices[0];
  //           }
  //           this.GV.currentUser.RolesAndRights = res.RolesAndRights;
  //           if (this.GV.currentUser.RolesAndRights.length > 0) {
  //             localStorage.setItem('loginStatus', '1');
  //             localStorage.setItem('jwt', res.Access_Token);
  //             localStorage.setItem('refreshToken', res.Refresh_Token);
  //             localStorage.setItem('pr', JSON.stringify(res.Practices));
  //             localStorage.setItem('rr', JSON.stringify(res.RolesAndRights));
            
  //             this.GV.currentUser.Menu = this.GV.currentUser.RolesAndRights.map(r => r.ModuleName);
  //             this.GV.currentUser.Menu = this.GV.currentUser.Menu.filter(Common.Distinct);
  //             this.authService.GetAuthorizedRoute( this.GV.currentUser.Menu[0]);
  //             console.log("Welcome pir");
  //             // this.onClickAlert();
  //             this.showAlert()
  //             }
  //           else {
  //             this.clicked = false;
  //             this.toggleDisable();
  //             this.InvalidLogin = false;
  //             this.accesscode.enable({ emitEvent: true });
  //             swal("Authorization Access", "You don't have any assigned module. Please contact to the Administration.", "error");
  //           }
  //         }
  //       }, (err: any) => {
  //         this.toggleDisable();
  //         this.ngOtpInputRef.setValue(null);
  //         if(err === 401){
  //           this.errorMessage = "Invalid OPT Code";
  //           // this.toastrService.info( err ,  this.errorMessageforOPT)
  //         }else if(err == 400){
            
  //           this.errorMessage = 'Bad Request';
  //           // this.toastrService.error( err ,  this.errorMessageforOPT)
  //         }
  //         else if(err == 500){
            
  //           this.errorMessage = 'Internal Server Error';
  //           // this.toastrService.error( err ,  this.errorMessageforOPT)
  //         }else{
  //           this.errorMessage = err;
  //           // this.toastrService.error( err ,  this.errorMessage)
  //         }
  //         this.InvalidLogin = true;
          
  //         this.clicked = false;
  //         this.accesscode.enable({ emitEvent: true });
  //         setTimeout(() => {
  //           this.InvalidLogin = false;
  //         }, 4000);
  //       }, () => {
  //       }
  //     );
  //   }
  // }
  // onClickAlert() {
  //   debugger
  //   // this.modalService.open(this.alertModal, { centered: true });
  //   this.displayAlert.show(); 
  //   this.isModalActive = true; // Show the modal
  // }
  // showAlert() {
  //   debugger
  //   //set the modal body static.will close on click OK or Cross
  //   const modalOptions: ModalOptions = {
  //     backdrop: 'static'
  //   };
  //   this.displayAlert.config = modalOptions;
  // this.displayAlert.show();
  // }
  // onclose(){
  //   this.displayAlert.hide();
  // }


// Method to handle login
onLoginClick() {
  if (this.accessViewModel.code.length === 6) {
    this.clicked = true;
    this.toggleDisable();
    this.accesscode.disable({ emitEvent: true });
    this.accessViewModel.userid = this.userId;

    this.authService.Code(this.accessViewModel).subscribe(
      res => {
        if (res != null) {
          this.GV.currentUser = new CurrentUserViewModel();
          
          let decStr = this.jwtHelper.decodeToken(res.Access_Token);
          this.GV.currentUser.exp = decStr.exp;
          this.GV.currentUser.iat = decStr.iat;
          this.GV.currentUser.nbf = decStr.nbf;
          this.GV.currentUser.role = decStr.role;
          this.GV.currentUser.userId = decStr.UserId;
          this.GV.currentUser.unique_name = decStr.unique_name; 
          this.GV.currentUser.Practices = res.Practices;
          this.GV.external_practices = res.ExternalPractices;

          if (this.GV.currentUser.Practices.length > 0) {
            this.GV.currentUser.selectedPractice = this.GV.currentUser.Practices[0];
          }
          this.GV.currentUser.RolesAndRights = res.RolesAndRights;

          if (this.GV.currentUser.RolesAndRights.length > 0) {
            // Store tokens and other information
            localStorage.setItem('loginStatus', '1');
            localStorage.setItem('jwt', res.Access_Token);
            localStorage.setItem('refreshToken', res.Refresh_Token);
            localStorage.setItem('pr', JSON.stringify(res.Practices));
            localStorage.setItem('rr', JSON.stringify(res.RolesAndRights));

            this.GV.currentUser.Menu = this.GV.currentUser.RolesAndRights.map(r => r.ModuleName);
            this.GV.currentUser.Menu = this.GV.currentUser.Menu.filter(Common.Distinct);
            
            // Show the alert before redirecting
            this.GetAlertMessage();
       //     this.showAlert();
          } else {
            this.handleNoAssignedModule();
          }
        }
      },
      err => this.handleError(err)
    );
  }
}

// Show alert modal
showAlert() {
  debugger
  const modalOptions: ModalOptions = {
    backdrop: 'static'
  };
  this.displayAlert.config = modalOptions;
  this.displayAlert.show();
  this.isAlertVisible = true;
}

// Handle modal close and redirect
onclose() {
  this.displayAlert.hide();
  this.isAlertVisible = false;
  // Redirect to the assigned module or dashboard here
  this.authService.GetAuthorizedRoute(this.GV.currentUser.Menu[0]);
}

// Handle case when no assigned module
handleNoAssignedModule() {
  this.clicked = false;
  this.toggleDisable();
  this.InvalidLogin = false;
  this.accesscode.enable({ emitEvent: true });
  swal("Authorization Access", "You don't have any assigned module. Please contact to the Administration.", "error");
}

// Handle errors
handleError(err: any) {
  this.toggleDisable();
  this.ngOtpInputRef.setValue(null);

  if (err === 401) {
    this.errorMessage = "Invalid OPT Code";
  } else if (err == 400) {
    this.errorMessage = 'Bad Request';
  } else if (err == 500) {
    this.errorMessage = 'Internal Server Error';
  } else {
    this.errorMessage = err;
  }
  
  this.InvalidLogin = true;
  this.clicked = false;
  this.accesscode.enable({ emitEvent: true });
  
  setTimeout(() => {
    this.InvalidLogin = false;
  }, 4000);
}


}
