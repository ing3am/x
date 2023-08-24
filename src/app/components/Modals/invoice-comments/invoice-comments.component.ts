import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-invoice-comments',
  templateUrl: './invoice-comments.component.html',
  styleUrls: ['./invoice-comments.component.scss'],
})
export class InvoiceCommentsComponent implements OnInit {

  @Input() title = "";
  @Input() comments = "";

  Form: FormGroup;

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.Form = new FormGroup({
      Comments: new FormControl(this.comments, Validators.required)
    });
  }

  closeModal() {
    this.modalController.dismiss({ res: true, message: "Proceso éxitoso.", data: this.Form.controls['Comments'].value });
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
