import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  username: any = '';
  password: any = '';
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  login(): void {
    this.auth.loginWithUsername(this.username, this.password).subscribe(() => {
      this.router.navigate(['/admin']);
    })
  }

}
