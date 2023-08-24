import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCustomerComponent } from './admin-customer.component';
import { AuthService } from 'src/Services/Config/auth.service';

const routes: Routes = [
  {
    path: '',
    component: AdminCustomerComponent, canActivate: [AuthService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminCustomerRoutingModule { }
