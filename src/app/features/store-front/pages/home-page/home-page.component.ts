import { Component, inject } from '@angular/core';
import { ProductCardComponent } from '@app/features/products/components/product-card/product-card.component';
import { ProductsService } from '@app/features/products/services/products.service';

import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from "@app/shared/components/pagination/pagination.component";
import { PaginationService } from '@app/shared/services/pagination.service';


@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  providers: [ProductsService, PaginationService],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {

  private _productsSrv = inject(ProductsService);
  private _paginationSrv = inject(PaginationService);

  currengPage = this._paginationSrv.currengPage;

  productsResource = rxResource({
    params: () => ({ currentPage: this.currengPage() }),
    stream: () => (this._productsSrv.getProducts({
      offset: (this.currengPage() - 1) * 10,
    }))
  });

}
