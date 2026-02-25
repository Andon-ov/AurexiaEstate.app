import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core-module';
import { SharedModule } from '../shared/shared-module';
import { HomeLayoutModule } from '../layouts/home-layout/home-layout-module';

import { Home } from './home/home';
import { Contact } from './contact/contact';

import { PlatformPageComponent } from './platform-page/platform-page.component';
import { About } from './about/about';

@NgModule({
  declarations: [Home, Contact, PlatformPageComponent, About],
  imports: [CommonModule, RouterModule, CoreModule, SharedModule, HomeLayoutModule],
  exports: [Home, Contact, PlatformPageComponent, About],
})
export class PagesModule {}
