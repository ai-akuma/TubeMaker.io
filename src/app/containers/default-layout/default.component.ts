import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';
import { INavData } from '@coreui/angular';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-dashboard',
  templateUrl: './default.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DefaultComponent implements OnInit, OnDestroy, AfterContentInit {

  public navItems: INavData[];
  
  isLoggedIn: boolean = false;
  private subscription!: Subscription;
  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  constructor(
    private angularFireAuth: AngularFireAuth,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { /** */ }

  ngOnInit() {
    this.subscription = this.angularFireAuth.authState.subscribe((user) => {
      //So if the value is truthy (non-undefined/null), !! will convert it to true, and if it's falsy, it will convert it to false
      this.isLoggedIn = !!user;
    });
    this.translate.onLangChange.subscribe(() => {
      this.updateNavItems(this.translate);
    });
  }

  ngAfterContentInit(): void {
    this.updateNavItems(this.translate);
  }

  private updateNavItems(translate: TranslateService) {
    this.navItems = [
      {
        name: translate.instant('navigation.view_videos'),
        url: '/maker/list',
        iconComponent: { name: 'cil-media-play' }
      },
      {
        name: translate.instant('navigation.create'),
        title: true
      },
      {
        name: translate.instant('navigation.brand_new'),
        url: '/maker/auto',
        iconComponent: { name: 'cil-media-play' }
      },
      // {
      //   title: true,
      //   name: translate.instant('navigation.members_only')
      // },
      // {
      //   name: translate.instant('navigation.courses'),
      //   url: '/lander',
      //   iconComponent: { name: 'cil-star' },
      //   children: [
      //     {
      //       name: translate.instant('navigation.lander'),
      //       url: '/lander'
      //     },
      //     {
      //       name: translate.instant('navigation.register'),
      //       url: '/register'
      //     },
      //     {
      //       name: translate.instant('navigation.error_404'),
      //       url: '/404'
      //     },
      //     {
      //       name: translate.instant('navigation.error_500'),
      //       url: '/500'
      //     }
      //   ]
      // },
    ];
  }

  onLogoutEvent() {
    if (this.isLoggedIn) {
      console.log("🚀 ~ onLogoutEvent ~ onLogoutEvent:")
      this.angularFireAuth.signOut().then(() => {
        this.router.navigate(['/lander'], { relativeTo: this.activatedRoute });
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
