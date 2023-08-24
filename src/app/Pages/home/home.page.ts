import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStService } from 'src/Services/Config/local-st.service';
import { LocalService } from 'src/Services/Config/local.service';
import { WarehseBinService } from 'src/Services/OldBack/warehse-bin.service';
import { ConfigBankService } from 'src/Services/POS/config-bank.service';
import { ConfigDocTypeService } from 'src/Services/POS/config-doc-type.service';
import { ConfigPrinterService } from 'src/Services/POS/config-printer.service';
import { StoresService } from 'src/Services/POS/stores.service';
import { NativeService } from 'src/Services/Shared/native.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  public loading: boolean = false;
  public storeConfig: any[] = [];
  mainTitle: string

  constructor(
    private localStorage: LocalService,
    public localService: LocalStService,
    private router: Router,
    private storeService: StoresService,
    private configDocTypeService: ConfigDocTypeService,
    private configBankService: ConfigBankService,
    private configPrinterService: ConfigPrinterService,
    private warehousebinService: WarehseBinService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadConfigStore();
    this.loading = false;
  }


  async loadConfigStore() {

    const name = await this.localService.getStoreAndCompanyName();
    if (name) {
      this.mainTitle = name;
    }

    let configLoaded = localStorage.getItem('configLoaded');

    if (!configLoaded) {
      localStorage.setItem('configLoaded', 'true');

      let storeid = await this.localStorage.getJsonValue('storeid');
      if (storeid && storeid != "") {
        try {
          let conf = await this.storeService.getByIDValitionContinue(storeid);

          if (conf.success) {
            let res = await this.storeService.getByID(storeid);
            this.storeConfig.push({ value: 'Store', res: res });

            let docTypeRes = await this.configDocTypeService.getDocTypeByID(storeid);
            if (docTypeRes.result != null) {
              this.storeConfig.push({ value: 'DocType', res: docTypeRes.result });
            }

            let inventoryRes = await this.configDocTypeService.getInventoryByID(storeid);
            if (inventoryRes.result != null) {
              this.storeConfig.push({ value: 'Inventory', res: inventoryRes.result });
              if (inventoryRes.result.warehousecode != null) {
                let warehouseRes = await this.warehousebinService.getByCompany(inventoryRes.result.Warehousecode);
                this.storeConfig.push({ value: 'WhseBin', res: warehouseRes.result });
              }
            }

            let banksRes = await this.configBankService.getBanksByID(storeid);
            if (banksRes.result != null) {
              this.storeConfig.push({ value: 'Banks', res: banksRes.result });
            }

            let printerRes = await this.configPrinterService.getPrinterID(storeid);
            if (printerRes.result != null) {
              this.storeConfig.push({ value: 'Printers', res: printerRes.result });
              this.localStorage.setJsonValue('config', this.storeConfig);
            }
          } else {
            this.router.navigateByUrl('app/configuracion/pos');
          }
        } catch (error) {
          this.loading = false;
          console.log(error);
        }
      }
    }
  }

}
