import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductTableComponent } from "@app/features/products/components/product-table/product-table.component";
import { ProductsService } from '@app/features/products/services/products.service';
import { PaginationComponent } from "@app/shared/components/pagination/pagination.component";
import { PaginationService } from '@app/shared/services/pagination.service';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, FormsModule, RouterLink],
  providers: [ProductsService, PaginationService],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {

  private _productsSrv = inject(ProductsService);
  private _paginationSrv = inject(PaginationService);

  currengPage = this._paginationSrv.currengPage;
  limit = signal(this._paginationSrv.limit());

  productsResource = rxResource({
    params: () => ({ currentPage: this.currengPage(), limit: this.limit() }),
    stream: () => (this._productsSrv.getProducts({
      offset: (this.currengPage() - 1) * this.limit(),
      limit: this.limit()
    }))
  });

  onChangeSelector(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newOffset = Number(selectElement.value);
    this._paginationSrv.resetPage();
    this._paginationSrv.limit.set(newOffset);
  }
}
