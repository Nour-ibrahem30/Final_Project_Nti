import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ISubmitTestimonial,ITestimonialRes,TestimonialStatus } from '../models/testimonial.model';
@Injectable({providedIn:'root'})
export class TestimonialService{
  private apiURL=environment.apiURL+'testimonial';
  constructor(private http:HttpClient){}
  private o(){return {headers:{Authorization:`Bearer ${localStorage.getItem('token')||''}`}}}
  getApprovedTestimonials(){return this.getApproved();}
  submitTestimonial(data:ISubmitTestimonial){return this.submit(data);}
  getAllTestimonials(){return this.getAll();}
  updateTestimonialStatus(id:string,status:any){return this.updateStatus(id,status);}
  deleteTestimonial(id:string){return this.delete(id);}
  getApproved(){return this.http.get<ITestimonialRes>(this.apiURL+'/testimonials');}
  submit(data:ISubmitTestimonial){return this.http.post<any>(this.apiURL+'/testimonials',data,this.o());}
  getAll(){return this.http.get<ITestimonialRes>(this.apiURL+'/admin',this.o());}
  updateStatus(id:string,status:TestimonialStatus){return this.http.put<any>(`${this.apiURL}/admin/${id}`,{status},this.o());}
  delete(id:string){return this.http.delete<any>(`${this.apiURL}/admin/${id}`,this.o());}
}
