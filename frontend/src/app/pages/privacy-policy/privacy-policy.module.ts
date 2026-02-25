import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivacyPolicyComponent } from './privacy-policy';

const routes: Routes = [
  {
    path: '',
    component: PrivacyPolicyComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class PrivacyPolicyModule { }