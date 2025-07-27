import { Component, inject, signal, effect, computed } from '@angular/core';
import { ProductService } from '../../services/product.service';
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
  pageSize = signal(5);

  // productos filtrados
  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    let filtered = this.products();
    if (term) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term)
      );
    }
    return filtered.slice(0, this.pageSize());
  });

  openMenuId: string | null = null;
  showDeleteModal = false;
  productToDelete: ProductDettail | null = null;

  constructor() {
    effect(() => {
      this.productService.getProducts().subscribe({
        next: (data) => this.products.set(data),
        error: () => this.products.set([]),
      });
    });
  }

  onPageSizeChange(event: Event): void {
    const value = +(event.target as HTMLSelectElement).value;
    this.pageSize.set(value);
  }
  
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement)?.value ?? '';
    this.searchTerm.set(value);
  }

  openMenu(id: string, event: Event) {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  openDeleteModal(product: ProductDettail) {
    this.productToDelete = product;
    this.showDeleteModal = true;
    this.openMenuId = null;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  confirmDelete() {
    if (!this.productToDelete) return;
    this.productService.deleteProduct(this.productToDelete.id).subscribe({
      next: () => {
        // Actualiza la lista quitando el producto eliminado
        this.products.set(this.products().filter(p => p.id !== this.productToDelete!.id));
        this.closeDeleteModal();
      },
      error: () => {
        alert('Error al eliminar el producto');
        this.closeDeleteModal();
      }
    });
  }

  //cerrar menú contextual al hacer click fuera
  ngOnInit() {
    document.addEventListener('click', () => this.openMenuId = null);
  }
}