import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductEditComponent } from './product-edit';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProductDettail } from '../../models/product-list.model';

describe('ProductEditComponent', () => {
  let component: ProductEditComponent;
  let fixture: ComponentFixture<ProductEditComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  const mockProduct: ProductDettail = {
    id: 'test-id',
    name: 'Test Product',
    description: 'Test Description for the product',
    logo: 'test-logo.png',
    date_release: '2024-01-01',
    date_revision: '2025-01-01'
  };

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts', 'updateProduct']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('test-id')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ProductEditComponent, ReactiveFormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    mockProductService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    mockProductService.getProducts.and.returnValue(of([mockProduct]));
    
    fixture = TestBed.createComponent(ProductEditComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with disabled id and date_revision fields', () => {
    expect(component.form.get('id')?.disabled).toBe(true);
    expect(component.form.get('date_revision')?.disabled).toBe(true);
  });

  it('should load product data on initialization', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(mockProductService.getProducts).toHaveBeenCalled();
    expect(component.form.get('id')?.value).toBe(mockProduct.id);
    expect(component.form.get('name')?.value).toBe(mockProduct.name);
    expect(component.form.get('description')?.value).toBe(mockProduct.description);
    expect(component.form.get('logo')?.value).toBe(mockProduct.logo);
    expect(component.form.get('date_release')?.value).toBe(mockProduct.date_release);
    expect(component.form.get('date_revision')?.value).toBe(mockProduct.date_revision);
  }));

  it('should handle case when product is not found', fakeAsync(() => {
    mockProductService.getProducts.and.returnValue(of([])); // No products
    
    fixture.detectChanges();
    tick();

    expect(mockProductService.getProducts).toHaveBeenCalled();
    expect(component.form.get('name')?.value).toBe('');
  }));

  it('should handle case when no id in route', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);
    
    fixture.detectChanges();

    expect(mockProductService.getProducts).not.toHaveBeenCalled();
  });

  it('should automatically calculate revision date when release date changes', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    // Change release date
    component.form.get('date_release')?.setValue('2024-06-01');
    tick();

    expect(component.form.get('date_revision')?.value).toBe('2025-06-01');
  }));

  it('should clear revision date when release date is cleared', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    // Clear release date
    component.form.get('date_release')?.setValue('');
    tick();

    expect(component.form.get('date_revision')?.value).toBe('');
  }));

  it('should validate required fields', () => {
    component.form.patchValue({
      name: '',
      description: '',
      logo: '',
      date_release: ''
    });

    expect(component.form.get('name')?.hasError('required')).toBeTruthy();
    expect(component.form.get('description')?.hasError('required')).toBeTruthy();
    expect(component.form.get('logo')?.hasError('required')).toBeTruthy();
    expect(component.form.get('date_release')?.hasError('required')).toBeTruthy();
  });

  it('should validate field lengths', () => {
    // Name validation
    component.form.get('name')?.setValue('abc'); // too short
    expect(component.form.get('name')?.hasError('minlength')).toBeTruthy();

    component.form.get('name')?.setValue('a'.repeat(101)); // too long
    expect(component.form.get('name')?.hasError('maxlength')).toBeTruthy();

    component.form.get('name')?.setValue('Valid Product Name'); // valid
    expect(component.form.get('name')?.hasError('minlength')).toBeFalsy();
    expect(component.form.get('name')?.hasError('maxlength')).toBeFalsy();

    // Description validation
    component.form.get('description')?.setValue('short'); // too short
    expect(component.form.get('description')?.hasError('minlength')).toBeTruthy();

    component.form.get('description')?.setValue('a'.repeat(201)); // too long
    expect(component.form.get('description')?.hasError('maxlength')).toBeTruthy();

    component.form.get('description')?.setValue('Valid description that is long enough'); // valid
    expect(component.form.get('description')?.hasError('minlength')).toBeFalsy();
    expect(component.form.get('description')?.hasError('maxlength')).toBeFalsy();
  });

  it('should validate release date is not in the past', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    component.form.get('date_release')?.setValue(yesterdayString);
    expect(component.form.get('date_release')?.hasError('releaseDateInvalid')).toBeTruthy();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];

    component.form.get('date_release')?.setValue(tomorrowString);
    expect(component.form.get('date_release')?.hasError('releaseDateInvalid')).toBeFalsy();
  });

  it('should return correct control from getControl method', () => {
    const nameControl = component.getControl('name');
    expect(nameControl).toBe(component.form.get('name'));

    const nonExistentControl = component.getControl('nonexistent');
    expect(nonExistentControl).toBeNull();
  });

  it('should not submit when form is invalid', () => {
    spyOn(component.form, 'markAllAsTouched');
    
    // Make form invalid
    component.form.get('name')?.setValue('');
    
    component.onSubmit();

    expect(component.form.markAllAsTouched).toHaveBeenCalled();
    expect(mockProductService.updateProduct).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should not submit when no id in route', fakeAsync(() => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);
    
    // Make form valid
    component.form.patchValue({
      name: 'Valid Product Name',
      description: 'Valid description that is long enough',
      logo: 'test-logo.png',
      date_release: '2024-12-01'
    });
    component.form.markAsUntouched();
    
    component.onSubmit();
    tick();

    expect(mockProductService.updateProduct).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  }));

  it('should submit successfully when form is valid', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const updatedProduct = { ...mockProduct, name: 'Updated Product Name' };
    mockProductService.updateProduct.and.returnValue(of(updatedProduct));

    // Update form
    component.form.patchValue({
      name: 'Updated Product Name',
      description: 'Updated description that is long enough',
      logo: 'updated-logo.png',
      date_release: '2024-12-01'
    });

    component.onSubmit();
    tick();

    expect(mockProductService.updateProduct).toHaveBeenCalledWith('test-id', jasmine.objectContaining({
      id: 'test-id',
      name: 'Updated Product Name'
    }));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should handle submit error', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    mockProductService.updateProduct.and.returnValue(throwError(() => new Error('Server error')));
    spyOn(window, 'alert');

    // Make form valid
    component.form.patchValue({
      name: 'Valid Product Name',
      description: 'Valid description that is long enough',
      logo: 'test-logo.png',
      date_release: '2024-12-01'
    });

    component.onSubmit();
    tick();

    expect(mockProductService.updateProduct).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Error al actualizar el producto');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  }));
});
