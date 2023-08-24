import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigurationPosPageRoutingModule } from './configuration-pos-routing.module';

import { ConfigurationPosPage } from './configuration-pos.page';
import { SharedModule } from 'src/theme/shared/shared.module';
import { ConfigStoreComponent } from './config-store/config-store.component';
import { ConfigUsersComponent } from './config-users/config-users.component';
import { ConfigTranTypesComponent } from './config-tran-types/config-tran-types.component';
import { ConfigInvetariesComponent } from './config-invetaries/config-invetaries.component';
import { ConfigBankAccountsComponent } from './config-bank-accounts/config-bank-accounts.component';
import { ConfigPrintersComponent } from './config-printers/config-printers.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfigurationPosPageRoutingModule,
    SharedModule,
    
  ],
  declarations: [ConfigurationPosPage, ConfigStoreComponent, ConfigUsersComponent, ConfigTranTypesComponent, ConfigInvetariesComponent, ConfigBankAccountsComponent, ConfigPrintersComponent]
})
export class ConfigurationPosPageModule {}
