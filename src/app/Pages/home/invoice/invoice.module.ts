import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListItemsComponent } from './../list-items/list-items.component';
import { SharedModule } from 'src/theme/shared/shared.module';


@NgModule({
  declarations: [InvoiceComponent, ListItemsComponent],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    FormsModule,
    IonicModule,
    SharedModule
  ],
  exports: [
    InvoiceComponent
  ]
})

export class InvoiceModule { }
