import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from 'src/Services/Config/auth.service';

import { ConfigurationPosPage } from './configuration-pos.page';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationPosPage, canActivate: [AuthService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationPosPageRoutingModule {}
