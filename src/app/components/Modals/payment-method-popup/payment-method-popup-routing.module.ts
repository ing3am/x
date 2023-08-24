import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentMethodPopupPage } from './payment-method-popup.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentMethodPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentMethodPopupPageRoutingModule {}
