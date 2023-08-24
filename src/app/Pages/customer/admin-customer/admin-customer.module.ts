import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminCustomerRoutingModule } from './admin-customer-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/theme/shared/shared.module';
import { AdminCustomerComponent } from './admin-customer.component';


@NgModule({
  declarations: [AdminCustomerComponent],
  imports: [
    CommonModule,
    AdminCustomerRoutingModule,
    FormsModule,
    IonicModule,
    SharedModule,
  ]
})
export class AdminCustomerModule { }
