import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CookiePolicyComponent } from './cookie-policy';

const routes: Routes = [
  {
    path: '',
    component: CookiePolicyComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class CookiePolicyModule { }