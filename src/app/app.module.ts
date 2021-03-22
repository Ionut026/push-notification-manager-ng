import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './public/login/login.component';
import { AboutComponent } from './secure/about/about.component';
import { AdminComponent } from './secure/admin/admin.component';
import { HomeComponent } from './secure/home/home.component';
import { SecureComponent } from './secure/secure.component';
import { JwtInterceptor } from './public/helpers/jwt.interceptor';
import { ErrorInterceptor } from './public/helpers/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SecureComponent,
    HomeComponent,
    AdminComponent,
    AboutComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
