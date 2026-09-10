import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Iproductdet, IProductParams, IproductRes, IproductsRes, Iproductt, product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private _http:HttpClient){}
   private getHeaders(){
    const token = localStorage.getItem('token');
    return {
      headers:{
        Authorization:`Bearer ${token}`
      }
    };
  }
  private apiURL = environment.apiURL+ 'product';


 getProducts(params?: IProductParams) {
  const query = new URLSearchParams();

  if (params) {
    Object.keys(params).forEach(key => {
      const value = params[key as keyof IProductParams];
      if (value !== null && value !== undefined && value !== '') {
        query.append(key, value.toString());
      }
    });
  }

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return this._http.get<IproductsRes>(`${this.apiURL}${queryString}`);
}

  getProductDetails(slug:string){
      return this._http.get<Iproductdet>(this.apiURL+'/get/'+ slug);
  }

  getAdminProducts(params?: IProductParams) {
  const query = new URLSearchParams();
  if (params) {
    Object.keys(params).forEach(key => {
      const value = params[key as keyof IProductParams];
      if (value !== null && value !== undefined && value !== '') {
        query.append(key, value.toString());
      }
    });
  }
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return this._http.get<IproductsRes>(
    `${this.apiURL}/admin${queryString}`,
    this.getHeaders() 
  );
}
  createProduct(data: FormData){
    return this._http.post<Iproductt>(`${this.apiURL}`,data,this.getHeaders());

  }
  updateProduct(productId:string, data:FormData){
    return this._http.put<Iproductt>(`${this.apiURL}/${productId}`,data,this.getHeaders());
  }

  deleteProduct(productId:string){
    return this._http.delete<Iproductt>(`${this.apiURL}/${productId}`,this.getHeaders())
  }
  
  
  
  
}
