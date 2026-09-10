import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IAddressBody,IAddressResponse,IAddressSingleResponse } from '../models/address.model';
@Injectable({providedIn:'root'})
export class AddressService{
  private apiURL=environment.apiURL+'address';
  constructor(private http:HttpClient){}
  private o(){return {headers:{Authorization:`Bearer ${localStorage.getItem('token')||''}`}}}
  getAddresses(){return this.http.get<IAddressResponse>(this.apiURL,this.o());}
  addAddress(data:IAddressBody){return this.http.post<IAddressSingleResponse>(this.apiURL,data,this.o());}
  updateAddress(id:string,data:IAddressBody){return this.http.put<IAddressSingleResponse>(`${this.apiURL}/${id}`,data,this.o());}
  deleteAddress(id:string){return this.http.delete<any>(`${this.apiURL}/${id}`,this.o());}
}
