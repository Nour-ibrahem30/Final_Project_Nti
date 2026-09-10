export interface ICat{_id:string;name:string;slug:string;isActive:boolean;createdAt:string;updatedAt:string;}
export interface InewCategory{name:string;slug?:string;isActive:boolean;}
export interface ICategory{success:boolean;message?:string;data:ICat[];}
export interface ISubCat{_id:string;name:string;slug:string;isActive:boolean;categoryId:{_id:string;name:string;slug:string};createdAt:string;updatedAt:string;}
export interface IUpdateSubCat{name:string;slug?:string;categoryId:string;isActive?:boolean;}
export interface ISubCategory{success:boolean;message?:string;data:ISubCat[];}
