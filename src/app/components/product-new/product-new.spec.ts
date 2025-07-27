import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductNewComponent } from './product-new';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProductDettail } from '../../models/product-list.model';

describe('ProductNewComponent', () => {
  let component: ProductNewComponent;
  let fixture: ComponentFixture<ProductNewComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['verifyProductId', 'addProduct']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProductNewComponent, ReactiveFormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    mockProductService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    fixture = TestBed.createComponent(ProductNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.get('id')?.value).toBe('');
    expect(component.form.get('name')?.value).toBe('');
    expect(component.form.get('description')?.value).toBe('');
    expect(component.form.get('logo')?.value).toBe('');
    expect(component.form.get('date_release')?.value).toBe('');
    expect(component.form.get('date_revision')?.disabled).toBe(true);
  });

  it('should validate required fields', () => {
    const form = component.form;
    expect(form.valid).toBeFalsy();

    // Test required validation
    expect(form.get('id')?.hasError('required')).toBeTruthy();
    expect(form.get('name')?.hasError('required')).toBeTruthy();
    expect(form.get('description')?.hasError('required')).toBeTruthy();
    expect(form.get('logo')?.hasError('required')).toBeTruthy();
    expect(form.get('date_release')?.hasError('required')).toBeTruthy();
  });

  it('should validate field lengths', () => {
    const form = component.form;

    // ID validation
    form.get('id')?.setValue('ab'); // too short
    expect(form.get('id')?.hasError('minlength')).toBeTruthy();

    form.get('id')?.setValue('12345678901'); // too long
    expect(form.get('id')?.hasError('maxlength')).toBeTruthy();

    form.get('id')?.setValue('abc123'); // valid
    expect(form.get('id')?.hasError('minlength')).toBeFalsy();
    expect(form.get('id')?.hasError('maxlength')).toBeFalsy();

    // Name validation
    form.get('name')?.setValue('abc'); // too short
    expect(form.get('name')?.hasError('minlength')).toBeTruthy();

    form.get('name')?.setValue('a'.repeat(101)); // too long
    expect(form.get('name')?.hasError('maxlength')).toBeTruthy();

    form.get('name')?.setValue('Valid Product Name'); // valid
    expect(form.get('name')?.hasError('minlength')).toBeFalsy();
    expect(form.get('name')?.hasError('maxlength')).toBeFalsy();

    // Description validation
    form.get('description')?.setValue('short'); // too short
    expect(form.get('description')?.hasError('minlength')).toBeTruthy();

    form.get('description')?.setValue('a'.repeat(201)); // too long
    expect(form.get('description')?.hasError('maxlength')).toBeTruthy();

    form.get('description')?.setValue('Valid description that is long enough'); // valid
    expect(form.get('description')?.hasError('minlength')).toBeFalsy();
    expect(form.get('description')?.hasError('maxlength')).toBeFalsy();
  });

  it('should validate release date is not in the past', () => {
    const form = component.form;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    form.get('date_release')?.setValue(yesterdayString);
    expect(form.get('date_release')?.hasError('releaseDateInvalid')).toBeTruthy();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];

    form.get('date_release')?.setValue(tomorrowString);
    expect(form.get('date_release')?.hasError('releaseDateInvalid')).toBeFalsy();
  });

  it('should automatically calculate revision date', fakeAsync(() => {
    const releaseDate = '2024-01-01';
    component.form.get('date_release')?.setValue(releaseDate);
    tick();

    expect(component.form.get('date_revision')?.value).toBe('2025-01-01');
  }));

  it('should clear revision date when release date is cleared', fakeAsync(() => {
    // Set initial date
    component.form.get('date_release')?.setValue('2024-01-01');
    tick();
    expect(component.form.get('date_revision')?.value).toBe('2025-01-01');

    // Clear release date
    component.form.get('date_release')?.setValue('');
    tick();
    expect(component.form.get('date_revision')?.value).toBe('');
  }));

  it('should validate unique ID', fakeAsync(() => {
    mockProductService.verifyProductId.and.returnValue(of(true)); // ID exists

    component.form.get('id')?.setValue('existing-id');
    component.form.get('id')?.updateValueAndValidity();
    tick();

    expect(component.form.get('id')?.hasError('idNotUnique')).toBeTruthy();

    mockProductService.verifyProductId.and.returnValue(of(false)); // ID doesn't exist

    component.form.get('id')?.setValue('unique-id');
    component.form.get('id')?.updateValueAndValidity();
    tick();

    expect(component.form.get('id')?.hasError('idNotUnique')).toBeFalsy();
  }));

  it('should return correct control from getControl method', () => {
    const idControl = component.getControl('id');
    expect(idControl).toBe(component.form.get('id'));

    const nonExistentControl = component.getControl('nonexistent');
    expect(nonExistentControl).toBeNull();
  });

  it('should not submit when form is invalid', () => {
    spyOn(component.form, 'markAllAsTouched');
    
    component.onSubmit();

    expect(component.form.markAllAsTouched).toHaveBeenCalled();
    expect(mockProductService.addProduct).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should not submit when ID is not unique', fakeAsync(() => {
    // Fill form with valid data
    component.form.patchValue({
      id: 'test-id',
      name: 'Test Product Name',
      description: 'Test product description that is long enough',
      logo: 'test-logo.png',
      date_release: '2024-12-01'
    });

    // Mock ID as not unique
    mockProductService.verifyProductId.and.returnValue(of(true));
    
    component.onSubmit();
    tick();

    expect(component.form.get('id')?.value).toBe('');
    expect(component.form.get('id')?.touched).toBe(true);
    expect(mockProductService.addProduct).not.toHaveBeenCalled();
  }));

  it('should submit successfully when form is valid', fakeAsync(() => {
    const mockProduct: ProductDettail = {
      id: 'test-id',
      name: 'Test Product Name',
      description: 'Test product description that is long enough',
      logo: 'test-logo.png',
      date_release: '2024-12-01',
      date_revision: '2025-12-01'
    };

    // Fill form
    component.form.patchValue({
      id: 'test-id',
      name: 'Test Product Name',
      description: 'Test product description that is long enough',
      logo: 'test-logo.png',
      date_release: '2024-12-01'
    });

    // Mock ID as unique and successful product creation
    mockProductService.verifyProductId.and.returnValue(of(false));
    mockProductService.addProduct.and.returnValue(of(mockProduct));

    component.onSubmit();
    tick();

    expect(mockProductService.addProduct).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should handle submit error', fakeAsync(() => {
    // Fill form with valid data
    component.form.patchValue({
      id: 'test-id',
      name: 'Test Product Name',
      description: 'Test product description that is long enough',
      logo: 'test-logo.png',
      date_release: '2024-12-01'
    });

    // Mock ID as unique but product creation fails
    mockProductService.verifyProductId.and.returnValue(of(false));
    mockProductService.addProduct.and.returnValue(throwError(() => new Error('Server error')));
    spyOn(window, 'alert');

    component.onSubmit();
    tick();

    expect(mockProductService.addProduct).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Error al guardar el producto');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  }));
});
