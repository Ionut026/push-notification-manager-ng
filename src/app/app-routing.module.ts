import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './public/helpers/auth.guard';
import { LoginComponent } from './public/login/login.component';
import { AboutComponent } from './secure/about/about.component';
import { AdminComponent } from './secure/admin/admin.component';
import { HomeComponent } from './secure/home/home.component';
import { SecureComponent } from './secure/secure.component';
import { Roles } from './types/roles';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'secure',
    pathMatch: 'full'
  },
  {
    path: 'secure',
    component: SecureComponent,
    canActivate: [AuthGuard],
    data: { roles: [Roles.User, Roles.Admin] },
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
        data: { roles: [Roles.User, Roles.Admin] }
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        data: { roles: [Roles.Admin] }
      },
      {
        path: 'about',
        component: AboutComponent,
        canActivate: [AuthGuard],
        data: { roles: [Roles.User, Roles.Admin] }
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
