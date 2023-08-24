import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowPrintPopupPageRoutingModule } from './show-print-popup-routing.module';

import { ShowPrintPopupPage } from './show-print-popup.page';
import { SharedModule } from 'src/theme/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowPrintPopupPageRoutingModule,
    SharedModule
  ],
  declarations: [ShowPrintPopupPage]
})
export class ShowPrintPopupPageModule {}
