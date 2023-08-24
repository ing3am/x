import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceItemsPage } from './invoice-items.page';

const routes: Routes = [
  {
    path: '',
    component: InvoiceItemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceItemsPageRoutingModule {}
