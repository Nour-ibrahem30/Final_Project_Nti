import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IDashboardResponse,IDeliveryZone } from '../models/admin.model';
import { IUserRes } from '../models/user.model';
@Injectable({providedIn:'root'})
export class AdminService{
  private apiURL=environment.apiURL+'admin';
  constructor(private http:HttpClient){}
  private o(){return {headers:{Authorization:`Bearer ${localStorage.getItem('token')||''}`}}}
  getReport(startDate?:string,endDate?:string){return this.getReports(startDate,endDate);}
  getAllOrders(status?:any){ const value=typeof status==='string'?status:status?.status; return this.http.get<any>(environment.apiURL+'orders/admin/all',{...this.o(),params:value?{status:value}:{}}); }
  updateOrderStatus(id:string,status:any){ return this.http.put<any>(environment.apiURL+`orders/${id}/status`,{status},this.o()); }
  getReports(startDate?:string,endDate?:string){let params:any={};if(startDate)params.startDate=startDate;if(endDate)params.endDate=endDate;return this.http.get<IDashboardResponse>(this.apiURL+'/reports',{...this.o(),params});}
  getDeliveryZones(){return this.http.get<{success:boolean;data:IDeliveryZone[]}>(this.apiURL+'/delivery-zones',this.o());}
  saveDeliveryZone(data:Partial<IDeliveryZone>){return this.http.put<any>(this.apiURL+'/delivery-zones',data,this.o());}
  blockUser(id:string){return this.http.put<any>(`${this.apiURL}/users/${id}/block`,{},this.o());}
}
