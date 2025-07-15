import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ResetPasswordViewModel } from '../../classes/requestResponse';
import { APIService } from '../../../components/services/api.service';
import { MatchPassword } from '../../../validators/password.validator';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&-_\*])(?=.{8,})");

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  PasswordResetForm: FormGroup;
  objResetPasswordViewModel: ResetPasswordViewModel;
  @Input() Id: number;

  constructor(private apiService: APIService,
    private toaster: ToastrService) {
    this.objResetPasswordViewModel = new ResetPasswordViewModel();
  }

  ngOnInit() {
    this.InitializeForm();
  }

  InitializeForm(): any {
    this.PasswordResetForm = new FormGroup({
      pGroup: new FormGroup({
        password: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(8), Validators.pattern(strongRegex)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(8)])
      }, { validators: MatchPassword })
    })
  }

  show(): any {
    this.PasswordResetForm.reset();
    // $('#passwordResetModal').modal('show');
  }

  hide(): any {
    // $('#passwordResetModal').modal('hide');
  }

  onSaveClick() {
    if (this.PasswordResetForm.valid && this.Id != null) {
      this.objResetPasswordViewModel.UserId = this.Id;
      this.apiService.PostData('/UserManagementSetup/ResetPassword', this.objResetPasswordViewModel, (response) => {
        if (response.Status === 'Success') {
          this.hide();
          this.toaster.success('Password has been reset successfully.', 'Reset Password');
        } else {
          this.toaster.error('Failure to reset password', 'Error');
        }
      });
    } else {
      this.toaster.warning('Enter password details.', 'Validation');
      return;
    }
  }
}
