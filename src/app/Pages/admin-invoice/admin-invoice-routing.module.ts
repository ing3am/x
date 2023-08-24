import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminInvoiceComponent } from './admin-invoice.component';
import { AuthService } from 'src/Services/Config/auth.service';

const routes: Routes = [
  {
    path: '',
    component: AdminInvoiceComponent, canActivate:[AuthService]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminInvoiceRoutingModule { }
