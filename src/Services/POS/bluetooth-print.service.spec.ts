import { TestBed } from '@angular/core/testing';

import { BluetoothPrintService } from './bluetooth-print.service';

describe('BluetoothPrintService', () => {
  let service: BluetoothPrintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BluetoothPrintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
