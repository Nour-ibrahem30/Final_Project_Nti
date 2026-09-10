export type OrderStatus = 'pending'|'in progress'|'confirmed'|'shipped'|'delivered'|'refund';
export interface IOrderItem { productId:string; name:string; image:string; priceAtOrder:number; quantity:number; }
export interface IOrderAddress { label?:string; governorate:string; city:string; street:string; building:string; apartment?:string; }
export interface IUserOrder { _id:string; name:string; email:string; phone:string; }
export interface IStatusHistory { _id?:string; status:OrderStatus; changedBy:string; changedAt:string; }
export interface IOrder { _id:string; userId:IUserOrder|string; orderNumber:string; items:IOrderItem[]; orderedAt:string; address:string; governorate:string; deliveryFee:number; totalPrice:number; customer:{name:string;phone:string;nationalId:string}; paymentMethod:'cash_on_delivery'; status:OrderStatus; statusHistory:IStatusHistory[]; refundRequestedAt?:string; createdAt?:string; }
export interface IOrderBody { addressId?:string; nationalId:string; newAddress?:IOrderAddress; }
export interface IOrderResponse { success:boolean; message:string; data:IOrder; }
export interface IOrderListResponse { success:boolean; data:IOrder[]; }
export interface IOrderParams { status?:OrderStatus|null; }
