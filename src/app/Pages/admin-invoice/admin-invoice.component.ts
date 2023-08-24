import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { LocalStService } from 'src/Services/Config/local-st.service';
import { LocalService } from 'src/Services/Config/local.service';
import { ARInvoiceService } from 'src/Services/OldBack/arinvoice.service';
import { ShowMessageService } from 'src/Services/Shared/show-message.service';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { VoidInvoiceComponent } from 'src/app/components/Modals/void-invoice/void-invoice.component';
import { PosInvoiceService } from 'src/Services/POS/pos-invoice.service';

@Component({
  selector: 'app-admin-invoice',
  templateUrl: './admin-invoice.component.html',
  styleUrls: ['./admin-invoice.component.scss'],
})
export class AdminInvoiceComponent implements OnInit {

  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  loading: boolean = false;
  formReport: FormGroup;
  showTour: boolean = false;
  currentCompany: any;
  storeConfig: any[] = [];
  invoices: any[] = [];
  storeID: any;

  mainTitle: string

  constructor(
    private arInvoiceService: ARInvoiceService,
    private router: Router,
    private localService: LocalStService,
    private messageService: ShowMessageService,
    private localStorage: LocalService,
    private apiDatePipe: DatePipe,
    private formBuilder: FormBuilder,
    private actionSheetController: ActionSheetController,
    private showMessageService: ShowMessageService,
    public modalController: ModalController,
    private posInvoiceService: PosInvoiceService
    // private exportExcelService: ExportExcelService

  ) { }
  async ngOnInit() {
    let startdate = new Date;
    let enddate = new Date(startdate.getFullYear(), startdate.getMonth() + 1, 0);
    this.formReport = new FormGroup({
      startdate: new FormControl(this.apiDatePipe.transform(startdate, 'yyyy-MM-01')),
      enddate: new FormControl(this.apiDatePipe.transform(enddate, 'yyyy-MM-dd')),
      storeID: new FormControl(0)
    });
    const storeName = await this.localService.getStoreAndCompanyName();
    if (storeName) {
      this.mainTitle = storeName;
    }
    await this.getInvoices();
  }

  async getInvoices() {
    try {
      this.loading = true;
      let docType;
      let docTypeFE;
      this.storeID = await this.localStorage.getJsonValue('storeid') == null ? 0 : await this.localStorage.getJsonValue('storeid')
      this.formReport.controls['storeID'].setValue(this.storeID);
      this.storeConfig = await this.localStorage.getJsonValue('config');
      this.storeConfig.forEach(a => {
        if (a.value === 'DocType') {
          docType = a.res.SalesDocumentType;
          docTypeFE = a.res.SalesDocumentTypeFE;
        }
      });
      this.loading = true;
      const res = await this.arInvoiceService.getByCompanyPOS('SP', this.formReport.value);
      res.forEach(element => {
        if (element.TranDocTypeID == docType || element.TranDocTypeID == docTypeFE) {
          this.invoices.push(element)
        }
      });
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


  async actions(invoice) {
    const buttons = [];

    if (invoice.Contabilized && invoice.Process) {
      buttons.push({
        text: 'Seguimiento',
        handler: () => {
          this.clickActionView(invoice)
        }
      });
    }

    const actionText = invoice.Contabilized ? 'Anular Factura' : 'Contabilizar';

    buttons.push({
      text: actionText,
      handler: () => {
        if (invoice.Contabilized) {
          this.clickActionVoid(invoice);
        } else {
          this.clickActionContabilized(invoice);
        }
      }
    });

    buttons.push({
      text: 'Cancelar',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones Factura POS N°' + invoice.InvoiceNum,
      buttons: buttons
    });

    await actionSheet.present();
  }

  clickActionView(invoice) {
    //this.router.navigateByUrl('/app/facturas/verfacturas/' + invoice.InvoiceNum);
  }

  clickActionVoid(invoice) {
    this.showMessageService.showComfirmAlert("Notificación", "¿Está seguro que desea anular la factura?").then(
      async (result: boolean) => {
        if (result) {

          const modal = await this.modalController.create({
            component: VoidInvoiceComponent,
            componentProps: {
              title: "Motivo de cancelación",
              invoice: invoice
            },
            cssClass: 'my-custom-modal-tranType'
          });

          modal.onDidDismiss().then(async (data) => {
            if (data.data) {
              if (data.data.error) {
                this.messageService.showSimpleAlert('Notificación', data.data.error)
              } else {
                this.messageService.showSimpleAlert('Notificación', data.data.response.Message)
                this.search()
              }
            }
          });
          await modal.present();
        }
      }
    );
  }

  async clickActionContabilized(invoice) {
    this.loading = true;
    try {
      const res = await this.arInvoiceService.getByID(invoice.InvoiceNum);
      if (!res.Contabilized) {
        const response = await this.posInvoiceService.contabilizedPOSInvoice({
          ARInvoiceHead: res,
          ListPaymentMethods: [],
          StoreID: this.storeID,
        });
        this.messageService.showSimpleAlert('Notificación', response.message);
        this.search()
      }
      this.loading = false;
    } catch (error) {
      console.error(error);
      this.messageService.showSimpleAlert('Notificación', "Error al contabilizar el documento");
      this.loading = false;
    }
  }

  search() {
    this.invoices = [];
    this.getInvoices();
  }

  onExporting(e) {
    //this.exportExcelService.onExportingWithoutDateRange(e, this.dataGrid, `CLIENTES`, `CLIENTES.xlsx`, `CLIENTES`, false);
  }

}
