import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SaveInvoicePopupPageRoutingModule } from './save-invoice-popup-routing.module';

import { SaveInvoicePopupPage } from './save-invoice-popup.page';
import { SharedModule } from 'src/theme/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SaveInvoicePopupPageRoutingModule,
    SharedModule
  ],
  declarations: [SaveInvoicePopupPage]
})
export class SaveInvoicePopupPageModule {}
