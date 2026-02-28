import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core-module';
import { SharedModule } from '../shared/shared-module';
import { HomeLayoutModule } from '../layouts/home-layout/home-layout-module';

import { Home } from './home/home';

// Aurexia pages
import { Portfolio } from './portfolio/portfolio';
import { Destinations } from './destinations/destinations';
import { DestinationDetail } from './destination-detail/destination-detail';
import { PropertyDetailComponent } from './property-detail/property-detail';
import { ServiceModelComponent } from './service-model/service-model';
import { DeveloperPartnershipComponent } from './developer-partnership/developer-partnership';

@NgModule({
  declarations: [
    Home,
    Portfolio,
    Destinations,
    DestinationDetail,
    PropertyDetailComponent,
    ServiceModelComponent,
    DeveloperPartnershipComponent,
  ],
  imports: [CommonModule, RouterModule, CoreModule, SharedModule, HomeLayoutModule],
  exports: [
    Home,
    Portfolio,
    Destinations,
    DestinationDetail,
    PropertyDetailComponent,
    ServiceModelComponent,
    DeveloperPartnershipComponent,
  ],
})
export class PagesModule {}
