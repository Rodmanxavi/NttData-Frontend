import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.css'
})
export class ProductEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  form: FormGroup = this.fb.group({
    id: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    logo: ['', Validators.required],
    date_release: ['', [Validators.required, releaseDateValidator()]],
    date_revision: [{ value: '', disabled: true }]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProducts().subscribe(products => {
        const product = products.find(p => p.id === id);
        if (product) {
          this.form.patchValue(product);
          this.form.get('date_revision')?.setValue(product.date_revision);
        }
      });
      // Actualiza la fecha de revisión si cambia la fecha de liberación
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
  }

  getControl(name: string): AbstractControl | null {
    return this.form.get(name);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    const product = {
      ...this.form.getRawValue(),
      id // Asegura que el id esté presente
    };
    this.productService.updateProduct(id, product).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => alert('Error al actualizar el producto')
    });
  }
}
