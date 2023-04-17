import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styles: [],
})
export class ResetComponent implements OnInit {
 
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) {}

  verifyForm: FormGroup = this.formBuilder.group(
    {
      email: ['', [Validators.required, Validators.email]]
    }
  );

  async ngOnInit(): Promise<void> {}

  isValid(variable: string) {
    return this.verifyForm.controls[variable].errors && this.verifyForm.controls[variable].touched;
  }

  resetPassword() {
    this.loginService.resetPassword(this.verifyForm?.value['email']).subscribe((data) => {
        console.log(data.message)
        Swal.fire('OK', `If an account exists for ${this.verifyForm.get('email')}, you will get an email with instructions on resetting your password.`, 'success').then(() => window.location.href = '/');
    },
    err => {
      Swal.fire('Error', 'Unable to send reset password link', 'error');
    });
  }
}
