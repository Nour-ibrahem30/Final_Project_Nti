import { Component,OnInit } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order-service';
import { IOrder } from '../../core/models/order.model';
@Component({selector:'app-orders',imports:[CommonModule,DatePipe,RouterLink],templateUrl:'./orders.html',styleUrl:'./orders.css'})
export class Orders implements OnInit{
 orders:IOrder[]=[];message='';
 constructor(private service:OrderService){}
 ngOnInit(){this.load();}
 load(){this.service.getMyOrders().subscribe({next:r=>this.orders=r.data||[],error:e=>this.message=e.error?.message||'Unable to load orders'});}
 refund(o:IOrder){if(o.status!=='delivered')return;this.service.requestRefund(o._id).subscribe({next:r=>{this.message=r.message;o.refundRequestedAt=new Date().toISOString();},error:e=>this.message=e.error?.message||'Refund request failed'});}
}
