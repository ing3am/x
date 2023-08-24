import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-toolbar-general',
  templateUrl: './toolbar-general.component.html',
  styleUrls: ['./toolbar-general.component.scss'],
})
export class ToolbarGeneralComponent implements OnInit {

  @Input() tittle: string = '';
  @Input() exit: boolean = true;
  @Input() loading: boolean = true;

  constructor(
    private router: Router
  ) { }

  ngOnInit() { }

  onExit() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigateByUrl('');
  }

}
