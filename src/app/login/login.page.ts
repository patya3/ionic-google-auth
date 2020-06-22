import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'firebase/app';
import { AuthService } from '../services/auth.service';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  user: Observable<User>;

  constructor(public auth: AuthService) {}

  ngOnInit() {
    SplashScreen.hide();
  }
}
