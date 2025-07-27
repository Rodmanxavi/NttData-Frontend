import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { ProductService } from '../../services/product-list.service';
import { ProductDettail } from '../../models/product-list.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

function releaseDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const today = new Date();
    const inputDate = new Date(control.value);
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
    return inputDate >= today ? null : { releaseDateInvalid: true };
  };
}

function idUniqueValidator(productService: ProductService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return of(null);
    return productService.getProducts().pipe(
      map(products => {
        const exists = products.some(p => p.id === control.value);
        return exists ? { idNotUnique: true } : null;
      })
    );
  };
}

@Component({
  selector: 'app-product-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-new.html',
  styleUrl: './product-new.css'
})
export class ProductNewComponent {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  form: FormGroup = this.fb.group({
    id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)], [idUniqueValidator(this.productService)]],
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    logo: ['', Validators.required],
    date_release: ['', [Validators.required, releaseDateValidator()]],
    date_revision: [{ value: '', disabled: true }] // <-- Deshabilitado desde el inicio
  });

  constructor() {
    this.form.get('date_release')?.valueChanges.subscribe((releaseValue) => {
      if (releaseValue) {
        const releaseDate = new Date(releaseValue);
        const revisionDate = new Date(releaseDate);
        revisionDate.setFullYear(revisionDate.getFullYear() + 1);
        const formatted = revisionDate.toISOString().split('T')[0];
        this.form.get('date_revision')?.setValue(formatted, { emitEvent: false });
      } else {
        this.form.get('date_revision')?.setValue('', { emitEvent: false });
      }
    });
  }

  getControl(name: string): AbstractControl | null {
    return this.form.get(name);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Verifica si el ID es único antes de enviar
    this.getControl('id')?.updateValueAndValidity();
    if (this.getControl('id')?.hasError('idNotUnique')) {
      this.form.get('id')?.setValue('');
      this.form.get('id')?.markAsTouched();
      return;
    }

    // Obtén los valores incluyendo los deshabilitados
    const product: ProductDettail = {
      ...this.form.getRawValue()
    };

    this.productService.addProduct(product).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        alert('Error al guardar el producto');
      }
    });
  }
}