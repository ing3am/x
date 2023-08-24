import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {

  selectedIndex: number = -1;
  isMobile: Boolean;

  public appPages = [
    { title: 'Home', url: 'home', icon: 'home' },
    { title: 'Clientes', url: 'clientes', icon: 'people' },
    { title: 'Facturas', url: 'facturas', icon: 'receipt' },
    { title: 'Reportes', url: 'reportes', icon: 'stats-chart' },
    { title: 'Configuración', url: 'configuracionpos', icon: 'settings' }
  ];

  constructor(
    private router: Router,
    private platform: Platform
  ) { 
    this.isMobile = this.platform.is('mobile');
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.updateSelectedIndex();
  }

  activeLink(p, index) {
    this.router.navigateByUrl(`app/${p.url}`);
    this.selectedIndex = index; // Actualiza el ítem seleccionado
  }

  updateSelectedIndex() {
    const url = this.router.url.replace('/app/', '');
    const foundIndex = this.appPages.findIndex(p => p.url === url || p.title.toLowerCase() === url);
    if (foundIndex !== -1) {
      this.selectedIndex = foundIndex;
    }
  }

  isMobileDevice(): boolean {
    return this.platform.is('mobile');
  }

  /*ngAfterViewInit() {
    let url = this.router.url.replace('/app/', '');
    let allElements = document.querySelectorAll('.item_apps');
    allElements.forEach((element) => {
      element.classList.remove('active');
    });
    document.getElementById(url).classList.add('active');
  }

  activeLink(p) {

    this.router.navigateByUrl(`app/${p.url}`);

    let allElements = document.querySelectorAll('.item_apps');
    allElements.forEach((element) => {
      element.classList.remove('active');
    });
    document.getElementById(p.url).classList.add('active');
  }


  isMobileDevice(): boolean {
    return this.platform.is('mobile');
  }*/


}
