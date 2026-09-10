import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IUpdateProfile,IUserRes,IUserSingle } from '../models/user.model';
@Injectable({providedIn:'root'})
export class UserService{
  private apiURL=environment.apiURL+'users';
  constructor(private http:HttpClient){}
  private o(){return {headers:{Authorization:`Bearer ${localStorage.getItem('token')||''}`}}}
  getProfile(){return this.http.get<IUserSingle>(this.apiURL+'/me',this.o());}
  updateProfile(data:IUpdateProfile){return this.http.put<IUserSingle>(this.apiURL+'/me',data,this.o());}
  updateProfileWithImage(data:FormData){return this.http.put<IUserSingle>(this.apiURL+'/me',data,this.o());}
  getUsers(){return this.http.get<IUserRes>(this.apiURL,this.o());}
  deleteUser(id:string){return this.http.delete<any>(`${this.apiURL}/${id}`,this.o());}
}
