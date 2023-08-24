import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AngularMaterialModule } from "./angular-material/angular.material.module";
import { DevExtremeModule } from "./dev-extreme/dev-extreme.module";
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxCurrencyModule, CurrencyMaskInputMode } from 'ngx-currency'

import 'devextreme/localization/globalize/number';
import 'devextreme/localization/globalize/date';
import 'devextreme/localization/globalize/currency';
import 'devextreme/localization/globalize/message';

import esMessages from 'devextreme/localization/messages/es.json';
import esCldrData from 'devextreme-cldr-data/es.json';
import supplementalCldrData from 'devextreme-cldr-data/supplemental.json';

import Globalize from 'globalize';

export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ".",
  precision: 2,
  prefix: "",
  suffix: "",
  thousands: ",",
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.NATURAL
};


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ComponentsModule,
    AngularMaterialModule,
    DevExtremeModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    NgSelectModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
  exports: [
    ComponentsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    DevExtremeModule,
    FormsModule,
    IonicModule,
    NgSelectModule,
    NgxCurrencyModule,
  ]
})

export class SharedModule {
  constructor() {
    this.initGlobalize();
    Globalize.locale('es');
  }

  initGlobalize() {
    Globalize.load(
      esCldrData,
      supplementalCldrData
    );
    Globalize.loadMessages(esMessages);
  }
}
