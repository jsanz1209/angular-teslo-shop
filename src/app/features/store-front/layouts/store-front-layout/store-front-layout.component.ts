import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarStoreComponent } from '@app/features/store-front/components/navbar-store/navbar-store.component';

@Component({
  selector: 'app-store-front-layout',
  imports: [RouterOutlet, NavbarStoreComponent],
  templateUrl: './store-front-layout.component.html',
})
export class StoreFrontLayoutComponent { }
