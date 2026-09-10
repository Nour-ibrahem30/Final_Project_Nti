import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IFAQ, IFAQBody, IFAQRes } from '../models/faq.model';

@Injectable({
  providedIn: 'root',
})
export class FaqService {

    private apiURL = environment.apiURL+ 'faqs'
    constructor(private _http:HttpClient){}

     private getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };

  }

  getFAQs(){
    return this._http.get<IFAQRes>(`${this.apiURL}/faqs`);
  }
  getAllFAQs(){
    return this._http.get<IFAQRes>(`${this.apiURL}/admin`,this.getHeaders());
  }
  createFAQ(data:IFAQBody){
    return this._http.post<IFAQRes>(`${this.apiURL}/admin`,data,this.getHeaders());
  }
  updateFAQ(id:string,data:IFAQBody){
    return this._http.put<IFAQRes>(`${this.apiURL}/admin/${id}`,data,this.getHeaders());
  }
  deleteFAQ(id:string){
    return this._http.delete<IFAQRes>(`${this.apiURL}/admin/${id}`,this.getHeaders());
  }

  
}
