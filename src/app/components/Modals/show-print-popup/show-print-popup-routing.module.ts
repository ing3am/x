import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowPrintPopupPage } from './show-print-popup.page';

const routes: Routes = [
  {
    path: '',
    component: ShowPrintPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowPrintPopupPageRoutingModule {}
