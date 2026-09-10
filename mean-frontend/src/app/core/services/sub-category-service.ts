import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ISubCat, ISubCategory, IUpdateSubCat } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {
  private apiURL = environment.apiURL+ 'subcategory'
  constructor(private _http:HttpClient){}

   private getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };

  }
  getSubCategories(){
      return this._http.get<ISubCategory>(this.apiURL,this.getHeaders())
    }

    createSubCategory(data:ISubCat){
      return this._http.post<ISubCategory>(this.apiURL,data,this.getHeaders())
    }
    updateSubCategory(id:string,data:IUpdateSubCat){
      return this._http.put<ISubCategory>(`${this.apiURL}/${id}`,data,this.getHeaders())
    }
    deleteSubCategory(id:string){
      return this._http.delete<ISubCategory>(`${this.apiURL}/${id}`,this.getHeaders())
     
    }
}
