import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { ProductDettail } from '../models/product-list.model';
import { provideHttpClient } from '@angular/common/http';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3002/bp/products';

  const mockProduct: ProductDettail = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    logo: 'test-logo.png',
    date_release: '2024-01-01',
    date_revision: '2025-01-01'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should return products from API', () => {
      const mockResponse = { data: [mockProduct] };

      service.getProducts().subscribe(products => {
        expect(products).toEqual([mockProduct]);
        expect(products.length).toBe(1);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty products array', () => {
      const mockResponse = { data: [] };

      service.getProducts().subscribe(products => {
        expect(products).toEqual([]);
        expect(products.length).toBe(0);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('addProduct', () => {
    it('should add a new product', () => {
      const newProduct = { ...mockProduct, id: '2' };
      const mockResponse = { data: newProduct };

      service.addProduct(newProduct).subscribe(product => {
        expect(product).toEqual(newProduct);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProduct);
      req.flush(mockResponse);
    });
  });

  describe('verifyProductId', () => {
    it('should verify product id and return true', () => {
      const productId = '123';
      const url = `${apiUrl}/verification/${productId}`;

      service.verifyProductId(productId).subscribe(isValid => {
        expect(isValid).toBe(true);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('should verify product id and return false', () => {
      const productId = '456';
      const url = `${apiUrl}/verification/${productId}`;

      service.verifyProductId(productId).subscribe(isValid => {
        expect(isValid).toBe(false);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(false);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', () => {
      const productId = '1';
      const url = `${apiUrl}/${productId}`;
      const mockResponse = { message: 'Product deleted successfully' };

      service.deleteProduct(productId).subscribe(response => {
        expect(response.message).toBe('Product deleted successfully');
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', () => {
      const productId = '1';
      const url = `${apiUrl}/${productId}`;
      const updatedData = { name: 'Updated Product Name' };
      const mockResponse = { 
        message: 'Product updated successfully', 
        data: { ...mockProduct, ...updatedData } 
      };

      service.updateProduct(productId, updatedData).subscribe(product => {
        expect(product.name).toBe('Updated Product Name');
        expect(product.id).toBe('1');
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedData);
      req.flush(mockResponse);
    });
  });
});
