import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DxDataGridComponent } from 'devextreme-angular';
import { LocalStService } from 'src/Services/Config/local-st.service';
import { CustomerService } from 'src/Services/OldBack/customer.service';
import { ShowMessageService } from 'src/Services/Shared/show-message.service';
import { AddOrUpdateCustomerPage } from '../add-or-update-customer/add-or-update-customer.page';

@Component({
  selector: 'app-admin-customer',
  templateUrl: './admin-customer.component.html',
  styleUrls: ['./admin-customer.component.scss'],
})
export class AdminCustomerComponent implements OnInit {

  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  customers: any;
  loading: boolean = false;
  mainTitle: string

  constructor(
    private apiCustomerService: CustomerService,
    private router: Router,
    public localService: LocalStService,
    private messageService: ShowMessageService,
    private modalController: ModalController
    // private exportExcelService: ExportExcelService
  ) { }
  ngOnInit(): void {
    this.getCustomers();
  }

  async getCustomers() {
    try {
      this.loading = true;
      const res = await this.apiCustomerService.getByCompany();
      this.customers = res;
      this.loading = false;
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    this.loading = false;
    if (error.error && error.error.Message === 'Authorization has been denied for this request.') {
      this.localService.doLogout();
    } else {
      this.messageService.showSimpleAlert('Notificación', error.error.Message || error.message)
    }
  }

  async ionViewDidEnter() {
    const storeName = await this.localService.getStoreAndCompanyName();
    if (storeName) {
      this.mainTitle = storeName;
    }
    this.customers = []
    this.getCustomers();
  }

  async actions(id) {

    const modal = await this.modalController.create({
      component: AddOrUpdateCustomerPage,
      cssClass: 'customer_modal',
      componentProps: {
        resaleId: id,
      },
      backdropDismiss: false
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      await this.getCustomers();
    }
  }

  onExporting(e) {
    //this.exportExcelService.onExportingWithoutDateRange(e, this.dataGrid, `CLIENTES`, `CLIENTES.xlsx`, `CLIENTES`, false);
  }

}
