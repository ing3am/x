import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranDocTypePopupPageRoutingModule } from './tran-doc-type-popup-routing.module';

import { TranDocTypePopupPage } from './tran-doc-type-popup.page';
import { SharedModule } from 'src/theme/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranDocTypePopupPageRoutingModule,
    SharedModule
  ],
  declarations: [TranDocTypePopupPage]
})
export class TranDocTypePopupPageModule {}
