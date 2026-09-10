import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IContact, IContactBody, IContactRes } from '../models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
     private apiURL = environment.apiURL+ 'contacts'
        constructor(private _http:HttpClient){}
    
         private getHeaders() {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
    
      }
    
     
      getContacts(){
        return this._http.get<IContactRes>(`${this.apiURL}/contact`,this.getHeaders());
      }
      submitContact(data:IContact){
        return this._http.post<IContactRes>(`${this.apiURL}/admin`,data,this.getHeaders());
      }
      markContactRead(id:string,data:IContactBody){
        return this._http.put<IContactRes>(`${this.apiURL}/admin/${id}`,data,this.getHeaders());
      }
     
    }
