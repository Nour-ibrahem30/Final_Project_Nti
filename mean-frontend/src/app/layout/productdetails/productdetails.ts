import { Iproduct } from './../../core/models/product.model';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product-service';
import { Products } from '../productlist/products/products';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth-service';
import { GuestService } from '../../core/services/guest-service';

@Component({
  selector: 'app-productdetails',
  imports: [CommonModule,Products],
  templateUrl: './productdetails.html',
  styleUrl: './productdetails.css',
})
export class Productdetails implements OnInit {
  constructor(private _activatedRoute:ActivatedRoute 
    ,private _authService:AuthService
    ,private productService:ProductService
    ,private _guestService:GuestService
    ,private _cartService:CartService
    ,private cdr:ChangeDetectorRef){}
  myProduct!: Iproduct;
  slug='';
  staticLink= environment.staticFilesURL;
  products!:Iproduct[];

  quantity: number = 1;
  isAddedToCart: boolean = false;

increase() {
  if (this.quantity < this.myProduct.stock) {
    this.quantity++;
  }
}

decrease() {
  if (this.quantity > 1) {
    this.quantity--;
    
    
  }
}

addToCart() {
  if (this.myProduct.stock === 0 || this.isAddedToCart) return;
  
  if(this._authService.isloggedIn()){
this._cartService.addToCart(this.myProduct._id, this.quantity)
  .subscribe((res)=>{
    console.log('Added to cart', res);
    console.log({ product: this.myProduct, quantity: this.quantity });
          this.isAddedToCart = true; // flip the flag

  })
  }
  else{
    this._cartService.addGuestItem(this.myProduct,this.quantity)
        this.isAddedToCart = true;
  }
  
  

}

  ngOnInit(): void {

    this._activatedRoute.paramMap.subscribe(paramMap=>{
      this.slug = paramMap.get('slug')!
      this.quantity = 1; 
      this.isAddedToCart = false;

      this.productService.getProductDetails(this.slug).subscribe(prodres=> {
        console.log(prodres);
        this.myProduct = prodres.data;
        this.products  = prodres.related;
        console.log(prodres.related);
     this.cdr.detectChanges();

      })
    })
    
    
  }

}
