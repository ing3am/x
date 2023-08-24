import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, RouterStateSnapshot,
  CanActivate, Router
} from '@angular/router';
import { LocalStService } from './local-st.service';
import { Observable } from 'rxjs';
import Swt from 'sweetalert2'
@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  constructor(
    private localstService: LocalStService,
    private router: Router) { }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.localstService.isLoggedIn !== true) {
      Swt.fire('Error', 'No tienes acceso', 'error');
      this.router.navigate([''])
    }
    return true;
  }
}
