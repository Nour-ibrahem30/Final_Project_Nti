export interface ICartProduct { _id:string; name:string; image:string; price:number; stock:number; isActive:boolean; isDeleted?:boolean; slug:string; }
export interface ICartItem { _id:string; productId:ICartProduct; priceAtOrder:number; isPriceChanged:boolean; quantity:number; }
export interface ICart { _id:string; userId:string; items:ICartItem[]; totalPrice:number; createdAt:string; updatedAt:string; }
export interface ICartResponse { success:boolean; message:string; data:ICart; }
