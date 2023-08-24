import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddOrUpdateCustomerPageRoutingModule } from './add-or-update-customer-routing.module';

import { AddOrUpdateCustomerPage } from './add-or-update-customer.page';
import { SharedModule } from 'src/theme/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddOrUpdateCustomerPageRoutingModule,
    SharedModule
  ],
  declarations: [AddOrUpdateCustomerPage]
})
export class AddOrUpdateCustomerPageModule { }
