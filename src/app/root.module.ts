import { HttpClient } from '@angular/common/http';
import { ErrorHandler, NgModule, PLATFORM_ID } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { Angulartics2Module } from 'angulartics2';
import { SimpleMQ } from 'ng2-simple-mq';
import { MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { ToastrModule } from 'ngx-toastr';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { environment } from '../environments/environment';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { jwtOptionsFactory } from './lib/jwt.factory';
import { RoutePreloader } from './lib/route-preloader';
import { createTranslateLoader } from './lib/translation.factory';
import { ModalsModule } from './modals/modals.module';
import { PipesModule } from './pipes/pipes.module';
import { HomeComponent } from './root/home/home.component';
import { LanguageSwitcherComponent } from './root/language-switcher/language-switcher.component';
import { LoginComponent } from './root/login/login.component';
import { RootComponent } from './root/root/root.component';
import { ThemeSwitcherComponent } from './root/theme-switcher/theme-switcher.component';
import rxStompConfig from './rx-stomp.config';
import { StaticLoginService } from './service/login/static-login.service';
import { SentryErrorHandler } from './shared/sentry-error-handler';
import { SharedModule } from './shared/shared.module';

const appRoutes: Routes = [
  {
    path: 'admin',
    canLoad: [StaticLoginService],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  }, {
    path: 'info',
    loadChildren: () => import('./root/info/info.module').then(m => m.InfoModule),
  }, {
    path: 'i18n-manager',
    canLoad: [StaticLoginService],
    loadChildren: () => import('./i18n-manager/i18n-manager.module').then(m => m.I18nManagerModule),
  }, {
    path: 'quiz/manager',
    loadChildren: () => import('./quiz/quiz-manager/quiz-manager.module').then(m => m.QuizManagerModule),
  }, {
    path: 'quiz/flow',
    loadChildren: () => import('./quiz/quiz-flow/quiz-flow.module').then(m => m.QuizFlowModule),
    data: {
      preload: false,
    },
  }, {
    path: 'quiz',
    loadChildren: () => import('./quiz/quiz.module').then(m => m.QuizModule),
  }, {
    path: 'nicks',
    loadChildren: () => import('./root/nickname-chooser/nickname-chooser.module').then(m => m.NicknameChooserModule),
    data: {
      preload: false,
    },
  }, {
    path: 'themes',
    component: ThemeSwitcherComponent,
  }, {
    path: 'preview/:themeId/:languageId',
    component: HomeComponent,
  }, {
    path: 'languages',
    component: LanguageSwitcherComponent,
  }, {
    path: 'login',
    component: LoginComponent,
  }, {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  }, {
    path: '**',
    redirectTo: '/',
  },
];

// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  renderer.paragraph = (text) => `${text}<br/>`;

  return {
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
  };
}

@NgModule({
  declarations: [
    HomeComponent, RootComponent, LanguageSwitcherComponent, ThemeSwitcherComponent, LoginComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'frontend' }),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    BrowserTransferStateModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    ModalsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler,
      },
    }),
    RouterModule.forRoot(appRoutes, {
      preloadingStrategy: RoutePreloader,
      enableTracing: false, // <-- debugging purposes only
    }), FooterModule,
    SharedModule,
    Angulartics2Module.forRoot(),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [PLATFORM_ID],
      },
    }), PipesModule, HeaderModule, MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useFactory: (markedOptionsFactory),
      },
    }),
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: SentryErrorHandler,
    }, {
      provide: InjectableRxStompConfig,
      useValue: rxStompConfig,
    }, {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig],
    }, SimpleMQ, RoutePreloader, NgbActiveModal,
  ],
  bootstrap: [RootComponent],
})
export class RootModule {
  constructor() {
    if (false && environment.production) {
      (window as any).console = {
        log: function (): void {},
        info: function (): void {},
        trace: function (): void {},
        warn: window.console.warn,
        error: window.console.error,
      };
    }
  }
}
