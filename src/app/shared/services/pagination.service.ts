import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable()
export class PaginationService {

  private _activaedRoute = inject(ActivatedRoute);
  private _router = inject(Router)

  limit = signal(10); // Default offset value

  currengPage = toSignal(
    this._activaedRoute.queryParams.pipe(
      map(params => {
        const page = params['page'] ? +params['page'] : 1;
        return Number(page) > 0 ? Number(page) : 1;
      })
    ),
    { initialValue: 1 }
  );

  resetPage() {
    this._router.navigate([], {
      queryParams: {},
      queryParamsHandling: '', // 👈 importante: evita que se mezclen con los actuales
    });
  }

  pagesArray = (totalPages: number) => computed(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  });


}

