import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductNewComponent } from './components/product-new/product-new';
import { ProductEditComponent } from './components/product-edit/product-edit';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'nuevo-producto', component: ProductNewComponent },
  { path: 'editar-producto/:id', component: ProductEditComponent }
];
