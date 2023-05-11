import { Injectable } from '@angular/core';
import { NavigationService } from '../navigation.service';
import { Observable, Subject, catchError, of } from 'rxjs';
import { FirebaseUser } from '../../model/user/user.model';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { FireAuthRepository } from '../../repository/firebase/fireauth.repo';

const LANGUAGE_PREF = 'language'

@Injectable({
  providedIn: 'root',
})
export class SessionService {

    private errorSubject = new Subject<string>();

    constructor(
        private fireAuthRepo: FireAuthRepository,
        private navService: NavigationService
    ) { /** */ }

    getErrorObserver(): Observable<string> {
        return this.errorSubject.asObservable();
    }

    storeLanguagePref(lang: string): void {
        localStorage.setItem(LANGUAGE_PREF, lang);
    }

    getLanguagePref(): string | null {
        return localStorage.getItem(LANGUAGE_PREF);
    }

    verifyEmail(signinSuccessData: FirebaseUISignInSuccessWithAuthResult) {
        const email = signinSuccessData.authResult.user?.email;
        console.log("🚀 ~ file: session.service.ts:36 ~ SessionService ~ verifyEmail ~ email:", email)

        if (email !== undefined && email !== '') {
            this.verifyEmailHasPurchased(email!!);
        } else {
            this.errorSubject.next('We couldn\'t create your account. Please contact us.');
        }
    }

    verifyEmailHasPurchased(email: string) {
        this.fireAuthRepo.verifyPurchaseEmail(email).subscribe({
            next: (userExists) => {
                if (userExists) {
                    console.log("🚀 ~ file: session.service.ts:49 ~ SessionService ~ this.fireAuthRepo.verifyPurchaseEmail ~ PURCHAED: GOING TO COPYCAT")
                    this.navService.navigateToCopyCat();
                } else {
                    this.fireAuthRepo.signOut();
                    console.log("🚀 ~ file: session.service.ts:53 ~ SessionService ~ this.fireAuthRepo.verifyPurchaseEmail ~ USER NOT PURCHASED")
                    this.errorSubject.next('You are not authorized to use this application. Please contact us.');
                }
            },
            error: (error) => { 
                console.log('🔥' + error);
                this.fireAuthRepo.signOut();
                this.errorSubject.next(error);
            }
        })
    }
}
