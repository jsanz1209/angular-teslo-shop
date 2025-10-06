import { TitleCasePipe } from '@angular/common';
import { Component, effect, inject, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from "@app/features/products/components/product-card/product-card.component";
import { Gender } from '@app/features/products/interfaces/products-api-response';
import { ProductsService } from '@app/features/products/services/products.service';
import { PaginationComponent } from "@app/shared/components/pagination/pagination.component";
import { PaginationService } from '@app/shared/services/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [TitleCasePipe, ProductCardComponent, PaginationComponent],
  providers: [ProductsService, PaginationService],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {

  private _productsSrv = inject(ProductsService);
  private _activatedRoute = inject(ActivatedRoute);

  private _paginationSrv = inject(PaginationService);

  currengPage = this._paginationSrv.currengPage;

  gender = linkedSignal<string | null>(() => {
    const params = this._activatedRoute.snapshot.params;
    return params['id'] as string | null;
  });

  changeRoute = effect((onCleanUp) => {
    const subscription = this._activatedRoute.params.subscribe(params => {
      console.log('Route changed:', params);
      this.gender.update(() => params['id'] as string | null);
    });

    onCleanUp(() => subscription.unsubscribe());
  });

  productsResource = rxResource({
    params: () => ({ gender: this.gender(), currentPage: this.currengPage() }),
    stream: () => (this._productsSrv.getProducts({
      offset: (this.currengPage() - 1) * 10,
      gender: this.gender() as Gender
    })),
  })
}
