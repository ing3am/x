import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvoiceItemsPageRoutingModule } from './invoice-items-routing.module';

import { InvoiceItemsPage } from './invoice-items.page';
import { SharedModule } from 'src/theme/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvoiceItemsPageRoutingModule,
    SharedModule
  ],
  declarations: [InvoiceItemsPage]
})
export class InvoiceItemsPageModule { }
