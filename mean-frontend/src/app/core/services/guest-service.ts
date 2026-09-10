import { Injectable } from '@angular/core';
import { IGuestCartItem } from '../models/guest.model';
@Injectable({providedIn:'root'})
export class GuestService {
  private readonly key='ea_guest_cart';
  getItems():IGuestCartItem[]{ try{return JSON.parse(localStorage.getItem(this.key)||'[]') as IGuestCartItem[]}catch{return [];} }
  addItem(item:IGuestCartItem){ const items=this.getItems(); const found=items.find(x=>x.productId===item.productId); if(found) found.quantity+=item.quantity; else items.push({...item}); this.save(items); }
  update(productId:string,quantity:number){ const items=this.getItems().map(x=>x.productId===productId?{...x,quantity}:x).filter(x=>x.quantity>0); this.save(items); }
  remove(productId:string){this.save(this.getItems().filter(x=>x.productId!==productId));}

  updateItem(productId:string,quantity:number){this.update(productId,quantity);}
  removeItem(productId:string){this.remove(productId);}
  clear(){localStorage.removeItem(this.key);}
  private save(items:IGuestCartItem[]){localStorage.setItem(this.key,JSON.stringify(items));}
}
