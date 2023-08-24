import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderSavedPageRoutingModule } from './order-saved-routing.module';

import { OrderSavedPage } from './order-saved.page';
import { SharedModule } from 'src/theme/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderSavedPageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [OrderSavedPage]
})
export class OrderSavedPageModule {}
