import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaxSearchPageRoutingModule } from './tax-search-routing.module';

import { TaxSearchPage } from './tax-search.page';
import { SharedModule } from 'src/theme/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaxSearchPageRoutingModule,
    SharedModule
  ],
  declarations: [TaxSearchPage]
})
export class TaxSearchPageModule {}
