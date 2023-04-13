import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from '../../interfaces/tokenUser.interface';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(private loginService: LoginService, private router: Router) {}
  isLogged: boolean = false;
  isAdmin: boolean = false;
  userData!: UserInfo;
  ngOnInit(): void {
    this.loginService.isValidToken().subscribe((status) => {
      if (status) {
        this.loginService.getUser().subscribe((element) => {
          this.userData = element.data?.user.user!;
          this.isLogged = true;
          let jwtData = localStorage.getItem('token')!.split('.')[1]
          let decodedJwtJsonData = window.atob(jwtData)
          let decodedJwtData = JSON.parse(decodedJwtJsonData)
          let role =  decodedJwtData.roles[0]
          
          console.log(role)
          if(role === 'ROLE_CLIENT')
            this.isAdmin = false;
          else
            this.isAdmin = true;
        });
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/');
    window.location.reload();
  }

  getCartSize() {
    return Object.keys(JSON.parse(localStorage.getItem('order') || '{}')).length;
  }
}
