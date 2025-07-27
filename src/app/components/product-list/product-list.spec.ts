import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list';
import { ProductService } from '../../services/product.service';
import { ProductDettail } from '../../models/product-list.model';
import { of, throwError } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;

  const mockProducts: ProductDettail[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      logo: 'logo2.png',
      date_release: '2024-02-01',
      date_revision: '2025-02-01'
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductService', ['getProducts', 'deleteProduct']);

    await TestBed.configureTestingModule({
      imports: [ProductListComponent, RouterTestingModule],
      providers: [
        { provide: ProductService, useValue: spy }
      ]
    }).compileComponents();

    mockProductService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    mockProductService.getProducts.and.returnValue(of(mockProducts));
    
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on initialization', () => {
    fixture.detectChanges();
    
    expect(mockProductService.getProducts).toHaveBeenCalled();
    expect(component.products()).toEqual(mockProducts);
  });

  it('should handle error when loading products', () => {
    mockProductService.getProducts.and.returnValue(throwError(() => new Error('API Error')));
    
    fixture.detectChanges();
    
    expect(component.products()).toEqual([]);
  });

  it('should filter products based on search term', () => {
    component.products.set(mockProducts);
    
    // Sin filtro
    expect(component.filteredProducts()).toEqual(mockProducts.slice(0, 5));
    
    // Con filtro
    component.searchTerm.set('Product 1');
    expect(component.filteredProducts()).toEqual([mockProducts[0]]);
    
    // Filtro que no coincide
    component.searchTerm.set('Nonexistent');
    expect(component.filteredProducts()).toEqual([]);
  });

  it('should update page size', () => {
    const event = {
      target: { value: '10' }
    } as unknown as Event;
    
    component.onPageSizeChange(event);
    expect(component.pageSize()).toBe(10);
  });

  it('should update search term', () => {
    const event = {
      target: { value: 'test search' }
    } as unknown as Event;
    
    component.onSearch(event);
    expect(component.searchTerm()).toBe('test search');
  });

  it('should handle search with null target', () => {
    const event = {
      target: null
    } as unknown as Event;
    
    component.onSearch(event);
    expect(component.searchTerm()).toBe('');
  });

  it('should open and close menu', () => {
    const event = jasmine.createSpyObj('Event', ['stopPropagation']);
    
    // Abrir menú
    component.openMenu('1', event);
    expect(component.openMenuId).toBe('1');
    expect(event.stopPropagation).toHaveBeenCalled();
    
    // Cerrar menú (mismo id)
    component.openMenu('1', event);
    expect(component.openMenuId).toBeNull();
    
    // Cambiar a otro menú
    component.openMenu('2', event);
    expect(component.openMenuId).toBe('2');
  });

  it('should open delete modal', () => {
    const product = mockProducts[0];
    
    component.openDeleteModal(product);
    
    expect(component.showDeleteModal).toBe(true);
    expect(component.productToDelete).toBe(product);
    expect(component.openMenuId).toBeNull();
  });

  it('should close delete modal', () => {
    component.showDeleteModal = true;
    component.productToDelete = mockProducts[0];
    
    component.closeDeleteModal();
    
    expect(component.showDeleteModal).toBe(false);
    expect(component.productToDelete).toBeNull();
  });

  it('should confirm delete successfully', () => {
    const productToDelete = mockProducts[0];
    component.productToDelete = productToDelete;
    component.products.set([...mockProducts]);
    mockProductService.deleteProduct.and.returnValue(of({ message: 'Success' }));
    
    component.confirmDelete();
    
    expect(mockProductService.deleteProduct).toHaveBeenCalledWith(productToDelete.id);
    expect(component.products()).toEqual([mockProducts[1]]);
    expect(component.showDeleteModal).toBe(false);
    expect(component.productToDelete).toBeNull();
  });

  it('should handle delete error', () => {
    const productToDelete = mockProducts[0];
    component.productToDelete = productToDelete;
    mockProductService.deleteProduct.and.returnValue(throwError(() => new Error('Delete failed')));
    spyOn(window, 'alert');
    
    component.confirmDelete();
    
    expect(mockProductService.deleteProduct).toHaveBeenCalledWith(productToDelete.id);
    expect(window.alert).toHaveBeenCalledWith('Error al eliminar el producto');
    expect(component.showDeleteModal).toBe(false);
  });

  it('should not delete when no product selected', () => {
    component.productToDelete = null;
    
    component.confirmDelete();
    
    expect(mockProductService.deleteProduct).not.toHaveBeenCalled();
  });

  it('should limit filtered products by page size', () => {
    const manyProducts = Array.from({ length: 10 }, (_, i) => ({
      ...mockProducts[0],
      id: `${i + 1}`,
      name: `Product ${i + 1}`
    }));
    
    component.products.set(manyProducts);
    component.pageSize.set(3);
    
    expect(component.filteredProducts().length).toBe(3);
  });
});
