import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectCustomerPage } from './select-customer.page';

const routes: Routes = [
  {
    path: '',
    component: SelectCustomerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectCustomerPageRoutingModule {}
