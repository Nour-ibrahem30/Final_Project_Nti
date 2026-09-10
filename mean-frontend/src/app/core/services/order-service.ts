import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IOrderBody,IOrderListResponse,IOrderParams,IOrderResponse,OrderStatus } from '../models/order.model';
@Injectable({providedIn:'root'})
export class OrderService{
  private apiURL=environment.apiURL+'orders';
  constructor(private http:HttpClient){}
  private o(){return {headers:{Authorization:`Bearer ${localStorage.getItem('token')||''}`}}}
  placeOrder(data:IOrderBody){return this.http.post<IOrderResponse>(this.apiURL,data,this.o());}
  getMyOrders(){return this.http.get<IOrderListResponse>(this.apiURL+'/my-orders',this.o());}
  getOrderById(id:string){return this.http.get<IOrderResponse>(`${this.apiURL}/${id}`,this.o());}
  requestRefund(id:string){return this.http.post<any>(`${this.apiURL}/${id}/refund-request`,{},this.o());}
  getAllOrders(status?:OrderStatus|null){return this.http.get<IOrderListResponse>(this.apiURL+'/admin/all',{...this.o(),params:status?{status}:{} });}
  updateOrderStatus(id:string,status:OrderStatus){return this.http.put<IOrderResponse>(`${this.apiURL}/${id}/status`,{status},this.o());}
}
