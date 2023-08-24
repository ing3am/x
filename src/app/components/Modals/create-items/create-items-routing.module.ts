import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateItemsPage } from './create-items.page';

const routes: Routes = [
  {
    path: '',
    component: CreateItemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateItemsPageRoutingModule {}
