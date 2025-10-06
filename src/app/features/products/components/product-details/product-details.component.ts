import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormHelpers } from '@app/features/auth/helpers/form-helpers';
import { ProductCarouselComponent } from '@app/features/products/components/product-carousel/product-carousel.component';
import { Product } from '@app/features/products/interfaces/products-api-response';
import { ProductsService } from '@app/features/products/services/products.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [
    ReactiveFormsModule,
    ProductCarouselComponent
  ],
  providers: [ProductsService],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {

  private _formBuilder = inject(FormBuilder);
  private _productsSrv = inject(ProductsService);
  private _routerSrv = inject(Router);

  product = input.required<Product | null>();

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  productForm = this._formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    slug: ['', [Validators.required, Validators.minLength(3)], [this.checkingSlugTaken()]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: [null, [Validators.required, Validators.min(1)]],
    stock: [null, [Validators.required, Validators.min(0)]],
    tags: [[] as string[]],
    gender: ['kid', [Validators.required, Validators.pattern(/^(men|women|kid|unisex)$/)]],
    images: [[] as string[]],
    sizes: [[] as string[], [Validators.required]],
  });

  loading = signal(false);

  images = signal<string[]>([]);

  tempImages: string[] = [];

  private tempFiles: FileList | null = null;

  ngOnInit(): void {
    if (this.product() !== null) {
      this.tempImages = this.product()?.images || [];
      console.log('Product images initialized:', this.images());
      this.productForm.patchValue(this.product() as any);
      console.log('Product details form initialized with:', this.productForm.value);
    }
  }

  isInvalidField = (field: string) => computed(() => {
    return FormHelpers.isInvalidField(this.productForm, field);
  });

  getFieldError = (field: string) => computed(() => {
    return FormHelpers.getFieldError(this.productForm, field);
  });

  onChangeTags(value: Event) {
    const input = value.target as HTMLInputElement;
    const tags = input.value.split(', ').map(tag => tag.trim()).filter(tag => tag);
    this.productForm.patchValue({ tags });
  }

  onUpdateGender(gender: string) {
    const value = this.productForm.value.gender as string | null;
    if (value === gender) {
      this.productForm.patchValue({ gender: '' });
    } else {
      this.productForm.patchValue({ gender });
    }
  }

  onUpdateSize(size: string) {
    const sizes = this.productForm.value.sizes as string[];
    if (sizes.includes(size)) {
      this.productForm.patchValue({
        sizes: sizes.filter(s => s !== size)
      });
    } else {
      this.productForm.patchValue({
        sizes: [...sizes, size]
      });
    }
  }

  onSubmit() {
    FormHelpers.markAllAsTouched(this.productForm);
    console.log('Form submitted:', this.productForm);

    if (this.productForm.invalid) {
      console.error('Form is invalid:', this.productForm.errors);
      return;
    }

    this.sendProductData();
  }

  onDeleteProduct() {
    if (this.product() === null) {
      console.warn('No product to delete');
      return;
    }
    const id = this.product()?.id as string;
    this.loading.set(true);
    this._productsSrv.deleteProduct(id).subscribe({
      next: () => {
        console.log('Product deleted successfully');
        this.loading.set(false);
        this._routerSrv.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error('Error deleting product:', err);
        this.loading.set(false);
      }
    });
  }

  onImagesLoaded(event: Event) {
    console.log('Images loaded:', event);
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.tempFiles = files;
    if (files && files.length > 0) {
      const images = Array.from(files).map(file => URL.createObjectURL(file));
      this.productForm.patchValue({ images });
      this.tempImages = images;
      this.images.set(images);
      console.log('Images loaded:', files);
    } else {
      console.warn('No files selected');
    }
  }

  onDeleteImage(image: string) {
    const currentImages = this.images();
    const updatedImages = currentImages.filter(img => img !== image);
    this.images.set(updatedImages);
    console.log('Image deleted:', image, 'Updated images:', updatedImages);
  }

  private checkingSlugTaken(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this._productsSrv.getProductBySlug(control.value)
        .pipe(
          map(product => {
            if (product !== null) {
              return this.product()?.id !== product.id ? { slugTaken: true } : null;
            } else {
              return { slugTaken: false };
            }
          })
        )
    }
  }

  private sendProductData() {
    if (this.product() === null) {
      this.createProduct();
    } else {
      this.updateProduct();
    }
  }

  private async createProduct() {
    try {
      await this.uploadImages();
      this._productsSrv.createProduct(
        {
          ...this.productForm.value,
        } as unknown as Omit<Product, 'id'>).subscribe({
          next: (product) => {
            console.log('Product created successfully:', product);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error creating product:', err);
            this.loading.set(false);
          }
        });
      this.productForm.reset();
    } catch (error) {
      console.error('Error during product creation:', error);
    }
  }

  private async updateProduct() {
    try {
      await this.uploadImages();
      const id = this.product()?.id as string;
      this.loading.set(true);
      this._productsSrv.updateProduct(
        id,
        {
          ...this.productForm.value,
        } as unknown as Omit<Product, 'id'>).subscribe({
          next: (product) => {
            console.log('Product updated successfully:', product);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error updating product:', err);
            this.loading.set(false);
          }
        });
    } catch (error) {
      console.error('Error during product update:', error);
    }
  }

  private uploadImages() {
    return new Promise<void>((resolve, reject) => {
      const files = Array.from(this.tempFiles || []);
      if (files.length === 0) {
        console.warn('No images to upload');
        resolve();
        return;
      }
      this.loading.set(true);
      this._productsSrv.uploadImages(this.tempFiles as FileList).subscribe({
        next: (images) => {
          console.log('Images uploaded successfully:', images);
          this.loading.set(false);
          this.productForm.patchValue({
            images: images.map(image => image.fileName)
          });
          resolve();
        },
        error: (err) => {
          console.error('Error uploading images:', err);
          this.loading.set(false);
          reject(err);
        }
      });
    });
  }
}
