import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { EinvComponent } from './einv/einv.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EwbComponent } from './ewb/ewb.component';
import { BtocComponent } from './btoc/btoc.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { VieweinvComponent } from './einv/vieweinv/vieweinv.component';
import { ViewewbComponent } from './ewb/viewewb/viewewb.component';
import { Viewb2cComponent } from './btoc/viewb2c/viewb2c.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    EinvComponent,
    EwbComponent,
    BtocComponent,
    VieweinvComponent,
    ViewewbComponent,
    Viewb2cComponent,
    LoadingSpinnerComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MdbTabsModule,
    Ng2SearchPipeModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
