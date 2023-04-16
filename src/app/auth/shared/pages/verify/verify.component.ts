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
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }
  );

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(params => {
        console.log('otp', this.route.snapshot.queryParamMap.get('otp'));
        console.log('email', this.route.snapshot.queryParamMap.get('email'));
        this.verifyToken(this.route.snapshot.queryParamMap.get('email'), this.route.snapshot.queryParamMap.get('otp'));
        console.log('last');
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
    this.loginService.verifyAccount('', '').subscribe((data) => {
        console.log(data.message)
        if(data.message == 'The user is verified.') {
           this.userVerified = true
        } else {
          this.userVerified = false 
        }
        this.router.navigate(['login']);
        this.verifyForm.reset();
    },
    err => {
       this.userVerified = false;
    });
  }
}
