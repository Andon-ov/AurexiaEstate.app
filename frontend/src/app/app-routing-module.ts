import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Contact } from './pages/contact/contact';
import { Home } from './pages/home/home';
import { PlatformPageComponent } from './pages/platform-page/platform-page.component';
import { About } from './pages/about/about';
import { Search } from './pages/search/search';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home },

  { path: 'home', component: Home },

  {
    path: 'contact',
    component: Contact,
  },
  {
    path: 'about',
    component: About,
  },
  {
    path: 'search',
    component: Search,
  },
  /* Parameterized route for all platforms */
  {
    path: 'platforms/:type',
    component: PlatformPageComponent
  },

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
