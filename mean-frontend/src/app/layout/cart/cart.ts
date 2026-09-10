import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth-service';
import { ICart,ICartItem } from '../../core/models/cart.model';
import { IGuestCartItem } from '../../core/models/guest.model';
import { environment } from '../../../environments/environment';
@Component({selector:'app-cart',imports:[CommonModule,RouterLink],templateUrl:'./cart.html',styleUrl:'./cart.css'})
export class Cart implements OnInit{
 cart:ICart|null=null; guestItems:IGuestCartItem[]=[]; staticURL=environment.staticFilesURL; message=''; authLoggedIn=false;
 constructor(private cartService:CartService,private auth:AuthService){}
 ngOnInit(){this.authLoggedIn=this.auth.isloggedIn();if(this.authLoggedIn) this.load(); else this.guestItems=this.cartService.getGuestItems();}
 load(){this.cartService.getCart().subscribe({next:r=>this.cart=r.data,error:e=>this.message=e.error?.message||'Unable to load cart'});}
 get changedItems(){return (this.cart?.items||[]).filter(i=>i.isPriceChanged);}
 get normalItems(){return (this.cart?.items||[]).filter(i=>!i.isPriceChanged);}
 get total(){return this.cart?.totalPrice||0;}
 increase(i:ICartItem){if(i.quantity<i.productId.stock)this.cartService.updateCartItem(i._id,i.quantity+1).subscribe({next:r=>this.cart=r.data});}
 decrease(i:ICartItem){if(i.quantity>1)this.cartService.updateCartItem(i._id,i.quantity-1).subscribe({next:r=>this.cart=r.data});}
 remove(i:ICartItem){this.cartService.removeCartItem(i._id).subscribe({next:r=>this.cart=r.data});}
 resolve(i:ICartItem,action:'accept'|'remove'){this.cartService.resolvePriceChange(i._id,action).subscribe({next:r=>this.cart=r.data});}
 clear(){this.cartService.clearCart().subscribe({next:()=>this.cart=null});}
 get guestTotal(){return this.guestItems.reduce((s,i)=>s+i.price*i.quantity,0);}
 increaseGuest(i:IGuestCartItem){if(i.quantity<i.stock){i.quantity++;this.cartService.updateGuest(i.productId,i.quantity);}}
 decreaseGuest(i:IGuestCartItem){if(i.quantity>1){i.quantity--;this.cartService.updateGuest(i.productId,i.quantity);}}
 removeGuest(id:string){this.cartService.removeGuest(id);this.guestItems=this.cartService.getGuestItems();}
}
