import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';

// Aurexia pages
import { Portfolio } from './pages/portfolio/portfolio';
import { Destinations } from './pages/destinations/destinations';
import { DestinationDetail } from './pages/destination-detail/destination-detail';
import { PropertyDetailComponent } from './pages/property-detail/property-detail';
import { ServiceModelComponent } from './pages/service-model/service-model';
import { DeveloperPartnershipComponent } from './pages/developer-partnership/developer-partnership';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home },

  { path: 'home', component: Home },

  // Aurexia routes
  { path: 'portfolio', component: Portfolio },
  { path: 'destinations', component: Destinations },
  { path: 'destinations/:slug', component: DestinationDetail },
  { path: 'property/:slug', component: PropertyDetailComponent },
  { path: 'service-model', component: ServiceModelComponent },
  { path: 'developer-partnership', component: DeveloperPartnershipComponent },

  // Authentication module
  {
    path: '',
    loadChildren: () => import('./features/user/auth-module').then(m => m.AuthModule)
  },

  {
    path: 'user',
    loadChildren: () => import('./features/user/user-module').then((m) => m.UserModule),
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./pages/privacy-policy/privacy-policy.module').then((m) => m.PrivacyPolicyModule),
  },
  {
    path: 'cookie-policy',
    loadChildren: () => import('./pages/cookie-policy/cookie-policy.module').then((m) => m.CookiePolicyModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
