import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Login } from './login/login';
import { Register } from './register/register';
import { Profile } from './profile/profile';
import { VerifyEmail } from './verify-email/verify-email';
import { AuthGuard } from '../../core/guards/auth.guard';

@NgModule({
  declarations: [
    Login, 
    Register
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Profile,
    RouterModule.forChild([
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: 'profile', component: Profile, canActivate: [AuthGuard] },
      { path: 'verify-email/:token', component: VerifyEmail },
    ]),
  ],
})
export class AuthModule {}
