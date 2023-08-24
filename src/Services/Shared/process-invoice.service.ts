import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { CalculatedService } from './calculated.service';
//import { NativeService } from '../Config/native.service';
import { StoreinvoicedService } from '../POS/storeinvoiced.service';
import { LocalService } from '../Config/local.service';
import { ShowMessageService } from './show-message.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessInvoiceService {

  constructor(
    //private nativeService: NativeService,
    private showMessageService: ShowMessageService,
    private calculatedService: CalculatedService,
    private apiStoreInvoicedService : StoreinvoicedService,
    private localStorage : LocalService
  ) { }

  onChangeQtyLine(index, addInvoiceForm) {
    const promise = new Promise(async (resolve, reject) => {
      await this.calculatedService.calculatedPOSHeadLine(addInvoiceForm.value, index)
        .then((resp: any) => {
          if (resp.success) {
            const currentinvcDtls = addInvoiceForm.get('invoicedtls') as FormArray;
            const currentinvcTaxs = addInvoiceForm.get('invoicetaxes') as FormArray;

            let dtls = resp.result.invoicedtls[index];
            let taxes = resp.result.invoicetaxes;

            currentinvcDtls.controls[index]['controls']['DocUnitPrice'].setValue(dtls.DocUnitPrice);
            currentinvcDtls.controls[index]['controls']['UnitPrice'].setValue(dtls.UnitPrice);
            currentinvcDtls.controls[index]['controls']['DocDiscount'].setValue(dtls.DocDiscount);
            currentinvcDtls.controls[index]['controls']['Discount'].setValue(dtls.Discount);
            currentinvcDtls.controls[index]['controls']['DocLineAmount'].setValue(dtls.DocLineAmount);
            currentinvcDtls.controls[index]['controls']['LineAmount'].setValue(dtls.LineAmount);
            currentinvcDtls.controls[index]['controls']['DocLineSubtotal'].setValue(dtls.DocLineSubtotal);
            currentinvcDtls.controls[index]['controls']['LineSubtotal'].setValue(dtls.LineSubtotal);
            currentinvcDtls.controls[index]['controls']['DocTaxBase'].setValue(dtls.DocTaxBase);
            currentinvcDtls.controls[index]['controls']['TaxBase'].setValue(dtls.TaxBase);
            currentinvcDtls.controls[index]['controls']['DocLineSubtotalTax'].setValue(dtls.DocLineSubtotalTax);

            currentinvcTaxs.controls.forEach(a => {
              taxes.forEach(b => {
                if (a['controls']['Line'].value === b.Line && a['controls']['TaxID'].value === b.TaxID && a['controls']['RateCode'].value === b.RateCode) {
                  a['controls']['TaxableAmount'].setValue(b.TaxableAmount);
                  a['controls']['DocTaxableAmount'].setValue(b.DocTaxableAmount);
                  a['controls']['DocTaxAmount'].setValue(b.DocTaxAmount);
                  a['controls']['TaxAmount'].setValue(b.TaxAmount);
                }
              });
            });

            addInvoiceForm.controls['DocInvoiceSubTotal'].setValue(resp.result.DocInvoiceSubTotal);
            addInvoiceForm.controls['InvoiceSubTotal'].setValue(resp.result.InvoiceSubTotal);
            addInvoiceForm.controls['DocDiscount'].setValue(resp.result.DocDiscount);
            addInvoiceForm.controls['Discount'].setValue(resp.result.Discount);
            addInvoiceForm.controls['DocWithHoldingAmount'].setValue(resp.result.DocWithHoldingAmount);
            addInvoiceForm.controls['WithHoldingAmount'].setValue(resp.result.WithHoldingAmount);
            addInvoiceForm.controls['DocTaxAmount'].setValue(resp.result.DocTaxAmount);
            addInvoiceForm.controls['TaxAmount'].setValue(resp.result.TaxAmount);
            addInvoiceForm.controls['DocInvoiceAmount'].setValue(resp.result.DocInvoiceAmount);
            addInvoiceForm.controls['InvoiceAmount'].setValue(resp.result.InvoiceAmount);
            addInvoiceForm.controls['DocInvoiceBal'].setValue(resp.result.DocInvoiceBal);
            addInvoiceForm.controls['InvoiceBal'].setValue(resp.result.InvoiceBal);

            resolve(addInvoiceForm);

          } else {
            //  Swal.fire('Notificación',resp.message,'warning');
          }
        }).catch((error: any) => {
          reject(error);
        })
    });
    return promise;
  }

  calcularTotales(addInvoiceForm): FormGroup {

    const currentinvcDtls = addInvoiceForm.get('invoicedtls') as FormArray;
    const currentinvcTaxs = addInvoiceForm.get('invoicetaxes') as FormArray;

    let subtotal = 0;
    let descuento = 0;
    let retenciones = 0;
    let impuestos = 0;
    let total = 0;

    if (currentinvcDtls !== null) {
      currentinvcDtls.controls.forEach(a => {
        subtotal += (a.value.DocUnitPrice * a.value.Quantity);
        descuento += a.value.DocDiscount;

        if (a.value.DocTaxBase > 0) {
          impuestos += (a.value.DocTaxBase);
        }
      });
    }

    if (currentinvcTaxs !== null) {
      currentinvcTaxs.controls.forEach(a => {
        if (a.value.TaxTypeID === 2 || a.value.TaxTypeID === "2") {
          retenciones += a.value.DocTaxAmount;
        }
      });
    }
    total = ((subtotal - descuento) + impuestos) - retenciones;
    addInvoiceForm.controls['DocInvoiceSubTotal'].setValue(subtotal);
    addInvoiceForm.controls['InvoiceSubTotal'].setValue(subtotal * Number(addInvoiceForm.controls['TRM'].value));
    addInvoiceForm.controls['DocDiscount'].setValue(descuento);
    addInvoiceForm.controls['Discount'].setValue(descuento * Number(addInvoiceForm.controls['TRM'].value));
    addInvoiceForm.controls['DocWithHoldingAmount'].setValue(retenciones);
    addInvoiceForm.controls['WithHoldingAmount'].setValue(retenciones * Number(addInvoiceForm.controls['TRM'].value));
    addInvoiceForm.controls['DocTaxAmount'].setValue(impuestos);
    addInvoiceForm.controls['TaxAmount'].setValue(impuestos * Number(addInvoiceForm.controls['TRM'].value));
    addInvoiceForm.controls['DocInvoiceAmount'].setValue(total);
    addInvoiceForm.controls['InvoiceAmount'].setValue(total * Number(addInvoiceForm.controls['TRM'].value));
    addInvoiceForm.controls['DocInvoiceBal'].setValue(total);
    addInvoiceForm.controls['InvoiceBal'].setValue(total * Number(addInvoiceForm.controls['TRM'].value));

    return addInvoiceForm;
  }

  calculateMin(numDecimal): number {
    if (numDecimal === 0) return 1;
    else {
      let min = "0."
      let i = 1;
      while (i != (numDecimal + 1)) {
        numDecimal === i ? min += "1" : min += "0"
        i++;
      }
      return Number(min)
    }
  }

  async upqty(e, i, addInvoiceForm) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (e.screenX === 0 && e.screenY === 0)
          reject(false);
        const curreInvoiceDtl = addInvoiceForm.get('invoicedtls') as FormArray;
        let exit = false;

        if (curreInvoiceDtl.controls[i]['controls']['IsInventoryable'].value &&
          (curreInvoiceDtl.controls[i]['controls']['OnHandQty'].value - curreInvoiceDtl.controls[i]['controls']['Quantity'].value) <= 0) {
          exit = true;
          this.showMessageService.showSimpleAlert('Notificación','Este producto es de inventario y no tiene cantidades disponibles');
        }

        if (exit) reject(false);
        else {
          let qty = curreInvoiceDtl.controls[i]['controls']['Quantity'].value;
          qty++;
          curreInvoiceDtl.controls[i]['controls']['Quantity'].setValue(
            qty
          );
          this.onChangeQtyLine(i, addInvoiceForm).then((res_onChange: any) => {
         //   this.nativeService.playAudio("success");
            addInvoiceForm = res_onChange;
            resolve(this.calcularTotales(addInvoiceForm));
          })
        }

      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  async downqty(e, i, addInvoiceForm) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (e.screenX === 0 && e.screenY === 0)
          reject(false);

        const curreInvoiceDtl = addInvoiceForm.get('invoicedtls') as FormArray;

        let qty = curreInvoiceDtl.controls[i]['controls']['Quantity'].value;
        qty--;
        if (qty > 0) {
          curreInvoiceDtl.controls[i]['controls']['Quantity'].setValue(
            qty
          );

          this.onChangeQtyLine(i, addInvoiceForm).then((res_onChange: any) => {
          //  this.nativeService.playAudio("undo");
            addInvoiceForm = res_onChange;
            resolve(this.calcularTotales(addInvoiceForm));
          })
        }
      } catch (error) {
        reject(false);
      }
    });
    return promise;
  }

  async deleteInvoiceLine(i, addInvoiceForm){
    const promise = new Promise(async(resolve, reject)=>{
      try {
        const currentinvcDtls = addInvoiceForm.get('invoicedtls') as FormArray;
        const currentinvcTaxs = addInvoiceForm.get('invoicetaxes') as FormArray;
        let j = 0;
        let aValue = 0;
        currentinvcTaxs.value.forEach(a => {
          if (currentinvcDtls.value[i]["Line"] === a['Line']) {
            aValue = a['Line'];
            currentinvcTaxs.removeAt(j);
            j = j - 1;
          }
          j++;
        });
    
        currentinvcDtls.removeAt(i);
    
        if(currentinvcDtls.value.length === 0){
          await this.apiStoreInvoicedService.getByID(await this.localStorage.getJsonValue('userID'),addInvoiceForm.value.OrderNum)
          .then(async (res:any)=>{
            if(res.result !== null){
              this.apiStoreInvoicedService.delete(await this.localStorage.getJsonValue('userID'),addInvoiceForm.value.OrderNum)
              .then((res:any)=>{
                if(res.success){
                  addInvoiceForm.controls["OrderNum"].setValue('');
                }else{
                  reject(res.message);
                }
              })
              .catch(console.log)
            }
          })
          .catch(console.log)
        }
       // this.nativeService.playAudio("delete");
        resolve(this.calcularTotales(addInvoiceForm));
      } catch (error) {
        reject(error);
      }
    
    });
    return promise;
  }

}
