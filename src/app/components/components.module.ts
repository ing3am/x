import { NgModule } from '@angular/core';
import { ToolbarGeneralComponent } from './toolbar-general/toolbar-general.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';
import { LoadingComponent } from './loading/loading.component';
import { SelectTranDocTypeComponent } from './Modals/select-tran-doc-type/select-tran-doc-type.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VoidInvoiceComponent } from './Modals/void-invoice/void-invoice.component';
import { DxDateBoxModule } from 'devextreme-angular';
import { InvoiceCommentsComponent } from './Modals/invoice-comments/invoice-comments.component';


@NgModule({
  declarations: [
    ToolbarGeneralComponent,
    ModalComponent,
    LoadingComponent,
    SelectTranDocTypeComponent,
    VoidInvoiceComponent,
    InvoiceCommentsComponent
  ],
  exports: [
    ToolbarGeneralComponent,
    ModalComponent,
    LoadingComponent,
    DxDateBoxModule
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    DxDateBoxModule
  ]
})
export class ComponentsModule { }
