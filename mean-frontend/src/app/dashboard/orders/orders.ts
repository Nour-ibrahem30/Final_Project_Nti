import { Component,OnInit } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { FormControl,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { AdminService } from '../../core/services/admin-service';
import { IOrder,OrderStatus } from '../../core/models/order.model';
@Component({selector:'app-orders',imports:[CommonModule,DatePipe,ReactiveFormsModule],templateUrl:'./orders.html',styleUrl:'./orders.css'})
export class Orders implements OnInit{
 orders:IOrder[]=[]; selected:IOrder|null=null; showForm=false; statusFilter=new FormControl('');
 statuses:OrderStatus[]=['pending','in progress','confirmed','shipped','delivered','refund'];
 statusForm=new FormGroup({status:new FormControl<OrderStatus>('pending',{nonNullable:true,validators:Validators.required})});
 constructor(private admin:AdminService){}
 ngOnInit(){this.load();this.statusFilter.valueChanges.subscribe(()=>this.load());}
 load(){this.admin.getAllOrders(this.statusFilter.value||undefined).subscribe({next:r=>this.orders=r.data||[]});}
 openEdit(o:IOrder){this.selected=o;this.statusForm.patchValue({status:o.status});this.showForm=true;}
 closeForm(){this.showForm=false;this.selected=null;}
 save(){if(!this.selected||this.statusForm.invalid)return;this.admin.updateOrderStatus(this.selected._id,this.statusForm.value.status!).subscribe({next:()=>{this.closeForm();this.load();}});}
 statusClass(s:string){return 'status-'+s.replace(/\s+/g,'-');}
}
