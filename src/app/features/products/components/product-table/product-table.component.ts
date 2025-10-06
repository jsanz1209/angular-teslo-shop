import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@app/features/products/interfaces/products-api-response';
import { ProductsService } from '@app/features/products/services/products.service';

@Component({
  selector: 'app-product-table',
  imports: [RouterLink, CurrencyPipe],
  providers: [ProductsService],
  templateUrl: './product-table.component.html',
})
export class ProductTableComponent {

  products = input.required<Product[]>();

  private _productsSrv = inject(ProductsService)

  imageURL = (product: Product) => computed(() => {
    if (!product.images || product.images.length === 0) {
      return '/images/placeholder.jpg'; // Fallback image if no images are available
    }
    return `${this._productsSrv.imageURL}/${product.images[0]}`;
  });
}
