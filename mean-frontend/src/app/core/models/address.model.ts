export interface IAddress { _id:string; label:string; governorate:string; city:string; street:string; building:string; apartment?:string; isDefault:boolean; }
export interface IAddressBody { label?:string; governorate:string; city:string; street:string; building:string; apartment?:string; isDefault?:boolean; }
export interface IAddressResponse { success:boolean; message:string; data:IAddress[]; }
export interface IAddressSingleResponse { success:boolean; message:string; data:IAddress; }
