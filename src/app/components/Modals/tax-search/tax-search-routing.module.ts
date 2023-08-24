import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaxSearchPage } from './tax-search.page';

const routes: Routes = [
  {
    path: '',
    component: TaxSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxSearchPageRoutingModule {}
