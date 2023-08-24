import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaveInvoicePopupPage } from './save-invoice-popup.page';

const routes: Routes = [
  {
    path: '',
    component: SaveInvoicePopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaveInvoicePopupPageRoutingModule {}
