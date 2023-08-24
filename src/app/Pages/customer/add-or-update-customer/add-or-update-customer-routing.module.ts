import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddOrUpdateCustomerPage } from './add-or-update-customer.page';

const routes: Routes = [
  {
    path: '',
    component: AddOrUpdateCustomerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddOrUpdateCustomerPageRoutingModule {}
