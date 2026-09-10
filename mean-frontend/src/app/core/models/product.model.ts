export interface Iproduct {
  _id:string; name:string; description:string; price:number; stock:number; image:string; slug:string;
  isActive:boolean; isDeleted?:boolean; season:'summer'|'winter'|'spring'|'autumn'|'all'; soldCount?:number;
  categoryId:{_id:string; name:string; slug?:string}; subCategoryId:{_id:string; name:string; slug?:string};
  createdAt?:string; updatedAt?:string;
}
export interface product { name:string; description:string; price:number; stock:number; image?:string; slug?:string; isActive?:boolean; isDeleted?:boolean; season?:string; categoryId:string; subCategoryId:string; }
export interface IproductsRes { success:boolean; products:Iproduct[]; pagination:{total:number;page:number;pages:number;limit:number}; }
export interface IproductRes { success?:boolean; message:string; data?:Iproduct; products?:Iproduct; pagination:{total:number;page:number;pages:number;limit:number}; }
export interface Iproductdet { success?:boolean; message:string; data:Iproduct; related:Iproduct[]; }
export interface Iproductt { success:boolean; message:string; data:Iproduct; }
export interface IProductParams { page?:number; limit?:number; search?:string; category?:string; sub?:string; season?:string; minPrice?:string|number; maxPrice?:string|number; sort?:'new'|'top'; }
export interface Ipaginate { total:number; page:number; pages:number; limit:number; }
