import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ICategory, InewCategory } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class Category {
  private apiURL = environment.apiURL+ 'category'
  constructor(private _http:HttpClient){}

   private getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };

  }
  getCategory(){
      return this._http.get<ICategory>(`${this.apiURL}`,this.getHeaders())
    }
  getAdminCategory(){
      return this._http.get<ICategory>(`${this.apiURL}/admin`,this.getHeaders())
    }
    createCategory(data:InewCategory){
      return this._http.post<ICategory>(this.apiURL,data,this.getHeaders())
    }
    updateCategory(id:string,data:InewCategory){
      return this._http.put<ICategory>(`${this.apiURL}/${id}`,data,this.getHeaders())
    }
    deleteCategory(id:string){
      return this._http.delete<ICategory>(`${this.apiURL}/${id}`,this.getHeaders())
    }
}
