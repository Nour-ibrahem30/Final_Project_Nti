import { IOrder } from './order.model';
export interface IDeliveryZone {_id:string; governorate:string; fee:number; isActive:boolean;}
export interface IReport {from:string;to:string;totalMade:number;totalOrders:number;totalUsers:number;totalProducts:number;top5Products:{_id:string;name:string;quantity:number;revenue:number}[];}
export interface IDashboardResponse {success:boolean;reports:IReport;}
