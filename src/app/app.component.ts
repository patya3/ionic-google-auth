import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Plugins, StatusBarStyle } from '@capacitor/core';
const { SplashScreen, StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  ngOnInit(): void {
    SplashScreen.hide();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.setStyle({
        style: StatusBarStyle.Dark
      });
    });
  }
}
