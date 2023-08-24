import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectCustomerPageRoutingModule } from './select-customer-routing.module';

import { SelectCustomerPage } from './select-customer.page';
import { SharedModule } from 'src/theme/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectCustomerPageRoutingModule,
    SharedModule
  ],
  declarations: [SelectCustomerPage]
})
export class SelectCustomerPageModule { }
