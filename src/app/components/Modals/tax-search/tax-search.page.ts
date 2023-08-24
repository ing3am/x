import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalService } from 'src/Services/Config/local.service';
import { TaxService } from 'src/Services/POS/tax.service';
import { ModalController, NavParams  } from '@ionic/angular';
import { NativeService } from 'src/Services/Shared/native.service';

@Component({
  selector: 'app-tax-search',
  templateUrl: './tax-search.page.html',
  styleUrls: ['./tax-search.page.scss'],
})
export class TaxSearchPage implements OnInit {
  
  public line:number=0;
  public pos:number=0;
  public taxdetailvisible:boolean=false;
  public taxtype:string='none';

  constructor(
    private localStorage : LocalService,
    private taxService:TaxService,
    private modalActive:ModalController,
    private nativeService: NativeService
  ) { }

  TaxType:any;
  Taxes : any;
  TaxDtls : any;
  TaxID : any;
  RateCode : any;
  Percent : any;

  ngOnInit() {
    if(this.taxtype !== 'none'){
      this.getTaxesByTaxType(this.taxtype);
    }else{
      this.GetTaxesByCompany();
    }
  }

  async GetTaxesByCompany() {
        this.taxService.getByCompany(await this.localStorage.getJsonValue('CIA'))
        .then(
          res => {            
            this.Taxes = res
          }
        ).catch((error:any)=>{
          this.nativeService.OnlyAlert('Notificación',error.error.message,'warning');
        });
  }

  async getTaxesByTaxType(id) {
        this.taxService.getByTaxType(id)
        .then(
          res => {
            this.Taxes = res
          }
        ).catch((error:any)=>{
          this.nativeService.OnlyAlert('Notificación',error.error.message,'warning');
        });
  }

  async GetTaxDetailsByTaxID(TaxID:string) {
        this.taxService.getTaxRatesByTax(TaxID)
        .then(
          res => {
            this.TaxDtls = res
          }
        ).catch((error:any)=>{
          this.nativeService.OnlyAlert('Notificación',error.error.Message,'warning');
        });
  }

  OnChangeTax(event):void{
    this.TaxType = this.Taxes.filter(function(item){ return item.TaxID == event.target.value});
    this.TaxDtls = null;
    this.RateCode='';
    this.Percent = '';
    this.GetTaxDetailsByTaxID(event.target.value)    
  }

  OnChangeRate(event):void{
    let percentRow = this.TaxDtls.filter(function(item){ return item.RateCode === event});
    this.Percent = percentRow[0].Rate
  }

  AcceptSelection(event) : void {
    if(this.TaxID !== undefined && this.RateCode !== undefined){
      this.handSuccessfullSave(true,this.TaxType,this.TaxID, this.RateCode, this.Percent, this.pos,this.line)      
    }
  }

  handSuccessfullSave(val:boolean,taxtype:any, TaxID:any, RateCode:any, Percent,Pos:number, LineNumber:number){
    this.modalActive.dismiss({val, taxtype,TaxID, RateCode,Percent,Pos,LineNumber});
  }
  async closeInvoiceViewModal(){
    this.modalActive.dismiss()
  }
}
