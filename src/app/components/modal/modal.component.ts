import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ShowMessageService } from 'src/Services/Shared/show-message.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() title: any;
  @Input() modalid: any;
  @Input() items: any[];

  selected: any;
  bool = true;

  selectedList: Array<any> = [];

  filteredItems: any[] = [];

  constructor(
    private modalController: ModalController,
    private showMessageService: ShowMessageService
  ) {
  }

  ngOnInit() {
    this.filterItems("")
  }

  filterItems(searchTerm: string) {
    if (searchTerm.trim() === '') {
      this.filteredItems = this.items; // No search term, show all items
    } else {
      this.filteredItems = this.items.filter(item => {
        if (this.modalid == 'selectCustomer') {
          return (item.SearchWord.toLowerCase().includes(searchTerm.toLowerCase()) || item.TerceroNum.toLowerCase().includes(searchTerm.toLowerCase()));
        } else if (this.modalid == 'storeUsers') {
          return (item.Name.toLowerCase().includes(searchTerm.toLowerCase()) || item.TerceroNum.toLowerCase().includes(searchTerm.toLowerCase()));
        }
      });
    }
  }

  async selectItem(item: any) {
    let itemName = '';
    switch (this.modalid) {
      case 'selectCompany':
        itemName = item.TradeName;
        break;
      case 'selectStore':
        itemName = item.Name;
        break;
      case 'selectCashR':
        itemName = item.Description;
        break;
      case 'selectCustomer':
        itemName = item.SearchWord;
        break;
      case 'selectTypeID':
        itemName = item.Description;
        break;
    }

    this.showMessageService.showToast("Usted Seleccionó: " + itemName, 2000, "top");
    this.selected = item;
    this.modalController.dismiss({
      role: 'selected',
      data: this.selected,
      modalid: this.modalid
    });
  }


  closeModal(selected) {
    if (selected) {
      if (this.selected) {
        this.modalController.dismiss({
          role: 'selected',
          data: this.selected,
          modalid: this.modalid
        });
      } else {
        this.showMessageService.showSimpleAlert("Notificación", "Debe seleccionar de la lista")
      }
    } else {
      this.modalController.dismiss();
    }
  }

}
