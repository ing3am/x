import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminInvoiceRoutingModule } from './admin-invoice-routing.module';
import { AdminInvoiceComponent } from './admin-invoice.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/theme/shared/shared.module';


@NgModule({
  declarations: [AdminInvoiceComponent],
  imports: [
    CommonModule,
    AdminInvoiceRoutingModule,
    FormsModule,
    IonicModule,
    SharedModule,
  ]
})
export class AdminInvoiceModule { }
