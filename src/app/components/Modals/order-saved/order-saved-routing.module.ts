import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderSavedPage } from './order-saved.page';

const routes: Routes = [
  {
    path: '',
    component: OrderSavedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderSavedPageRoutingModule {}
