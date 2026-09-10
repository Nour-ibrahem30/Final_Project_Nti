import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AddressService } from '../../core/services/address-service';
import { OrderService } from '../../core/services/order-service';
import { ICart } from '../../core/models/cart.model';
import { IAddress } from '../../core/models/address.model';
@Component({selector:'app-checkout',imports:[CommonModule,ReactiveFormsModule,RouterLink],templateUrl:'./checkout.html',styleUrl:'./checkout.css'})
export class Checkout implements OnInit{
 cart:ICart|null=null; addresses:IAddress[]=[]; selectedAddress:IAddress|null=null; showNewAddress=false; isLoading=false; errorMsg=''; successMsg='';
 form=new FormGroup({nationalId:new FormControl('',[Validators.required,Validators.pattern(/^\d{14}$/)]),addressId:new FormControl(''),newAddress:new FormGroup({label:new FormControl('Home'),governorate:new FormControl('',Validators.required),city:new FormControl('',Validators.required),street:new FormControl('',Validators.required),building:new FormControl('',Validators.required),apartment:new FormControl(''),isDefault:new FormControl(true)})});
 constructor(private cartService:CartService,private addressService:AddressService,private orderService:OrderService,private router:Router){}
 ngOnInit(){this.loadCart();this.loadAddresses();}
 loadCart(){this.cartService.getCart().subscribe({next:r=>this.cart=r.data,error:e=>this.errorMsg=e.error?.message||'Unable to load cart'});}
 loadAddresses(){this.addressService.getAddresses().subscribe({next:r=>{this.addresses=r.data||[];this.selectedAddress=this.addresses.find(a=>a.isDefault)||this.addresses[0]||null;if(this.selectedAddress)this.form.patchValue({addressId:this.selectedAddress._id});}});}
 toggleNewAddress(){this.showNewAddress=!this.showNewAddress;this.errorMsg='';}
 selectAddress(a:IAddress){this.selectedAddress=a;this.showNewAddress=false;this.form.patchValue({addressId:a._id});}
 get blocked(){return !!this.cart?.items.some(i=>i.isPriceChanged);}
 get subtotal(){return this.cart?.totalPrice||0;}
 placeOrder(){if(this.blocked){this.errorMsg='Resolve every changed product price before checkout.';return;} if(!this.selectedAddress&&!this.showNewAddress){this.errorMsg='Select or add a delivery address.';return;} if(this.form.invalid){this.form.markAllAsTouched();this.errorMsg='Enter a valid national ID and complete the address.';return;}this.isLoading=true;this.errorMsg='';const body:any={nationalId:this.form.value.nationalId};if(this.showNewAddress)body.newAddress=this.form.value.newAddress;else body.addressId=this.selectedAddress?._id;this.orderService.placeOrder(body).subscribe({next:()=>{this.isLoading=false;this.router.navigate(['/orders']);},error:e=>{this.isLoading=false;this.errorMsg=e.error?.message||'Order could not be placed.';}});}
}
