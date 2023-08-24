import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalController, NavParams  } from '@ionic/angular';

@Component({
  selector: 'app-invoice-comment-popup',
  templateUrl: './invoice-comment-popup.page.html',
  styleUrls: ['./invoice-comment-popup.page.scss'],
})
export class InvoiceCommentPopupPage implements OnInit {

  public addInvoiceForm:FormGroup;

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {    
  }

  closeInvoiceViewModal(){
    this.modalController.dismiss(0);
  }

  saveModal(){
    this.handSuccessfullSave(this.addInvoiceForm);
  }

  handSuccessfullSave(form){
    this.modalController.dismiss(form);
  }

}
