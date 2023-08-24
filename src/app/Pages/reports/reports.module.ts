import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportsPageRoutingModule } from './reports-routing.module';

import { ReportsPage } from './reports.page';
import { SharedModule } from 'src/theme/shared/shared.module';

import { GeneralReportsComponent } from './general-reports/general-reports.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportsPageRoutingModule,
    SharedModule
  ],
  declarations: [ReportsPage, GeneralReportsComponent]
})
export class ReportsPageModule {}
