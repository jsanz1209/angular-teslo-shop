import { AfterViewInit, Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@app/features/products/services/products.service';
import { ProductCarouselComponent } from "@app/features/products/components/product-carousel/product-carousel.component";


@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  providers: [ProductsService],
  templateUrl: './product-page.component.html'
})
export class ProductPageComponent  {

  private _productsSrv = inject(ProductsService);
  private _activatedRoute = inject(ActivatedRoute);

  private _slug = this._activatedRoute.snapshot.params['id'];

  productResource = rxResource({
    params: () => ({}),
    stream: () => (this._productsSrv.getProductBySlug(this._slug)),
  });

}
//
