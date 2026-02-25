import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Platforms } from './platforms/platforms';
import { Customers } from './customers/customers';
import { WhyGenerix } from './why-generix/why-generix';
import { AboutUs } from './about-us/about-us';
import { CtaWhite } from './cta-white/cta-white';
import { SharedModule } from '../../shared/shared-module';
import { AboutUsImage } from './about-us-image/about-us-image';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [Platforms, Customers, WhyGenerix, AboutUs, CtaWhite, AboutUsImage],
  imports: [CommonModule, SharedModule, RouterModule],
  exports: [Platforms, Customers, WhyGenerix, AboutUs, CtaWhite, AboutUsImage],
})
export class HomeLayoutModule {}
