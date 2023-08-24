import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdminComponent } from 'src/theme/Pages/admin/admin.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./Pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'app',
    component: AdminComponent,
    loadChildren: () => import('./Pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'select-customer',
    loadChildren: () => import('./components/Modals/select-customer/select-customer.module').then( m => m.SelectCustomerPageModule)
  },
  {
    path: 'show-item-detail',
    loadChildren: () => import('./components/Modals/show-item-detail/show-item-detail.module').then( m => m.ShowItemDetailPageModule)
  },
  {
    path: 'save-invoice-popup',
    loadChildren: () => import('./components/Modals/save-invoice-popup/save-invoice-popup.module').then( m => m.SaveInvoicePopupPageModule)
  },  {
    path: 'invoice-comment-popup',
    loadChildren: () => import('./components/Modals/invoice-comment-popup/invoice-comment-popup.module').then( m => m.InvoiceCommentPopupPageModule)
  },
  {
    path: 'show-print-popup',
    loadChildren: () => import('./components/Modals/show-print-popup/show-print-popup.module').then( m => m.ShowPrintPopupPageModule)
  },
  {
    path: 'tax-search',
    loadChildren: () => import('./components/Modals/tax-search/tax-search.module').then( m => m.TaxSearchPageModule)
  },
  {
    path: 'order-saved',
    loadChildren: () => import('./components/Modals/order-saved/order-saved.module').then( m => m.OrderSavedPageModule)
  },
  {
    path: 'tran-doc-type-popup',
    loadChildren: () => import('./components/Modals/tran-doc-type-popup/tran-doc-type-popup.module').then( m => m.TranDocTypePopupPageModule)
  },
  {
    path: 'payment-method-popup',
    loadChildren: () => import('./components/Modals/payment-method-popup/payment-method-popup.module').then( m => m.PaymentMethodPopupPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
