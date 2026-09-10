export interface IUserAddress { _id:string; label:string; governorate:string; city:string; street:string; building:string; apartment?:string; isDefault:boolean; }
export interface IUser { _id:string; name:string; email:string; phone:string; gender:'male'|'female'; role:'user'|'admin'; dob?:string; isBlocked:boolean; addresses:IUserAddress[]; orderHistory:string[]; image?:string|null; createdAt:string; }
export interface IUserRes { success:boolean; data:IUser[]; }
export interface IUserSingle { success:boolean; data:IUser; }
export interface IUpdateProfile { name?:string; email?:string; phone?:string; gender?:string; dob?:string; password?:string; }
