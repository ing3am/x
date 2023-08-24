import { Component, OnInit } from '@angular/core';
import { LocalStService } from 'src/Services/Config/local-st.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  mainTitle: string = '';

  constructor(
    public localService: LocalStService,
  ) { }

  ngOnInit() {
    this.localService.getStoreAndCompanyName().then(name => {
      if (name) {
        this.mainTitle = name;
      }
    })

  }

}
