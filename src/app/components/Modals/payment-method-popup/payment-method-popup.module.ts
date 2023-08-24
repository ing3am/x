import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentMethodPopupPageRoutingModule } from './payment-method-popup-routing.module';

import { PaymentMethodPopupPage } from './payment-method-popup.page';
import { SharedModule } from 'src/theme/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentMethodPopupPageRoutingModule,
    SharedModule
  ],
  declarations: [PaymentMethodPopupPage]
})
export class PaymentMethodPopupPageModule {}
