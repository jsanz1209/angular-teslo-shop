import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product, ProductsAPIResponse } from '@app/features/products/interfaces/products-api-response';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ImageAPIResponse } from '../interfaces/image-api-response.model';
import { ProductParams } from '../interfaces/product-params';

@Injectable()
export class ProductsService {

  private _http = inject(HttpClient);

  imageURL = `${environment.apiBaseUrl}/files/product`;

  getProducts(params: ProductParams) {
    return this._http.get<ProductsAPIResponse>(`${environment.apiBaseUrl}/products`, {
      params: params as unknown as HttpParams // Cast to any to avoid type issues with HttpClient
    });
  }

  getFileProduct(imageName: string) {
    return this._http.get(`${this.imageURL}/${imageName}`, {
      responseType: 'blob'
    });
  }

  getProductBySlug(slug: string) {
    return this._http.get<Product>(`${environment.apiBaseUrl}/products/${slug}`);
  }

  createProduct(product: Omit<Product, 'id'>) {
    return this._http.post<Product>(`${environment.apiBaseUrl}/products`, product);
  }

  updateProduct(id: string, product: Omit<Product, 'id'>) {
    return this._http.patch<Product>(`${environment.apiBaseUrl}/products/${id}`, product);
  }

  deleteProduct(id: string) {
    return this._http.delete<void>(`${environment.apiBaseUrl}/products/${id}`);
  }

  uploadImages(files: FileList) {
    const fileArray = Array.from(files);
    return forkJoin(fileArray.map(file => this.uploadImage(file)));
  }

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this._http.post<ImageAPIResponse>(`${environment.apiBaseUrl}/files/product`, formData);
  }

}
