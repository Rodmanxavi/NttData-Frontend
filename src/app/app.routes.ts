import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductNewComponent } from './components/product-new/product-new';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'nuevo-producto', component: ProductNewComponent }
];
