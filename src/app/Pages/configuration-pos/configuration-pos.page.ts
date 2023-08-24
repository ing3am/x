import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalService } from 'src/Services/Config/local.service';
import { PosService } from 'src/Services/POS/pos.service';
import { NativeService } from 'src/Services/Shared/native.service';
import { ShowMessageService } from 'src/Services/Shared/show-message.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuration-pos',
  templateUrl: './configuration-pos.page.html',
  styleUrls: ['./configuration-pos.page.scss'],
})
export class ConfigurationPosPage implements OnInit {

  loading: boolean = false;

  StoreForm: FormGroup;
  TranDocTypeForm: FormGroup;
  InventoryForm: FormGroup;
  BanksForm: FormGroup;
  printForm: FormGroup;

  confirmedUsers: Array<any> = [];

  editDocTranType: boolean = false;
  editInventory: boolean = false;
  editBanks: boolean = false;
  editPrinter: boolean = false;

  storeConfig: any[] = [];

  selected = new FormControl(0);

  constructor(
    private showMessageService: ShowMessageService,
    private localStorage: LocalService,
    private apiPosService: PosService,
    private nativeService: NativeService,
    private router: Router) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.selected.setValue(0);
  }

  async onSubmit() {
    this.TranDocTypeForm.enable();
    this.StoreForm.enable();
    this.loading = true;

    try {
      const storeId = this.StoreForm.value.StoreId;
      const storeData = this.StoreForm.value;

      const res: any = await this.apiPosService.update(storeId, storeData);
      if (res.success) {

        //Guardar la tienda 
        this.storeConfig.push({ value: 'Store', res: storeData });

        let usuarios = '';
        this.confirmedUsers.forEach((a: any) => {
          usuarios += a.UserID + ',';
        });
        usuarios = usuarios.substring(0, usuarios.length - 1);
        if (usuarios === '') {
          const confirm: any = await this.nativeService.AlertConfirm("¿Está seguro",
            "de eliminar todos los usuarios, una vez realizado este proceso no se puede deshacer");

          if (confirm.isConfirmed) {
            await this.apiPosService.addUserStore(await this.localStorage.getJsonValue('storeid'), usuarios);
            await this.saveDocType();
          } else {
            this.nativeService.OnlyAlert("Notificación", "Proceso cancelado..", 'info');
            this.loading = false;
          }
        } else {
          await this.apiPosService.addUserStore(await this.localStorage.getJsonValue('storeid'), usuarios);
          await this.saveDocType();
        }
      }
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

  async saveDocType() {
    try {
      if (!this.editDocTranType) {
        const res: any = await this.apiPosService.addDocType(this.TranDocTypeForm.value);
        if (res.success) {
          //Guardar el nuevo valor de DocType
          this.storeConfig.push({ value: 'DocType', res: this.TranDocTypeForm.value });
          await this.saveInventory();
        } else {
          this.loading = false;
          Swal.fire('Notificación', res.message, 'warning');
        }
      } else {
        const res: any = await this.apiPosService.updateDocType(await this.localStorage.getJsonValue('storeid'), this.TranDocTypeForm.value);
        if (res.success) {
          //Guardar el nuevo valor de DocType
          this.storeConfig.push({ value: 'DocType', res: this.TranDocTypeForm.value });
          await this.saveInventory();
        } else {
          this.loading = false;
          Swal.fire('Notificación', res.message, 'warning');
        }
      }

    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

  async saveInventory() {
    try {
      this.loading = true;

      const storeId = await this.localStorage.getJsonValue('storeid');
      const inventoryData = this.InventoryForm.value;

      if (!this.editInventory) {
        const res: any = await this.apiPosService.addInventory(inventoryData);
        if (res.success) {
          //Guardar el nuevo valor de Inventory
          this.storeConfig.push({ value: 'Inventory', res: inventoryData });
          await this.saveBank();
        } else {
          throw new Error(res.message);
        }
      } else {
        const res: any = await this.apiPosService.updateInventory(storeId, inventoryData);
        if (res.success) {
          //Guardar el nuevo valor de Inventory
          this.storeConfig.push({ value: 'Inventory', res: inventoryData });
          await this.saveBank();
        } else {
          throw new Error(res.message);
        }
      }
    } catch (error) {
      this.loading = false;
      console.log(error);
      Swal.fire('Notificación', error.message, 'warning');
    }
  }

  async saveBank() {
    try {
      this.loading = true;
      const bankData = this.BanksForm.value;
      const res: any = await this.apiPosService.addBanks(bankData);
      if (res.success) {
        //Guardar el nuevo valor de Banks
        this.storeConfig.push({ value: 'Banks', res: bankData });
        await this.savePrinter();
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      this.loading = false;
      console.log(error);
      Swal.fire('Notificación', error.message, 'warning');
    }
  }

  async savePrinter() {
    try {
      this.loading = true;
      const storeId = await this.localStorage.getJsonValue('storeid');
      const printerData = this.printForm.value;

      if (!this.editPrinter) {
        const res: any = await this.apiPosService.addPrinters(printerData);
        if (res.success) {
          //Guardar el nuevo valor de Printers
          this.storeConfig.push({ value: 'Printers', res: printerData });
          this.localStorage.setJsonValue('config', this.storeConfig);
          this.nativeService.OnlyAlert("Notificación", res.message, 'success');
          this.selected.setValue(0);
          this.loading = false;
        } else {
          throw new Error(res.message);
        }
      } else {
        const res: any = await this.apiPosService.updatePrinters(storeId, printerData);
        if (res.success) {
          //Guardar el nuevo valor de Printers
          this.storeConfig.push({ value: 'Printers', res: printerData });
          this.localStorage.setJsonValue('config', this.storeConfig);
          this.nativeService.OnlyAlert("Notificación", res.message, 'success');
          this.selected.setValue(0);
          this.loading = false;
        } else {
          throw new Error(res.message);
        }
      }
    } catch (error) {
      this.loading = false;
      console.log(error);
      Swal.fire('Notificación', error.message, 'warning');
    }
  }

  handleFormChangedStore(form: FormGroup) {
    this.StoreForm = form;
    if (form.controls['Users'].value != null) {
      this.confirmedUsers = [];
      form.controls['Users'].value.forEach(element => {
        this.confirmedUsers.push(element)
      });
    }
  }

  handleFormChangedTranTypes(form: FormGroup) {
    this.TranDocTypeForm = form;
  }

  handleFormChangedInventary(form: FormGroup) {
    this.InventoryForm = form;
  }

  handleFormChangedBanks(form: FormGroup) {
    this.BanksForm = form;
  }

  handleFormChangedPrinters(form: FormGroup) {
    this.printForm = form;
  }

  handleEditOrAdd(value, form) {
    if (form == "trantype")
      this.editDocTranType = value;
    else if (form == "inventary")
      this.editInventory = value;
    else if (form == "bank")
      this.editBanks = value;
    else if (form == "printer")
      this.editPrinter = value;
  }

  GetUsers(event) {
    this.StoreForm.controls['Users'].setValue(event);
  }

}
