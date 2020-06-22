import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private platform: Platform,
    private googlePlus: GooglePlus
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  googleLogin() {
    if (this.platform.is('capacitor')) {
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }
  }

  nativeGoogleLogin() {
    this.googlePlus
      .login({
        webClientId:
          '52983818274-eoitdjbacil2najqokh92p5ippm8c69h.apps.googleusercontent.com',
        offline: true,
        scopes: 'profile email'
      })
      .then(googlePlusUser => {
        this.afAuth.auth.signInWithCredential(
          auth.GoogleAuthProvider.credential(googlePlusUser.idToken)
        );
        this.router.navigate(['/home']);
      })
      .catch(err => console.log(err));
  }

  webGoogleLogin() {
    const provider = new auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider).then(credential => {
      this.updateUserData(credential.user);
      this.router.navigate(['/home']);
    });
  }

  signOut() {
    this.afAuth.auth.signOut();
    if (this.platform.is('capacitor')) {
      this.googlePlus.logout();
      return this.router.navigate(['/login']);
    }
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    userRef.set(data, { merge: true });
  }
}
