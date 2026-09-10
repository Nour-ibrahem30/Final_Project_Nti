import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ICartItem, ICartResponse } from '../models/cart.model';
import { GuestService } from './guest-service';
@Injectable({providedIn:'root'})
export class CartService {
  private readonly apiURL=environment.apiURL+'cart';
  private cartCount=new BehaviorSubject<number>(0);
  _cartCount=this.cartCount.asObservable();
  constructor(private http:HttpClient,private guest:GuestService){}
  private options(){return {headers:{Authorization:`Bearer ${localStorage.getItem('token')||''}`}}}
  private updateCount(items:ICartItem[]){this.cartCount.next(items.reduce((n,i)=>n+i.quantity,0));}
  getCart(){return this.http.get<ICartResponse>(this.apiURL,this.options()).pipe(tap(r=>this.updateCount(r.data?.items||[])));}
  addToCart(productId:string,quantity:number){return this.http.post<ICartResponse>(this.apiURL+'/add',{productId,quantity},this.options()).pipe(tap(r=>this.updateCount(r.data?.items||[])));}
  updateCartItem(itemId:string,quantity:number){return this.http.put<ICartResponse>(`${this.apiURL}/item/${itemId}`,{quantity},this.options()).pipe(tap(r=>this.updateCount(r.data?.items||[])));}
  removeCartItem(itemId:string){return this.http.delete<ICartResponse>(`${this.apiURL}/item/${itemId}`,this.options()).pipe(tap(r=>this.updateCount(r.data?.items||[])));}
  resolvePriceChange(itemId:string,action:'accept'|'remove'){return this.http.put<ICartResponse>(`${this.apiURL}/item/${itemId}/price-change`,{action},this.options()).pipe(tap(r=>this.updateCount(r.data?.items||[])));}
  clearCart(){return this.http.delete<any>(this.apiURL+'/clear',this.options()).pipe(tap(()=>this.cartCount.next(0)));}
  resetCount(){this.cartCount.next(0);}
  getGuestItems(){return this.guest.getItems();}
  addGuestItem(product:any,quantity:number){this.guest.addItem({productId:product._id,name:product.name,image:product.image,price:product.price,stock:product.stock,quantity});}
  updateGuest(productId:string,quantity:number){this.guest.update(productId,quantity);}
  removeGuest(productId:string){this.guest.remove(productId);}
  clearGuest(){this.guest.clear();}
  mergeGuestCart(){
    const items=this.guest.getItems(); if(!items.length||!localStorage.getItem('token')) return;
    forkJoin(items.map(i=>this.addToCart(i.productId,i.quantity))).subscribe({next:()=>{this.guest.clear();this.getCart().subscribe();},error:()=>this.getCart().subscribe()});
  }
}
