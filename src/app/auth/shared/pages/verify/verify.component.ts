import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styles: [],
})
export class VerifyComponent implements OnInit {

  userVerified = false;
 
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService
  ) {}

  verifyForm: FormGroup = this.formBuilder.group(
    {
      otp: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }
  );

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(params => {
        console.log('email', this.route.snapshot.queryParamMap.get('email'));
        //this.verifyToken(this.route.snapshot.queryParamMap.get('email'), this.route.snapshot.queryParamMap.get('otp'));
      });
  }

  verifyToken(email: string|null, otp: string|null) {
    this.loginService.verifyAccount(email, otp).subscribe((data) => {
        console.log(data.message)
        if(data.message == 'The user is verified.') {
           this.userVerified = true
        } else {
          this.userVerified = false 
        }
    },
    err => {
       this.userVerified = false;
    });
  }

  resetPassword() {
    let email = this.route.snapshot.queryParamMap.get('email');
    let otp = this.verifyForm?.value['otp']
    let password = this.verifyForm?.value['password']
    let confirmPassword = this.verifyForm?.value['confirmPassword']

    this.loginService.verifyOTP(email, otp, password, confirmPassword).subscribe((data) => {
        console.log(data.message)
        if(data.message == 'The user is verified.') {
           this.userVerified = true
           Swal.fire('OK', `OTP code is successfully verified for user with email ${this.route.snapshot.queryParamMap.get('email')}!`, 'success').then(() => window.location.href = '/');
        } else {
          this.userVerified = false 
          Swal.fire('Error', 'Unable to verify the OTP code. Please contact our support team at dhanapal.jayapandi@amdocs.com', 'error');
        }
        this.verifyForm.reset();
    },
    err => {
       Swal.fire('Error', 'Unable to verify the OTP code', 'error');
    });
  }
}
