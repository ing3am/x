import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LocalStService } from 'src/Services/Config/local-st.service';
import { CustomerService } from 'src/Services/OldBack/customer.service';
import { NativeService } from 'src/Services/Shared/native.service';
import { Customer } from 'src/theme/shared/Models/customers';

@Component({
  selector: 'app-select-customer',
  templateUrl: './select-customer.page.html',
  styleUrls: ['./select-customer.page.scss'],
})
export class SelectCustomerPage implements OnInit {

  loading: boolean = false;
  customers: Customer[];

  constructor(
    private apiCustomerService: CustomerService,
    private nativeService: NativeService,
    private localService: LocalStService,
    public modalController: ModalController,

  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    await this.getTerceros();
  }

  getTerceros() {
    try {
      this.loading = true;
      this.customers = null;
      this.apiCustomerService.getByCompany()
        .then(
          async (res: Customer[]) => {
            this.customers = res;
            await this.nativeService.delay(100);
            let input = document.getElementsByClassName("dx-texteditor-input")[1] as HTMLInputElement;
            input.focus();
            input.select();
            this.loading = false;
          }).catch((err: any) => {
            console.log(err)
            this.customers = null;
            this.loading = false;
            if (err.error.Message === 'Authorization has been denied for this request.') {
              this.localService.doLogout();
            } else {
              this.nativeService.OnlyAlert('Notificación', err.error.Message, 'warning');
            }
          }
          )
    } catch (error) {
      this.nativeService.OnlyAlert('Notificación', error, 'warning');
    }
  }

  actions(data) {
    this.modalController.dismiss(data);
  }

  closeInvoiceViewModal() {
    this.modalController.dismiss(0);
  }

}
