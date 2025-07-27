import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductDettail } from '../models/product-list.model';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = 'http://localhost:3002/bp/products';

  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<ProductDettail[]> {
    return this.http.get<{ data: ProductDettail[] }>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  addProduct(product: ProductDettail): Observable<ProductDettail> {
    return this.http.post<{ data: ProductDettail }>(this.apiUrl, product).pipe(
      map(response => response.data)
    );
  }
}