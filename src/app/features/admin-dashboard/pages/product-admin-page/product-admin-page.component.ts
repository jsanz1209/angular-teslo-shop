import { Component, effect, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsComponent } from "@app/features/products/components/product-details/product-details.component";
import { ProductsService } from '@app/features/products/services/products.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetailsComponent],
  providers: [ProductsService],
  templateUrl: './product-admin-page.component.html',
})
export class ProductAdminPageComponent {

  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);

  private _productsSrv = inject(ProductsService);

  productId = this._activatedRoute.snapshot.params['id'];

  productResource = rxResource({

    params: () => ({ productId: this.productId }),
    stream: ({ params: { productId } }) => {
      if (productId === 'new') {
        return of(null)
      } else {
        return this._productsSrv.getProductBySlug(productId);
      }
    }
  });

  redirectEffect = effect(() => {
    if (this.productId !== 'new' && this.productResource.error()) {
      // Redirect to the product list page if there's an error
      this._router.navigate(['/admin/products']);
    }
  });

}
