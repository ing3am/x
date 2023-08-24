import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { AuthService } from 'src/Services/Config/auth.service';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage, canActivate: [AuthService]
  },
  {
    path: 'configuracionpos',
    loadChildren: () => import('../../Pages/configuration-pos/configuration-pos.module').then(m => m.ConfigurationPosPageModule)
  },
  {
    path: 'crearfactura',
    loadChildren: () => import('../../Pages/home/invoice/invoice.module').then(m => m.InvoiceModule)
  },
  {
    path: 'reportes',
    loadChildren: () => import('../../Pages/reports/reports.module').then(m => m.ReportsPageModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('../../Pages/customer/admin-customer/admin-customer.module').then(m => m.AdminCustomerModule)
  },
  {
    path: 'facturas',
    loadChildren: () => import('../../Pages/admin-invoice/admin-invoice.module').then(m => m.AdminInvoiceModule)
  },
  {
    path: 'invoice-items',
    loadChildren: () => import('../home/invoice-items/invoice-items.module').then(m => m.InvoiceItemsPageModule)
  },
  {
    path: 'add-or-update-customer',
    loadChildren: () => import('../../Pages/customer/add-or-update-customer/add-or-update-customer.module').then(m => m.AddOrUpdateCustomerPageModule)
  },
  {
    path: 'create-items',
    loadChildren: () => import('../../components/Modals/create-items/create-items.module').then(m => m.CreateItemsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule { }
