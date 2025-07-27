import { Component, inject, signal, effect } from '@angular/core';
import { ProductService } from '../../services/product-list.service';
import { ProductDettail } from '../../models/product-list.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent {
  private readonly productService = inject(ProductService);

  products = signal<ProductDettail[]>([]);

  constructor() {
    effect(() => {
      this.productService.getProducts().subscribe({
        next: (data) => this.products.set(data),
        error: (err) => {

          this.products.set([]);
        }
      });
    });
  }
}