import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Header } from './layouts/header/header';
import { Footer } from './layouts/footer/footer';
import { SharedModule } from './shared/shared-module';
import { PagesModule } from './pages/pages-module';
import { FeaturesModule } from './features/features-module';
import { HomeLayoutModule } from './layouts/home-layout/home-layout-module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { CacheInterceptor } from './core/interceptors/cache.interceptor';

@NgModule({
  declarations: [App, Header, Footer],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FeaturesModule,
    PagesModule,
    HomeLayoutModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
  ],
  bootstrap: [App],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
