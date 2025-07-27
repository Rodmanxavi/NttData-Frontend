import { Component, inject, signal, effect, computed } from '@angular/core';
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
  searchTerm = signal(''); //signal para búsqueda

  // productos filtrados
  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.products();
    return this.products().filter(product =>
      product.name.toLowerCase().includes(term)
    );
  });

  constructor() {
    effect(() => {
      this.productService.getProducts().subscribe({
        next: (data) => this.products.set(data),
        error: () => this.products.set([]),
      });
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement)?.value ?? '';
    this.searchTerm.set(value);
  }
}