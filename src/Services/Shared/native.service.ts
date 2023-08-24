import { Injectable } from "@angular/core";
import { AlertController, Platform, ToastController } from "@ionic/angular";
import Swal, { SweetAlertIcon } from "sweetalert2";
import { ModalController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class NativeService {

    constructor(
        private platform: Platform,
        public alertController: AlertController,
        public toastController: ToastController,
        private modalController: ModalController
    ) { }

    async OnlyAlert(title: string, message: string, icon: SweetAlertIcon) {
        let alert = Swal.fire({
            title: title,
            text: message,
            icon: icon,
            heightAuto: false,
            showCloseButton: true,
            confirmButtonColor: '#3085d6',
        })
        return alert;
    }
    async AlertConfirm(header, message) {
        const promise = new Promise(async (resolve, reject) => {
            Swal.fire({
                title: header,
                text: message,
                icon: 'warning',
                heightAuto: false,
                showCancelButton: true,
                cancelButtonText: `No`,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si'
            }).then((result: any) => {
                resolve(result)
            }).catch((err: any) => {
                reject(err)
            })
        });
        return promise;
    }

    async presentToast(message) {
        const toast = await this.toastController.create({
            color: 'medium',
            icon: 'information-circle',
            position: 'top',
            message: message,
            duration: 4000
        });
        toast.present();
    }

    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    check_isWeb() {
        return (this.platform.is('mobileweb') || this.platform.is('desktop'));
    }

    playAudio(status) {
        let audio = new Audio();
        if (status === "success")
            audio.src = "../../../assets/audio/success.mp3";
        if (status === "delete")
            audio.src = "../../../assets/audio/delete.mp3";
        if (status === "undo")
            audio.src = "../../../assets/audio/undo.mp3";
        if (status === "notification")
            audio.src = "../../../assets/audio/notification.mp3";

        audio.load();
        audio.play();
    }

    async openModal(component, props) {
        const modal = await this.modalController.create({
          component,
          componentProps: props,
          backdropDismiss: true
        });
      
        await modal.present();
      
        const { data } = await modal.onDidDismiss();
      
        if (data) {
          return data;
        }
    }

}
