import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateItemsPageRoutingModule } from './create-items-routing.module';

import { CreateItemsPage } from './create-items.page';
import { SharedModule } from 'src/theme/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateItemsPageRoutingModule,
    SharedModule
  ],
  declarations: [CreateItemsPage]
})
export class CreateItemsPageModule { }
