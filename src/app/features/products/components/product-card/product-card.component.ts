import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Product } from '@app/features/products/interfaces/products-api-response';
import { ProductsService } from '@app/features/products/services/products.service';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styles: [
    `
    .card-title {
      min-height: 4rem;
      allign-items: baseline;
    }

     p {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
     }
    `
  ]
})
export class ProductCardComponent {

  private _productsSrv = inject(ProductsService);

  product = input.required<Product>();

  imageURL =computed(() => {
    if (!this.product().images || this.product().images.length === 0) {
      return '/images/placeholder.jpg'; // Fallback image if no images are available
    }
    return `${this._productsSrv.imageURL}/${this.product().images[0]}`;
  });

}
