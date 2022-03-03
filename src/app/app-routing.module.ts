import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { BtocComponent } from './btoc/btoc.component';
import { Viewb2cComponent } from './btoc/viewb2c/viewb2c.component';
import { EinvComponent } from './einv/einv.component';
import { VieweinvComponent } from './einv/vieweinv/vieweinv.component';
import { EwbComponent } from './ewb/ewb.component';
import { ViewewbComponent } from './ewb/viewewb/viewewb.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'einv', component: EinvComponent, canActivate: [AuthGuard] },
  { path: 'ewb', component: EwbComponent, canActivate: [AuthGuard] },
  { path: 'b2c', component: BtocComponent, canActivate: [AuthGuard] },
  { path: 'vieweinv', component: VieweinvComponent, canActivate: [AuthGuard] },
  { path: 'viewewb', component: ViewewbComponent, canActivate: [AuthGuard] },
  { path: 'viewb2c', component: Viewb2cComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
