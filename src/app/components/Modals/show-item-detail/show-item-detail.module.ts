import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowItemDetailPageRoutingModule } from './show-item-detail-routing.module';

import { ShowItemDetailPage } from './show-item-detail.page';
import { SharedModule } from 'src/theme/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    ShowItemDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [ShowItemDetailPage]
})
export class ShowItemDetailPageModule {}
