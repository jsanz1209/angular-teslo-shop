import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@app/features/auth/services/auth.service';

@Component({
  selector: 'app-navbar-store',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-store.component.html',
})
export class NavbarStoreComponent {

  authSrv = inject(AuthService);
 }
