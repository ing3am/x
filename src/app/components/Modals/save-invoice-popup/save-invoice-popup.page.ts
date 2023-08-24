import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalService } from 'src/Services/Config/local.service';
import { ModalController, NavParams  } from '@ionic/angular';
import { StoreinvoicedService } from 'src/Services/POS/storeinvoiced.service';
import { NativeService } from 'src/Services/Shared/native.service';



@Component({
  selector: 'app-save-invoice-popup',
  templateUrl: './save-invoice-popup.page.html',
  styleUrls: ['./save-invoice-popup.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class SaveInvoicePopupPage implements OnInit {

  public addInvoiceForm : FormGroup;
  formatDecimal:string='';
  editSaleOrder:boolean=false;

  btnClick: boolean = false;

  constructor(
    private navParams: NavParams,
    private apiStoreInvoicedService : StoreinvoicedService,
    private localStorage: LocalService,
    private renderer: Renderer2,
    private elRef: ElementRef,
    public modalController:ModalController,
    private nativeService: NativeService
  ) {
  }

  ngOnInit() {    
    this.addInvoiceForm = this.navParams.get('addInvoiceForm');
    if((this.addInvoiceForm.value.OrderNum === undefined) || (Number(this.addInvoiceForm.value.OrderNum) === 0) || (this.addInvoiceForm.value.OrderNum === "")){
      this.addInvoiceForm.setControl('OrderNum', new FormControl('',Validators.required))
      this.btnClick = false
    }
    else
      this.editSaleOrder = true;
  }

  get f() { return this.addInvoiceForm.controls; }

  closeInvoiceViewModal(){
    this.modalController.dismiss(0);
  }

  async saveModal(){
    this.btnClick = true;
    let save = true;
    var orderNum = this.addInvoiceForm.value.OrderNum.replace(/\s+$/, '');
    let userId = await this.localStorage.getJsonValue('userID')
    let storeId = await this.localStorage.getJsonValue('storeid')
    let companyID = await this.localStorage.getJsonValue('CIA')
    let user = await this.localStorage.getJsonValue('user')
    
    await this.apiStoreInvoicedService.getByID(userId,orderNum)
    .then((res:any)=>{      
      if(res.sucess){
        this.nativeService.OnlyAlert('Notificación','El número de orden ya existe','info')
        save = false;
        return;
      }

      if(!save) return;
      let storeinvoice = {
        storeinvoicedId:  this.addInvoiceForm.value.storeinvoicedId,
        StoreId: storeId,
        CompanyID: companyID,
        UserID: userId,
        OrderNum:orderNum,
        DataJson:JSON.stringify(this.addInvoiceForm.value),
        Inactive:false,
        CreatedAt: new Date(),
        ModifyDate : new Date(),
        ModifiedBy : user,
        CreatedBy : user
      };

      if(!this.editSaleOrder){
        this.apiStoreInvoicedService.add(storeinvoice)
        .then((res:any)=>{
          if(!res.success){
            this.nativeService.OnlyAlert('Notificación',res.message,'info')
            return;
          }
          this.btnClick = false;
          this.modalController.dismiss(1);
        })
        .catch(console.log);
      }else{
        this.apiStoreInvoicedService.update(storeinvoice)
        .then((res:any)=>{
          if(!res.success){
            this.nativeService.OnlyAlert('Notificación',res.message,'info')
            return;
          }
          this.btnClick = false;
          this.modalController.dismiss(1);
        })
        .catch(console.log);
      }

    })
    .catch(console.log)
  }

  ngAfterViewInit(){

    this.renderer.listen(this.elRef.nativeElement, 'click', (event) => {
      if(!this.editSaleOrder)
        document.getElementById("order-title").focus();
    });

    this.renderer.listen(this.elRef.nativeElement, 'keypress', (event) => {
      if(event.keyCode === 13 || event.key === "Enter"){
        if(this.addInvoiceForm.value.OrderNum===""){
          this.nativeService.OnlyAlert('Notificación','Debe ingresar un valor en la orden','info')
          event.returnValue = false;
          return;
        }
        this.saveModal();
      }
    });
  }

}
