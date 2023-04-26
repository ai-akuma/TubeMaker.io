import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseUIModule, FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './lander.component.html',
  styleUrls: ['./lander.component.scss']
})
export class LanderComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  uiShownCallback() {
    console.log('UI shown');
  }

  errorCallback(errorData: FirebaseUISignInFailure) {
    console.log("🔥 ~ file: login.component.ts:18 ~ LoginComponent ~ errorCallback ~ $event:", errorData)
    
  }

  successCallback(signinSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    console.log("🚀 ~ file: login.component.ts:23 ~ LoginComponent ~ successCallback ~ signinSuccessData:", signinSuccessData)
    this.authService.getYoutubeAccessTokenWithGoogle().subscribe((res) => {
      console.log("🚀 ~ file: login.component.ts:25 ~ LoginComponent ~ this.authService.getYoutubeAccessTokenWithGoogle ~ res:", res)
    })
    this.router.navigate(['dashboard']);
  }
}
