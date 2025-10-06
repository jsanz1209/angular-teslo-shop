import { AfterViewInit, Component, computed, effect, ElementRef, inject, input, signal, viewChild } from '@angular/core';
// core version + navigation, pagination modules:
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
// import Swiper and modules styles
import { ProductsService } from '@app/features/products/services/products.service';


import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


@Component({
  selector: 'app-product-carousel',
  imports: [],
  templateUrl: './product-carousel.component.html',
  styles: [
    `
    .swiper {
      width: auto;
      height: 300px;
    }`
  ]
})
export class ProductCarouselComponent implements AfterViewInit {

  private _productsSrv = inject(ProductsService);

  images = input.required<string[]>();

  swiperContainer = viewChild<ElementRef>('swiperContainer')

  swiper = signal<Swiper | null>(null);

  ngAfterViewInit(): void {

    const element = this.swiperContainer()?.nativeElement;
    if (!element) {
      console.error('Swiper element not found');
      return;
    }

    // init Swiper:
    const swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,
      modules: [Navigation, Pagination],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });

    this.swiper.set(swiper);
  }

  imageURL = (imageName: string) => computed(() => {
    if (imageName.includes('blob')) {
      return imageName; // Return the blob URL directly
    }
    return `${this._productsSrv.imageURL}/${imageName}`;
  });

  private _changeImages = effect(() => {
    const images = this.images();
    if (images && images.length > 0) {
      setTimeout(() => {
        this.swiper()?.update();
        this.swiper()?.pagination?.render();
        this.swiper()?.pagination?.update();
        console.log('Swiper updated with new images:', images);
      });
    }
  });

}
