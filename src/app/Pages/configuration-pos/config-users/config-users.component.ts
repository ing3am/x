import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { LocalStService } from 'src/Services/Config/local-st.service';
import { LocalService } from 'src/Services/Config/local.service';
import { UsersService } from 'src/Services/POS/users.service';
import { PosService } from 'src/Services/POS/pos.service';
import { LoadStaticCombosService } from 'src/Services/Shared/load-static-combos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-config-users',
  templateUrl: './config-users.component.html',
  styleUrls: ['./config-users.component.scss'],
})
export class ConfigUsersComponent implements OnInit {

  loading: boolean = false;

  @Output() UsersToSend: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();
  users: Array<any> = [];
  
  selectedUsers: Array<any> = [];

  constructor(
    private loadCombos: LoadStaticCombosService,
    private localStorage: LocalService,
    private apiPosService: PosService,
    private apiUsersService: UsersService,
    private localservice: LocalStService,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    try {
      const storeid = await this.localStorage.getJsonValue('storeid');
      if (storeid) {
        const res: any = await this.apiUsersService.getUsersByCompanyMaster();
        this.users = res;
        const storeRes: any = await this.apiPosService.getByID(storeid);
        let listUsers = [];
        storeRes.result.Users.forEach(a => {
          this.users.forEach(b => {
            if(a.UserID === b.UserID) listUsers.push(b);
          });
        });

        this.selectedUsers = listUsers;
      } 
    } catch (error) {
      console.log(error);
    }
  }  

  emmitUsers(){
    this.UsersToSend.emit(this.selectedUsers);
  }

  async openMyModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        title: "USUARIOS ASOCIADOS A LA TIENDA",
        items: this.users,
        modalid: 'storeUsers'
      }
    });

    modal.onDidDismiss().then(async (data) => {
      
    });

    await modal.present();
  }

}
