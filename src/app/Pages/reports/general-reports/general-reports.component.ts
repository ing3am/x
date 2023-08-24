import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LocalService } from 'src/Services/Config/local.service';
import { BireportsService } from 'src/Services/POS/bireports.service';
import { PosService } from 'src/Services/POS/pos.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-general-reports',
  templateUrl: './general-reports.component.html',
  styleUrls: ['./general-reports.component.scss'],
})
export class GeneralReportsComponent implements OnInit, AfterViewInit {

  @ViewChild('lineCanvas') private doughnutCanvas: ElementRef;

  loading: boolean = false;
  ReportForm: FormGroup;
  selected = new FormControl(0);
  formReport: FormGroup;
  DocInvoiceSubTotal = 0;
  DocDiscount = 0;
  DocTaxAmount = 0;
  DocInvoiceAmount = 0;
  formatDecimal: any;
  optionsMask: any;
  listPayment: any;
  listItems: any;
  totalPayment = 0;

  loadForm: boolean = false;

  now: Date = new Date();

  doughnutChart: any;

  constructor(
    private localStorage: LocalService,
    private apiBIreports: BireportsService,
    private apiPosService: PosService
  ) {
    this.localStorage.getJsonValue('companies').then(async (res: any) => {
      await JSON.parse(res).forEach(async (a) => {

        if (a.CompanyID === await this.localStorage.getJsonValue('CIAM')) {
          this.formatDecimal = `1.${a.DecimalQty}-${a.DecimalQty}`;
          this.optionsMask = {
            thousands: a.DecimalSeparator === ',' ? '.' : ',',
            decimal: a.DecimalSeparator === ',' ? ',' : '.',
            precision: a.DecimalQty
          };
        }
      });
    });
  }

  ngOnInit() {


    // JSON.parse(await this.localStorage.getJsonValue('companies')).forEach(a => {
    //   if (a.CompanyID.toString() === this.localStorage.getJsonValue('CIA').toString()) {
    //     this.formatDecimal = `1.${a.DecimalQty}-${a.DecimalQty}`;
    //   }
    // });

    this.formReport = new FormGroup({
      companyid: new FormControl(0),
      storeid: new FormControl(0),
      invoiceNum: new FormControl(0),
      terceroNum: new FormControl({ value: '', disabled: true }),
      fechaInicio: new FormControl(new Date),
      fechaFinal: new FormControl(new Date),
      invoiceWithCN: new FormControl('')
    });

    this.localStorage.getJsonValue('CIA').then(cia => {
      this.formReport.controls["companyid"].setValue(cia);
      this.localStorage.getJsonValue('storeid').then(storeid => {
        this.formReport.controls["storeid"].setValue(storeid);
        this.loadReports();
      });
    });
  }

  async ngAfterViewInit() {
  }

  loadReports() {
    this.loading = true;

    if (this.doughnutChart) {
      this.doughnutChart.destroy();
    }

    this.apiBIreports.getAmountValuesGroupPOS(this.formReport.value)
      .then((res: any) => {
        this.loading = false;
        if (res.success) {
          if (res.result.Sales.length > 0) {
            this.DocInvoiceSubTotal = res.result.Sales[0].DocInvoiceSubTotal;
            this.DocDiscount = res.result.Sales[0].DocDiscount;
            this.DocTaxAmount = res.result.Sales[0].DocTaxAmount;
            this.DocInvoiceAmount = res.result.Sales[0].DocInvoiceAmount;
            this.listItems = res.result.Items;
            this.formReport.controls['invoiceWithCN'].setValue(res.result.InvoicesWithCN);
            this.loading = true;
            this.apiPosService.getByCompanyReportSummaryDaily(this.formReport.value)
              .then((res1: any) => {
                this.listPayment = res1.result;
                this.totalPayment = 0;

                this.listPayment.forEach(a => {
                  this.totalPayment += a.PaymentAmount;
                });


                let labelsChars: any[] = [];
                let amountChars: any[] = [];
                if (this.listPayment.length > 0) {
                  this.listPayment.forEach(label => {
                    labelsChars.push(label.Paymethod);
                    amountChars.push(label.PaymentAmount);
                  });
                }

                if (labelsChars.length === 0) {
                  labelsChars.push('Sin medios de pago');
                  amountChars.push(100);
                }
                this.doughnutChart = new Chart('doughnutChart', {
                  type: 'doughnut',
                  data: {
                    labels: labelsChars,
                    datasets: [{
                      data: amountChars,
                      backgroundColor: labelsChars.map(() => this.getRandomColor()),
                      hoverBackgroundColor: labelsChars.map(() => this.getRandomColor()),
                      hoverOffset: 4
                    }]
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right'
                      }
                    }
                  }
                });
                this.loading = false;
              })
              .catch();
          }
        }
      })
      .catch((err: any) => {
        this.loading = false;
        console.log(err);
      });
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  print() {

  }
}
