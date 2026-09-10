import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
export interface INotification{_id:string;type:'new_order'|'new_testimonial';title:string;message:string;relatedId?:string;isRead:boolean;createdAt:string;}
@Injectable({providedIn:'root'})
export class NotificationService{
 private apiURL=environment.apiURL+'notification';
 constructor(private http:HttpClient){}
 private o(){return {headers:{Authorization:`Bearer ${localStorage.getItem('token')||''}`}}}
 getMy(){return this.http.get<{success:boolean;data:INotification[]}>(this.apiURL,this.o());}
 markRead(id:string){return this.http.put<any>(`${this.apiURL}/${id}/read`,{},this.o());}
}
