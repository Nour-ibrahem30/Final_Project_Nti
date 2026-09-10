export type TestimonialStatus='pending'|'approved'|'declined';
export interface ITestimonial { _id:string; userId:{_id:string;name:string;email:string;image?:string}; message:string; rating:number; status:TestimonialStatus; createdAt:string; updatedAt?:string; }
export interface ITestimonialRes { success:boolean; data:ITestimonial[]; message?:string; }
export interface ISubmitTestimonial { message:string; rating:number; }
