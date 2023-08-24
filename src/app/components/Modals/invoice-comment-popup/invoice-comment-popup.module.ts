import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvoiceCommentPopupPageRoutingModule } from './invoice-comment-popup-routing.module';

import { InvoiceCommentPopupPage } from './invoice-comment-popup.page';
import { SharedModule } from 'src/theme/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvoiceCommentPopupPageRoutingModule,
    SharedModule
  ],
  declarations: [InvoiceCommentPopupPage]
})
export class InvoiceCommentPopupPageModule {}
