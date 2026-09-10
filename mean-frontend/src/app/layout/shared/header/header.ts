import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { ITokenData } from '../../../core/models/auth.model';
import { CartService } from '../../../core/services/cart.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink,RouterLinkActive,AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit{
  _cartCount!: Observable<number>;

  constructor(private _authService:AuthService, private _cartService:CartService){  
    this._cartCount = this._cartService._cartCount;
}
   userData:ITokenData |null = null;
  

  ngOnInit(): void {
     
    this._authService.getAuthData().subscribe((data)=>{
      this.userData=data;
        
    })
  }

  logout(){
    this._authService.logoutService();
  }


}
